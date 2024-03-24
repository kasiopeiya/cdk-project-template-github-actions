import { type Environment } from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

export interface Config {
    env: Environment
    prefix: string
    vpcId: string
    InstanceType: ec2.InstanceType
}

export const devConfig: Config = {
    env: {
        account: '533267250677',
        region: 'ap-northeast-1'
    },
    prefix: 'kasio-dev',
    vpcId: 'bbbbbbbbbb',
    InstanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO)
}

export const prodConfig: Config = {
    env: {
        account: '134161968696',
        region: 'ap-northeast-1'
    },
    prefix: 'kasio-prod',
    vpcId: 'bbbbbbbbbb',
    InstanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.SMALL)
}
