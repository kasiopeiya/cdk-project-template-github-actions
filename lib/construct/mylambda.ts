import { Construct } from 'constructs'
import { type NodejsFunctionProps, NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { type LogGroupProps, LogGroup } from 'aws-cdk-lib/aws-logs'
import * as lambda_ from 'aws-cdk-lib/aws-lambda'
import { RemovalPolicy } from 'aws-cdk-lib'

interface MyNodejsFunctionProps {
  lambda: NodejsFunctionProps
  logs?: LogGroupProps
}

export class MyNodejsFunction extends Construct {
  public readonly func: NodejsFunction
  public readonly logGroup: LogGroup

  constructor(scope: Construct, id: string, props: MyNodejsFunctionProps) {
    super(scope, id)

    // Lambda Function
    this.func = new NodejsFunction(this, 'LambdaFunc', {
      ...props.lambda,
      runtime: lambda_.Runtime.NODEJS_20_X,
      architecture: lambda_.Architecture.ARM_64
    })

    // CloudWatch Logs: LogGroup
    this.logGroup = new LogGroup(this, 'LogGroup', {
      ...props.logs,
      logGroupName: `/aws/lambda/${this.func.functionName}`,
      removalPolicy: props.logs?.removalPolicy ?? RemovalPolicy.DESTROY
    })
  }
}
