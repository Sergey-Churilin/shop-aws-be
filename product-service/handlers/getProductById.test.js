import { getProductById } from "./getProductById.js";
import { headers } from "../utils/headers.js";

describe("getProductById", () => {
    it("Should return code 200 with correct data", async () => {
        const product = {
            count: 4,
            description: "Short Product Description1",
            id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            price: 2.4,
            title: "ProductOne"
        };
        const res = await getProductById({ pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" } });
        expect(res).toEqual({
            statusCode: 200,
            body: JSON.stringify(product),
            headers
        });
    });

    it("Should return code 404 when product not found", async () => {
        const res = await getProductById({ pathParameters: "7567ec4b" });
        expect(res).toEqual({
            statusCode: 404,
            body: "Product not found",
            headers
        });
    });

    it("Should return code 500 when data is not provided", async () => {
        const res = await getProductById();
        expect(res).toEqual({
            statusCode: 500,
            body: "Server error"
        });
    });
});
