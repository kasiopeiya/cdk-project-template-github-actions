import * as cdk from 'aws-cdk-lib'
import { type Construct } from 'constructs'
import * as codecommit from 'aws-cdk-lib/aws-codecommit'
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep
} from 'aws-cdk-lib/pipelines'

interface CdkPipelineStackProps extends cdk.StackProps {
  devStage: cdk.Stage
  prodStage: cdk.Stage
}

export class CdkPipelineStack extends cdk.Stack {
  public readonly repo: codecommit.Repository

  constructor(scope: Construct, id: string, props: CdkPipelineStackProps) {
    super(scope, id, props)

    // CodeCommit
    const repo = new codecommit.Repository(this, 'CdkPipelineRepo', {
      repositoryName: 'cdk-pipeline-repository'
    })

    // Pipeline
    const devPipeline = new CodePipeline(this, 'DevCDKPipeline', {
      pipelineName: 'Dev-CDK-Pipeline',
      crossAccountKeys: true,
      selfMutation: false,
      enableKeyRotation: true,
      synth: new CodeBuildStep('SynthStep', {
        input: CodePipelineSource.codeCommit(repo, 'dev'),
        installCommands: ['npm install -g aws-cdk'],
        commands: ['npm ci', 'npm run test ./test/dev/fineGrained', 'npx cdk synth']
      })
    })
    devPipeline.addStage(props.devStage)

    const prodPipeline = new CodePipeline(this, 'ProdCDKPipeline', {
      pipelineName: 'Prod-CDK-Pipeline',
      crossAccountKeys: true,
      selfMutation: false,
      enableKeyRotation: true,
      synth: new CodeBuildStep('SynthStep', {
        input: CodePipelineSource.codeCommit(repo, 'main'),
        installCommands: ['npm install -g aws-cdk'],
        commands: ['npm ci', 'npm run test ./test/prod/fineGrained', 'npx cdk synth']
      })
    })
    const deployStage = prodPipeline.addStage(props.prodStage)
    deployStage.addPre(new ManualApprovalStep('Approval'))
  }
}
