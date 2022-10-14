import { getProductsList } from "./getProductsList.js";
import { productsList } from "../productsList.js";
import { headers } from "../utils/headers.js";

describe("getProductsList", () => {
    it("Should return code 200 with correct data", async () => {
        const res = await getProductsList();
        expect(res).toEqual({
            statusCode: 200,
            body: JSON.stringify(productsList),
            headers
        });
    });
});
