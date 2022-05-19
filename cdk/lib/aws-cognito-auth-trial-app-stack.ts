import {Duration, RemovalPolicy, Stack, StackProps, Tags} from 'aws-cdk-lib';
import {Peer, Port, SecurityGroup, Vpc} from 'aws-cdk-lib/aws-ec2';
import {Construct} from 'constructs';
import {AwsLogDriver, Cluster, ContainerImage, EcrImage, FargateTaskDefinition, Protocol} from "aws-cdk-lib/aws-ecs";
import {DnsRecordType, PrivateDnsNamespace, Service} from "aws-cdk-lib/aws-servicediscovery";
import {ApplicationLoadBalancedFargateService} from "aws-cdk-lib/aws-ecs-patterns";
import {ManagedPolicy} from "aws-cdk-lib/aws-iam";
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {StringParameter} from "aws-cdk-lib/aws-ssm";

export class AwsCognitoAuthTrialAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // VPC
        const vpc = Vpc.fromLookup(this, 'Vpc', {vpcName: 'aws-cognito-auth-trial-vpc'});

        const appName = 'aws-cognito-auth-trial';

        // ECS Cluster
        const ecsCluster = new Cluster(this, 'EcsCluster', {
            clusterName: appName,
            vpc,
        });

        // ECR
        const containerImageTag = 'latest';
        const repository = Repository.fromRepositoryName(this, 'EcrRepository', appName);
        const containerImage = EcrImage.fromEcrRepository(repository, containerImageTag);

        // Task Definition
        const taskDefinition = new FargateTaskDefinition(this, 'TaskDefinition', {
            family: appName,
            memoryLimitMiB: 1024,
            cpu: 256,
        });

        // Log configuration
        const awsLogDriver = new AwsLogDriver({
            logGroup: new LogGroup(this, 'LogGroup', {
                logGroupName: appName,
                retention: RetentionDays.THREE_MONTHS,
                removalPolicy: RemovalPolicy.DESTROY,
            }),
            streamPrefix: appName,
        });

        // Cognito Auth configurations
        const cognitoUserPoolId = StringParameter.valueFromLookup(this, 'COGNITO_AUTH_USER_POOL_ID');
        const cognitoWebClientId = StringParameter.valueFromLookup(this, 'COGNITO_AUTH_USER_POOL_WEB_CLIENT_ID');

        // Application Container
        const containerDefinition = taskDefinition.addContainer('Container', {
            image: containerImage,
            memoryLimitMiB: 768,
            logging: awsLogDriver,
            environment: {
                // Cognito Auth configurations
                NEXT_PUBLIC_AUTH_REGION: 'ap-northeast-1',
                NEXT_PUBLIC_AUTH_USER_POOL_ID: cognitoUserPoolId,
                NEXT_PUBLIC_AUTH_USER_POOL_WEB_CLIENT_ID: cognitoWebClientId,
                NEXT_PUBLIC_AUTH_COOKIE_STORAGE_DOMAIN: 'auth-trial.morningcode.io',
                // conceal source codes
                GENERATE_SOURCEMAP: 'false',
                // hash for deployment
                DEPLOY_HASH: process.env.GIT_SHA1 as string,
            },
        });
        containerDefinition.addPortMappings({
            hostPort: 3000,
            containerPort: 3000,
            protocol: Protocol.TCP,
        });

        // XRay
        // https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon-ecs.html
        const xrayContainer = taskDefinition.addContainer('XRayContainer', {
            containerName: 'xray-daemon',
            image: ContainerImage.fromRegistry('amazon/aws-xray-daemon:3.x'),
            cpu: 32,
            memoryLimitMiB: 256,
            memoryReservationMiB: 256,
            portMappings: [
                {containerPort: 2000, protocol: Protocol.UDP},
            ],
        });

        xrayContainer.taskDefinition.taskRole.addManagedPolicy(
            ManagedPolicy.fromAwsManagedPolicyName('AWSXRayDaemonWriteAccess'),
        );

        // Security Group
        const ecsSecurityGroup = new SecurityGroup(this, 'EcsSg', {
            securityGroupName: `${appName}-sg`,
            allowAllOutbound: true,
            vpc,
        });

        ecsSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(3000), 'allow access to Artemis API - Beta');

        // ECS - Fargate with ALB
        const fargateService = new ApplicationLoadBalancedFargateService(this, 'ECSService', {
            cluster: ecsCluster,
            serviceName: appName,
            loadBalancerName: `${appName}-alb`,
            desiredCount: 1,
            taskDefinition,
            securityGroups: [ecsSecurityGroup],
            publicLoadBalancer: true,
        });

        fargateService.targetGroup.configureHealthCheck({
            path: '/api/healthz',
        });

        // Cloud Map
        // CloudMap Namespace
        const namespace = new PrivateDnsNamespace(this, 'Namespace', {
            name: 'morningcode.internal-io',
            vpc,
        });

        const cloudMapService = new Service(this, 'Service', {
            name: 'auth-trial',
            namespace,
            dnsRecordType: DnsRecordType.A_AAAA,
            dnsTtl: Duration.seconds(30),
            loadBalancer: true,
        });

        cloudMapService.registerLoadBalancer('LB', fargateService.loadBalancer);

        Tags.of(this).add('ServiceName', 'morningcode');
    }
}
