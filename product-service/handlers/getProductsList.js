"use strict";
import { headers } from "../utils/headers.js";
import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();
const scan = async () => {
    const result = await dynamo.scan({ TableName: process.env.TABLE_NAME }).promise();
    return result.Items;
};

export const getProductsList = async () => {
    try {
        const scanResults = await scan();
        return {
            statusCode: 200,
            body: JSON.stringify(scanResults),
            headers
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: "Server get all error"
        };
    }
};
