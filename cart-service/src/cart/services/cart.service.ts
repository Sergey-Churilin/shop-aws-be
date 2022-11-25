import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { v4 } from 'uuid';

import { Cart } from '../models';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: Number(PG_PORT),
  database: 'postgres',
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};
@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  findByUserId(userId: string): Cart {
    return this.userCarts[userId];
  }

  createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      items: [],
    };

    this.userCarts[userId] = userCart;

    return userCart;
  }

  findOrCreateByUserId(userId: string): Cart {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async getCart(cartId: string): Promise<Cart> {
    const client = new Client(dbOptions);
    await client.connect();

    try {
      const {
        rows: [cart],
      } = await client.query(`select * from carts where id = '${cartId}'`);
      const { rows: items } = await client.query(
        `select * from cart_items where cart_id = '${cartId}'`,
      );
      return {
        ...cart,
        items,
      };
    } catch (error) {
      console.log('CATCH ERROR: ', error);
      return {} as Cart;
    } finally {
      await client.end();
    }
  }

  updateByUserId(userId: string, { items }: Cart): Cart {
    const { id, ...rest } = this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId): void {
    this.userCarts[userId] = null;
  }
}
