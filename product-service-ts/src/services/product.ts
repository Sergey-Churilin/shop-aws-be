import { Product, ProductRequest } from "@libs/product";
import { formatJSONResponse } from "@libs/api-gateway";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
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

const parseProduct = (product: ProductRequest): Partial<Product> => {
    const { title, description } = product;
    const count = parseInt(product.count);
    const price = parseFloat(product.price);
    return {
        title,
        description,
        price,
        count
    };
};

export const addProductToDB = async (product: ProductRequest) => {
    try {
        const { title, description, price, count } = parseProduct(product);
        if (title && description && price && count >= 0) {
            const id = uuidv4();
            await createProductTransaction({ title, description, price, id, count });
            return formatJSONResponse(id);
        } else {
            return formatJSONResponse({ message: "Bad request for put" }, 400);
        }
    } catch (e) {
        console.log("addProductToDB Server create error");
        return formatJSONResponse({ message: "Server create error" }, 500);
    }
};
