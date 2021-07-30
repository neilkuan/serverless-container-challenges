import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ServerlessContainerConstructsChallenges from '../lib/serverless-container-constructs-challenges'

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ServerlessContainerConstructsChallenges.ServerlessContainerConstructsChallengesStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource( 'AWS::ECS::TaskDefinition', {
      "ContainerDefinitions": [
        {
          "Essential": true,
          "Image": {
            "Fn::Join": [
              "",
              [
                {
                  "Ref": "AWS::AccountId"
                },
                ".dkr.ecr.",
                {
                  "Ref": "AWS::Region"
                },
                ".",
                {
                  "Ref": "AWS::URLSuffix"
                },
                "/aws-cdk/assets:03559170bbc8886593748134416c64613bce218ad534c4835724e6b50c2ef258"
              ]
            ]
          },
          "Name": "mycontainer",
          "PortMappings": [
            {
              "ContainerPort": 80,
              "Protocol": "tcp"
            }
          ]
        }
      ],
      "Cpu": "256",
      "ExecutionRoleArn": {
        "Fn::GetAtt": [
          "mytaskExecutionRole723A70CB",
          "Arn"
        ]
      },
      "Family": "MyTestStackmytask301A81E3",
      "Memory": "512",
      "NetworkMode": "awsvpc",
      "RequiresCompatibilities": [
        "FARGATE"
      ],
      "TaskRoleArn": {
        "Fn::GetAtt": [
          "mytaskTaskRole223F6A84",
          "Arn"
        ]
      }
    }));
});
