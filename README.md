# Serverless Container Challenges

## First Challenge: Run a Serverless Container via AWS CDK.
- [x] Run a Serverless Container via DualAlbFargateService() (from [cdk-fargate-patterns](https://github.com/pahud/cdk-fargate-patterns)).
- [x] Alias load balancer dns domain name on yourself Domain.
- [x] Open `https://my.domain` get the result.

### To diff:
```bash
cdk diff -c arn="arn:aws:acm:ap-northeast-1:123456789012:certificate/3e4r5t6y-3e3e-2w2w-1q1q-x1x1x1x1x1x" -c zoneId="Z2345erty456722ws" -c zoneName="example.com"
```

### To deploy:
```bash
cdk deploy -c arn="arn:aws:acm:ap-northeast-1:123456789012:certificate/3e4r5t6y-3e3e-2w2w-1q1q-x1x1x1x1x1x" -c zoneId="Z2345erty456722ws" -c zoneName="example.com"
```

### To destroy:
```bash
cdk destroy
```