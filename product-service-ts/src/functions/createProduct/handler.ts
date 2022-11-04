import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { addProductToDB } from "../../services/product";
import { ProductRequest } from "@libs/product";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const product: ProductRequest = event.body as ProductRequest;
    console.log(`POST /product called product: ${product}`);
    return addProductToDB(product);
};

export const main = middyfy(createProduct); /*.use(
    validator({
        inputSchema: schema
    })
)*/
