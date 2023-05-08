import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import record_exceptions from '@functions/record_exceptions';

const serverlessConfiguration: AWS = {
  service: 'bugtrapper-api',
  frameworkVersion: '3',
  plugins:
    [
      'serverless-esbuild',
      'serverless-offline',
      'serverless-dotenv-plugin'
    ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { hello, record_exceptions },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 3002,
      lambdaPort: 4000
    }
  },
};

module.exports = serverlessConfiguration;
