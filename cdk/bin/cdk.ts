#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {AwsCognitoAuthTrialStack} from '../lib/aws-cognito-auth-trial-stack';
import {VpcStack} from "../lib/vpc-stack";
import {EcrStack} from "../lib/ecr-stack";

const env = {
    account: process.env.CDK_DEPLOY_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION,
};

const app = new cdk.App();
new VpcStack(app, 'VpcStack', {env});
new EcrStack(app, 'VpcStack', {env});
new AwsCognitoAuthTrialStack(app, 'AwsCognitoAuthTrialStack', {env});
