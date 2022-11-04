import type { AWS } from "@serverless/typescript";

import { importProductsFile, importFileParser } from "@functions/index";

const serverlessConfiguration: AWS = {
    service: "import-service",
    frameworkVersion: "3",
    plugins: ["serverless-esbuild", "serverless-auto-swagger"],
    useDotenv: true,
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        region: "eu-west-1",
        stage: "dev",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
            BUCKET_NAME: "${env:BUCKET_NAME}",
            UPLOADED_FOLDER: "${env:UPLOADED_FOLDER}",
            PARSED_FOLDER: "${env:PARSED_FOLDER}",
            REGION: "${env:REGION}",
            SQS_URL: "${env:SQS_URL}",
            SQS_ARN: "${env:SQS_ARN}"
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["s3:ListBucket"],
                Resource: ["arn:aws:s3:::${env:BUCKET_NAME}"]
            },
            {
                Effect: "Allow",
                Action: ["s3:GetObject", "s3:CopyObject", "s3:DeleteObject"],
                Resource: "arn:aws:s3:::${env:BUCKET_NAME}/*"
            },
            {
                Effect: "Allow",
                Action: "sqs:SendMessage",
                Resource: "${env:SQS_ARN}"
            }
        ]
    },
    // import the function via paths
    functions: { importProductsFile, importFileParser },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ["aws-sdk"],
            target: "node14",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10
        }
    }
};

module.exports = serverlessConfiguration;
