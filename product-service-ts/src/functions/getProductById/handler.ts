import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
import schema from "./schema";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient();
const queryProduct = async (id) => {
    const result = await dynamo
        .query({ TableName: process.env.TABLE_NAME, KeyConditionExpression: "id = :id", ExpressionAttributeValues: { ":id": id } })
        .promise();
    return result.Items[0];
};

const getStock = async (id) => {
    const result = await dynamo.get({ TableName: process.env.TABLE_NAME_STOCKS, Key: { product_id: id } }).promise();
    return result.Item;
};

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        const { productId } = event.pathParameters;
        console.log(`GET products/{productId} called, productId: ${event.pathParameters.productId}`);
        const [product, stock] = await Promise.all([queryProduct(productId), getStock(productId)]);

        if (product) {
            return formatJSONResponse({ ...product, count: stock.count });
        } else {
            return formatJSONResponse({ message: "Product not found" }, 404);
        }
    } catch (e) {
        return formatJSONResponse({ message: "Server get one error" }, 500);
    }
};

export const main = middyfy(getProductById);
