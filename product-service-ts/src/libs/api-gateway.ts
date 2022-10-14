import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

const headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "https://d2ykvchm0vckyx.cloudfront.net",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
};

export const formatJSONResponse = (response: any, code: number = 200) => {
    return {
        headers,
        statusCode: code,
        body: JSON.stringify(response)
    };
};
