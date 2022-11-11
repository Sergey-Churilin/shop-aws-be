import { middyfy } from "@libs/lambda";
import { SQSEvent } from "aws-lambda";
import { addProductToDB } from "../../services/product";
import AWS from "aws-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const sns = new AWS.SNS({ region: process.env.REGION });

const catalogBatchProcess = async (event: SQSEvent) => {
    try {
        let noItems = 0;
        const products = event.Records.map(({ body }) => JSON.parse(body));
        for (const product of products) {
            await addProductToDB(product);
            if (!product.count) {
                noItems = 1;
            }
            sns.publish(
                {
                    Subject: `Items in stock ${noItems ? "doesn't exist" : "exist"}`,
                    Message: JSON.stringify(product),
                    MessageAttributes: {
                        noItems: {
                            DataType: "Number",
                            StringValue: noItems.toString()
                        }
                    },
                    TopicArn: process.env.SNS_ARN
                },
                (err) => {
                    if (err) {
                        console.log("SNS error occur", err);
                    } else {
                        console.log("Send email to needed users");
                    }
                }
            );
        }
    } catch (e) {
        console.log("Failed to add products to DB", e);
    }
};

export const main = middyfy(catalogBatchProcess, false, false);
