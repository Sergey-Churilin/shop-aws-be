import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import cors from "@middy/http-cors";

export const middyfy = (handler, useBodyParser: boolean = true, useCors: boolean = true) => {
    let middyResponse = middy(handler);
    if (useBodyParser) {
        middyResponse = middyResponse.use(middyJsonBodyParser());
    }
    if (useCors) {
        middyResponse = middyResponse.use(cors());
    }
    return middyResponse;
};
