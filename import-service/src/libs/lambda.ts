import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

export const middyfy = (handler, useBodyParser: boolean = true) => {
    let middyResponse = middy(handler);
    if (useBodyParser) {
        middyResponse = middyResponse.use(middyJsonBodyParser());
    }
    return middyResponse;
};
