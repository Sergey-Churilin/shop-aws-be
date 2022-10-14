import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import AWS from "aws-sdk";
import { uuid } from "uuidv4";
import schema from "./schema";
import { Product } from "@libs/product";
// import validator from "@middy/validator";

const dynamo = new AWS.DynamoDB.DocumentClient();

const createProductTransaction = async ({ title, description, price, id, count }: Product) => {
    return dynamo
        .transactWrite({
            TransactItems: [
                {
                    Put: {
                        Item: {
                            id,
                            title,
                            description,
                            price
                        },
                        TableName: process.env.TABLE_NAME
                    }
                },
                {
                    Put: {
                        Item: {
                            product_id: id,
                            count
                        },
                        TableName: process.env.TABLE_NAME_STOCKS
                    }
                }
            ]
        })
        .promise();
};

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(`POST /product called product: ${event.body.product}`);
    try {
        const { title, description, price, count } = event.body;
        if (title && description && price && count) {
            const id = uuid();
            await createProductTransaction({ title, description, price, id, count });
            return formatJSONResponse(id);
        } else {
            return formatJSONResponse({ message: "Bad request for put" }, 400);
        }
    } catch (e) {
        return formatJSONResponse({ message: "Server create error" }, 500);
    }
};

export const main = middyfy(createProduct); /*.use(
    validator({
        inputSchema: schema
    })
)*/
