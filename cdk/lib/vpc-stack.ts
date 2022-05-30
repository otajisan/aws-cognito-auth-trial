import {Stack, StackProps, Tags} from "aws-cdk-lib";
import {Construct} from "constructs";
import {
  CfnEIP,
  CfnInternetGateway,
  CfnNatGateway,
  CfnVPCGatewayAttachment,
  RouterType,
  Subnet,
  Vpc
} from "aws-cdk-lib/aws-ec2";

export class VpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Vpc
    const vpc = new Vpc(this, 'Vpc', {
      vpcName: 'aws-cognito-auth-trial-vpc',
      maxAzs: 2,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [],
    });

    // Public Subnets
    const publicSubnet1 = new Subnet(this, 'PublicSubnet1a', {
      availabilityZone: 'ap-northeast-1a',
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.0.0/24',
    });

    const publicSubnet2 = new Subnet(this, 'PublicSubnet1c', {
      availabilityZone: 'ap-northeast-1c',
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.1.0/24',
    });

    // Private Subnets
    const privateSubnet1 = new Subnet(this, 'PrivateSubnet1a', {
      availabilityZone: 'ap-northeast-1a',
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.10.0/24',
    });

    const privateSubnet2 = new Subnet(this, 'PrivateSubnet1c', {
      availabilityZone: 'ap-northeast-1c',
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.11.0/24',
    });

    // Internet Gateway
    const internetGateway = new CfnInternetGateway(this, 'InternetGateway', {});

    // Add route to Public Subnets
    // NOTE: to access Public Subnets from the external
    new CfnVPCGatewayAttachment(this, 'gateway', {
      vpcId: vpc.vpcId,
      internetGatewayId: internetGateway.ref,
    });

    publicSubnet1.addRoute('PublicSubnetRoute', {
      routerType: RouterType.GATEWAY,
      routerId: internetGateway.ref,
    });

    publicSubnet2.addRoute('PublicSubnetRoute', {
      routerType: RouterType.GATEWAY,
      routerId: internetGateway.ref,
    });

    // EIP for NAT Gateway
    const eip1 = new CfnEIP(this, 'ElasticIP1', {});
    //const eip2 = new CfnEIP(this, 'ElasticIP2', {});

    // NAT Gateway
    const natGateway1 = new CfnNatGateway(this, 'NatGateway1', {
      allocationId: eip1.attrAllocationId,
      subnetId: publicSubnet1.subnetId,
    });
    // const natGateway2 = new CfnNatGateway(this, 'NatGateway2', {
    //     allocationId: eip2.attrAllocationId,
    //     subnetId: publicSubnet2.subnetId,
    // });

    privateSubnet1.addRoute('PrivateSubnetRoute1', {
      routerType: RouterType.NAT_GATEWAY,
      routerId: natGateway1.ref,
    });
    // privateSubnet2.addRoute('PrivateSubnetRoute2', {
    //     routerType: RouterType.NAT_GATEWAY,
    //     routerId: natGateway2.ref,
    // });

    Tags.of(this).add('ServiceName', 'morningcode');
  }
}
