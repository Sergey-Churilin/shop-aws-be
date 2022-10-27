export default {
    type: "object",
    properties: {
        description: { type: "string" },
        title: { type: "string" },
        price: { type: "number" },
        count: { type: "number" }
    },
    required: ["description", "title", "price", "count"]
} as const;
