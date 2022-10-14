import { productsList } from "./productsList.js";
import * as dotenv from "dotenv";
dotenv.config();
// Load the AWS SDK for Node.js
import AWS from "aws-sdk";

// Load credentials and set Region from JSON file
AWS.config.loadFromPath("../config.json");

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const myTableProducts = process.env.TABLE_NAME;
const myTableStocks = process.env.TABLE_NAME_STOCKS;

productsList.forEach(({ title, description, id, price }) => {
    const params = {
        TableName: myTableProducts,
        Item: {
            id: { S: `${id}` },
            title: { S: `${title}` },
            description: { S: `${description}` },
            price: { N: `${price}` }
        }
    };
    postItem(params);
});

productsList.forEach(({ id, count }) => {
    const params = {
        TableName: myTableStocks,
        Item: {
            product_id: { S: `${id}` },
            count: { N: `${count}` }
        }
    };
    postItem(params);
});

function postItem(params) {
    ddb.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}
