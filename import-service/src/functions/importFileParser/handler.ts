import { middyfy } from "@libs/lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import AWS from "aws-sdk";
import { S3Event } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import * as dotenv from "dotenv";
dotenv.config();

const importFileParser = async (event: S3Event) => {
    const { REGION = "", UPLOADED_FOLDER = "", PARSED_FOLDER = "", BUCKET_NAME = "", SQS_URL = "" } = process.env;
    const s3 = new AWS.S3({
        signatureVersion: "v4",
        region: REGION
    });
    const s3Client = new S3Client({ region: REGION });
    try {
        const Bucket = BUCKET_NAME;
        const sqs = new AWS.SQS();
        for (const record of event.Records) {
            const Key = record.s3.object.key;
            const bucketObject = await s3Client.send(
                new GetObjectCommand({
                    Bucket,
                    Key
                })
            );
            await new Promise((resolve) => {
                bucketObject.Body.pipe(csv())
                    .on("data", (data) => {
                        sqs.sendMessage(
                            {
                                QueueUrl: SQS_URL,
                                MessageBody: JSON.stringify({ ...data })
                            },
                            (err) => {
                                if (err) {
                                    console.log("SQS error occur ON DATA", err);
                                } else {
                                    console.log(`Send message with: ${JSON.stringify(data)}`);
                                }
                            }
                        );
                    })
                    .on("error", (err) => {
                        console.log("ON ERROR", err);
                    })
                    .on("end", async () => {
                        console.log(`Copy from ${Bucket}/${Key}`);

                        await s3
                            .copyObject({
                                Bucket,
                                CopySource: `${Bucket}/${Key}`,
                                Key: Key.replace(UPLOADED_FOLDER, PARSED_FOLDER)
                            })
                            .promise();
                        console.log(`Copied into ${Bucket}/${Key.replace(UPLOADED_FOLDER, PARSED_FOLDER)}`);

                        await s3
                            .deleteObject({
                                Bucket,
                                Key
                            })
                            .promise();

                        resolve(null);
                    });
            });
        }
        return formatJSONResponse({ message: "ok" });
    } catch (e) {
        console.log("ERROR", e);
        return formatJSONResponse({ message: "ERROR" }, 500);
    }
};

export const main = middyfy(importFileParser, false);
