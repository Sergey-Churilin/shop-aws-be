import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
import schema from "./schema";
import { Product, ProductSchema, Stock } from "@libs/product";

const dynamo = new AWS.DynamoDB.DocumentClient();
const scanProducts = async () => {
    const productResult = await dynamo.scan({ TableName: process.env.TABLE_NAME }).promise();
    return productResult.Items;
};
const scanStocks = async () => {
    const stocksResult = await dynamo.scan({ TableName: process.env.TABLE_NAME_STOCKS }).promise();
    return stocksResult.Items;
};

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
    console.log(`GET products called`);
    try {
        const [scanProductsResult, scanStocksResult] = await Promise.all([scanProducts(), scanStocks()]);
        const products: Record<string, Product> = {};
        scanProductsResult.forEach((p: ProductSchema) => {
            // @ts-ignore
            products[p.id] = p;
        });
        scanStocksResult.forEach((p: Stock) => {
            products[p.product_id].count = p.count;
        });
        const productsList: Product[] = Object.values(products);
        return formatJSONResponse(productsList);
    } catch (e) {
        return formatJSONResponse({ message: "Server get all error" }, 500);
    }
};

export const main = middyfy(getProductsList);
