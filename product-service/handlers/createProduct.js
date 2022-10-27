"use strict";
import { headers } from "../utils/headers.js";
import AWS from "aws-sdk";
import { uuid } from "uuidv4";

const dynamo = new AWS.DynamoDB.DocumentClient();
const put = async (item) => {
    console.log("Pushed item is ", item);
    return dynamo.put({ TableName: process.env.TABLE_NAME, Item: item }).promise();
};

export const createProduct = async (event) => {
    try {
        const { title, description, price, count } = JSON.parse(event.body);
        if (title && description && price && count) {
            const id = uuid();
            const putResults = await put({ title, description, count, price, id });

            return {
                statusCode: 200,
                body: JSON.stringify(putResults),
                headers
            };
        } else {
            return {
                statusCode: 400,
                body: "Bad request for put",
                headers
            };
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: "Server create error"
        };
    }
};
