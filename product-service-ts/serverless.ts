import type { AWS } from "@serverless/typescript";

import { getProductById, getProductsList, createProduct } from "@functions/index";

const serverlessConfiguration: AWS = {
    service: "product-service-3",
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
            TABLE_NAME: "${env:TABLE_NAME}",
            TABLE_NAME_STOCKS: "${env:TABLE_NAME_STOCKS}"
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["dynamodb:Query", "dynamodb:Scan", "dynamodb:GetItem", "dynamodb:PutItem"],
                Resource: "*"
            }
        ],
        httpApi: {
            cors: true
        }
    },
    // import the functions via paths
    functions: { getProductById, getProductsList, createProduct },
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
