export default {
    type: "array",
    items: {
        type: "object",
        properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            count: { type: "number" }
        }
    }
} as const;
