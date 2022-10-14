export type Stock = {
    product_id: string;
    count: number;
};

export type ProductSchema = {
    id: string;
    title: string;
    description: string;
    price: number;
};

export type Product = Omit<Stock, "product_id"> & ProductSchema;
