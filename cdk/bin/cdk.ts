#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {AwsCognitoAuthTrialAppStack} from '../lib/aws-cognito-auth-trial-app-stack';
import {VpcStack} from "../lib/vpc-stack";
import {EcrStack} from "../lib/ecr-stack";

const env = {
  account: process.env.CDK_DEPLOY_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION,
};

const app = new cdk.App();
new VpcStack(app, 'AwsCognitoAuthTrialVpcStack', {env});
new EcrStack(app, 'AwsCognitoAuthTrialEcrStack', {env});
new AwsCognitoAuthTrialAppStack(app, 'AwsCognitoAuthTrialAppStack', {env});
