import type { AWS } from "@serverless/typescript";

import { getProductById, getProductsList, createProduct, catalogBatchProcess } from "@functions/index";

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
            TABLE_NAME_STOCKS: "${env:TABLE_NAME_STOCKS}",
            REGION: "${env:REGION}",
            SQS_URL: "${env:SQS_URL}",
            SNS_ARN: {
                Ref: "SNSTopic"
            }
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["dynamodb:Query", "dynamodb:Scan", "dynamodb:GetItem", "dynamodb:PutItem"],
                Resource: "*"
            },
            {
                Effect: "Allow",
                Action: ["sqs:DeleteMessage", "sqs:GetQueueAttributes", "sqs:ReceiveMessage"],
                Resource: "${env:SQS_ARN}"
            },
            {
                Effect: "Allow",
                Action: ["sns:Publish"],
                Resource: {
                    Ref: "SNSTopic"
                }
            }
        ],
        httpApi: {
            cors: true
        }
    },
    resources: {
        Resources: {
            SQSQueue: {
                Type: "AWS::SQS::Queue",
                Properties: {
                    QueueName: "catalogItemsQueue"
                }
            },
            SNSTopic: {
                Type: "AWS::SNS::Topic",
                Properties: {
                    TopicName: "createProductTopic"
                }
            },
            SNSSubscription: {
                Type: "AWS::SNS::Subscription",
                Properties: {
                    Endpoint: "${env:EMAIL}",
                    Protocol: "email",
                    TopicArn: {
                        Ref: "SNSTopic"
                    }
                }
            },
            SNSSubscriptionNoItems: {
                Type: "AWS::SNS::Subscription",
                Properties: {
                    Endpoint: "${env:EMAIL2}",
                    Protocol: "email",
                    TopicArn: {
                        Ref: "SNSTopic"
                    },
                    FilterPolicy: { noItems: [{ numeric: ["=", 1] }] }
                }
            }
        }
    },

    // import the functions via paths
    functions: { getProductById, getProductsList, createProduct, catalogBatchProcess },
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
