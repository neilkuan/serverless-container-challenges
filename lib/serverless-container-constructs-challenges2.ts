import { DualAlbFargateService } from 'cdk-fargate-patterns';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as alias from '@aws-cdk/aws-route53-targets';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as r53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';


export interface ServerlessContainerChallenges2 {
  readonly defaultVpc?: boolean;
  readonly certArn?: string;
  readonly hostedZoneId?: string;
  readonly zoneName?: string;
  readonly recordName?: string;
  readonly image?: ecs.ContainerImage;
  readonly containerPort?: number;
}

export class ServerlessContainerConstructsChallenges2 extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props?: ServerlessContainerChallenges2) {
    super(scope, id);
    const vpc = props?.defaultVpc ? ec2.Vpc.fromLookup(this, 'defVpc', { isDefault: true }) : new ec2.Vpc(this, 'newVpc', { natGateways: 1 }); 
    
    const mytask = new ecs.FargateTaskDefinition(this, 'mytask', {
      cpu: 256,
      memoryLimitMiB: 512,
    });
    const cert = props?.certArn ? acm.Certificate.fromCertificateArn(this, 'Cert', props?.certArn) : undefined;
    mytask.addContainer('mycontainer', {
      image: props?.image ?? ecs.ContainerImage.fromAsset(path.join(__dirname, '../nyancat-demo')),
      portMappings: [
    { containerPort: 80 }],
    });
    const myservice = new DualAlbFargateService(this, this.node.id, {
      vpc,
      clusterProps: {
        clusterName: 'Challage2Cluster'
      },
      tasks: [
        {
          task: mytask,
          serviceName: this.node.id,
          external: cert ? { port: 443, certificate: [cert] } : { port: 80 },
          capacityProviderStrategy: [{
            capacityProvider: 'FARGATE_SPOT',
            weight: 1,
          }]
        }
      ],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      }
    });
    if (props?.hostedZoneId && props?.zoneName) {
      const ar = new r53.ARecord(this, 'dnsRecord', {
        comment: 'Serverless Container Challenges',
        ttl: cdk.Duration.seconds(60),
        zone: r53.HostedZone.fromHostedZoneAttributes(this, 'myzone',{
          zoneName: props?.zoneName,
          hostedZoneId: props?.hostedZoneId,
        }),
        target: r53.RecordTarget.fromAlias(new alias.LoadBalancerTarget(myservice.externalAlb!)),
        recordName: props.recordName ?? 'serverless-container-constructs-challenges',
      });
      new cdk.CfnOutput(this, 'url', {
        value: `https://${ar.domainName}`,
      });
    };
  }
}
