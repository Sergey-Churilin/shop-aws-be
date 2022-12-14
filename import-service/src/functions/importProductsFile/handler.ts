import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
import schema from "./schema";
import * as dotenv from "dotenv";
dotenv.config();

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { REGION = "", UPLOADED_FOLDER = "", BUCKET_NAME = "" } = process.env;
    const fileName = event.queryStringParameters?.name;
    if (!fileName) {
        return formatJSONResponse(
            {
                message: `Bad request`,
                event
            },
            400
        );
    }
    const filePath = `${UPLOADED_FOLDER}/${fileName}`;
    const s3 = new AWS.S3({
        signatureVersion: "v4",
        region: REGION
    });
    const params = {
        Bucket: BUCKET_NAME,
        Key: filePath,
        Expires: 60,
        ContentType: "text/csv"
    };

    try {
        const url = await s3.getSignedUrlPromise("putObject", params);
        return formatJSONResponse({
            url
        });
    } catch (e) {
        console.log(e);
        return formatJSONResponse(
            {
                message: e.message
            },
            500
        );
    }
};

export const main = middyfy(importProductsFile);
