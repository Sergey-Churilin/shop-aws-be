import { handlerPath } from "@libs/handler-resolver";
import * as dotenv from "dotenv";
dotenv.config();

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "get",
                path: "import",
                cors: true,
                request: {
                    parameters: {
                        querystrings: {
                            name: true
                        }
                    }
                },
                authorizer: {
                    name: "BasicAuthorizer",
                    arn: `${process.env.AUTH_LAMBDA_ARN}`,
                    resultTtlInSeconds: 0,
                    identitySource: "method.request.header.Authorization",
                    type: "token"
                }
            }
        }
    ]
};
