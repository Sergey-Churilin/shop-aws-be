'use strict';
import { productsList } from '../productsList.js';
import { headers } from '../utils/headers.js';

export const getProductsList = async () => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify(productsList),
            headers
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: 'Server error',
        };
    }
};