#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { Aspects, Stack } from 'aws-cdk-lib'
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag'

import { DevStage } from '../lib/stage/devStage'
import { ProdStage } from '../lib/stage/prodStage'
import { devConfig, prodConfig } from '../config'
import { nagSuppressions } from './nagSuppressions'
import { CdkPipelineStack } from '../lib/stack/cdkPipelineStack'

const app = new cdk.App()

const devStage_ = new DevStage(app, 'dev', {
  env: devConfig.env
})

const prodStage_ = new ProdStage(app, 'prod', {
  env: prodConfig.env
})

new CdkPipelineStack(app, 'kasio-dev-pipeline-stack', {
  env: devConfig.env,
  devStage: devStage_,
  prodStage: prodStage_
})

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
for (const node of app.node.children) {
  if (Stack.isStack(node)) {
    NagSuppressions.addStackSuppressions(node, nagSuppressions)
  }
}
