'use strict';
import { productsList } from '../productsList.js';
import { headers } from '../utils/headers.js';

export const getProductById = async event => {
    try {
        const { productId } = event.pathParameters;
        const product = productsList.find(p => p.id === productId);
        if (product) {
            return {
                statusCode: 200,
                body: JSON.stringify(product),
                headers
            };
        } else {
            return {
                statusCode: 404,
                body: 'Product not found',
                headers
            };
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: 'Server error',
        };
    }
};