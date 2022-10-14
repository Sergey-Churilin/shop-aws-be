"use strict";
import AWS from "aws-sdk";
import { headers } from "../utils/headers.js";

const dynamo = new AWS.DynamoDB.DocumentClient();
const query = async (id) => {
    const result = await dynamo
        .query({ TableName: process.env.TABLE_NAME, KeyConditionExpression: "id = :id", ExpressionAttributeValues: { ":id": id } })
        .promise();
    return result.Items[0];
};

export const getProductById = async (event) => {
    try {
        const { productId } = event.pathParameters;
        const product = await query(productId);
        if (product) {
            return {
                statusCode: 200,
                body: JSON.stringify(product),
                headers
            };
        } else {
            return {
                statusCode: 404,
                body: "Product not found",
                headers
            };
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: "Server get one error"
        };
    }
};
