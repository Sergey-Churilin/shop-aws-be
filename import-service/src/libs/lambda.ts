import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";

export const middyfy = (handler, useBodyParser: boolean = true) => {
    if (useBodyParser) {
        return middy(handler).use(middyJsonBodyParser());
    } else {
        return middy(handler);
    }
};
