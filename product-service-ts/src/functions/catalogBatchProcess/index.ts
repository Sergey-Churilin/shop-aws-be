import { handlerPath } from "@libs/handler-resolver";
import * as dotenv from "dotenv";
dotenv.config();

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            sqs: {
                arn: process.env.SQS_ARN,
                batchSize: 5
            }
        }
    ]
};
