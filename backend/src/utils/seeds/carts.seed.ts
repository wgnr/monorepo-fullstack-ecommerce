import { ICartAddItem } from "@models/entities/carts/carts.interface";

export const mockCarts = (users: any, products: any) => {
  return users.map((user: any) => {
    const cartId = user.currentCart;
    const payload: ICartAddItem[] = [
      {
        variantId:
          products[Math.random() > 0.5 ? 0 : 1].variants[
            Math.random() > 0.5 ? 0 : 1
          ],
        quantity: ~~(Math.random() * 10),
        comment: `Optional coment ${user.firstName}`,
      },
      {
        variantId:
          products[Math.random() > 0.5 ? 0 : 1].variants[
            Math.random() > 0.5 ? 2 : 3
          ],
        quantity: ~~(Math.random() * 8),
      },
    ];

    return { cartId, payload };
  });
};
