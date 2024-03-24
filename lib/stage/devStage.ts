import { type Stack, type StageProps } from 'aws-cdk-lib'
import { type Construct } from 'constructs'

import { devConfig } from '../../config'
import { CommonStage } from './commonStage'

export class DevStage extends CommonStage {
  public readonly stacks: Record<string, Stack>
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props)
    this.stacks = this.createStacks()
    // new BaseStack(this, `${devConfig.prefix}-base-stack`, { env: devConfig.env })
  }

  createStacks(): Record<string, Stack> {
    // 各環境にのみデプロイするスタックを生成
    // const hogeStack = new HogeStack(this, 'HogeStack')
    return {
      ...super.createStacks(this, devConfig)
      // hogeStack
    }
  }
}
