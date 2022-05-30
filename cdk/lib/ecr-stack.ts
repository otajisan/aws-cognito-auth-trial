import {RemovalPolicy, Stack, StackProps, Tags} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Repository, TagMutability} from "aws-cdk-lib/aws-ecr";

export class EcrStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const repository = new Repository(this, 'AwsCognitoAuthTrialRepository', {
      repositoryName: 'aws-cognito-auth-trial',
      imageScanOnPush: true,
      imageTagMutability: TagMutability.MUTABLE,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    repository.addLifecycleRule({maxImageCount: 10});

    Tags.of(this).add('ServiceName', 'morningcode');
  }
}
