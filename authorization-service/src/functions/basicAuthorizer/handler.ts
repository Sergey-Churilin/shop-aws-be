import { middyfy } from "@libs/lambda";

import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerHandler } from "aws-lambda";

const generatePolicy = (principalId, resource, effect = "Deny") => {
    return {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
};

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, _, cb): Promise<APIGatewayAuthorizerResult> => {
    console.log("Event ", JSON.stringify(event));

    if (event["type"] !== "TOKEN") {
        cb("Unauthorized");
    }

    try {
        const authorizationToken = event.authorizationToken;

        const encodedCreds = authorizationToken.split(" ")[1];
        const buff = Buffer.from(encodedCreds, "base64");
        const [username, password] = buff.toString("utf-8").split(":");

        console.log(`username: ${username}, password: ${password}`);

        const storedUserPassword = process.env[username];
        const effect = !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

        return generatePolicy(encodedCreds, event.methodArn, effect);
    } catch (e) {
        cb(`Unauthorized: ${e.message}`);
    }
};

export const main = middyfy(basicAuthorizer);
