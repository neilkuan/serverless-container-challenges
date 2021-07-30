#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ServerlessContainerChallengesStack } from '../lib/serverless-container-challenges-stack';
const env = {
    region: process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_DEFAULT_ACCOUNT,
  };
const app = new cdk.App();
new ServerlessContainerChallengesStack(app, 'ServerlessContainerChallengesStack', {
  defaultVpc: true,
  // will give value from cdk deploy -c arn=xxxx -c zoneId=xxxx -c zoneName=xxxx 
  certArn: app.node.tryGetContext('arn'),
  hostedZoneId: app.node.tryGetContext('zoneId'),
  zoneName: app.node.tryGetContext('zoneName'),
  env,
});
