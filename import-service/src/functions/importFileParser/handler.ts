import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
import { S3Event } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import csv from "csv-parser";
import * as dotenv from "dotenv";
dotenv.config();

const importFileParser = async (event: S3Event) => {
    const s3 = new AWS.S3({
        signatureVersion: "v4",
        region: "eu-west-1"
    });
    try {
        const Bucket = process.env.BUCKET_NAME;
        const s3Client = new S3Client({ region: "eu-west-1" });
        for (const record of event.Records) {
            const Key = record.s3.object.key;
            const bucketObject = await s3Client.send(
                new GetObjectCommand({
                    Bucket,
                    Key
                })
            );

            bucketObject.Body.pipe(csv())
                .on("data", (data) => {
                    console.log("ON DATA", data);
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
                            Key: Key.replace("uploaded", "parsed")
                        })
                        .promise();
                    console.log(`Copied into ${Bucket}/${Key.replace("uploaded", "parsed")}`);

                    await s3
                        .deleteObject({
                            Bucket,
                            Key
                        })
                        .promise();
                });
        }
    } catch (e) {
        console.log("ERROR", e);
    }
};

export const main = middyfy(importFileParser, false);
