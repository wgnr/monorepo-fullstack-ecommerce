import { GlobalVars } from "@config/globalVars";
import { PATHS, getToken, post } from "@db/seeds/requests";
import { mockUsers } from "@db/seeds/users.seed";
import { mockCategory } from "@db/seeds/categories.seed";
import { mockOptions } from "@db/seeds/options.seed";
import { mockProduct } from "@db/seeds/products.seed";
import { mockCarts } from "@db/seeds/carts.seed";
import { mockOrders, mockPay } from "@db/seeds/orders.seed";
import { startServer, shutDownServer } from "@root/server";

const {
  IS_TEST,
  seed: { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_SERVER_API_URL },
} = GlobalVars;

const populateData = async () => {
  try {
    console.log("Populating db...");
    const token = await getToken(
      SEED_SERVER_API_URL,
      SEED_ADMIN_EMAIL,
      SEED_ADMIN_PASSWORD
    );

    console.log("Populate Users");
    const users = await Promise.all(
      mockUsers.map(payload =>
        post(token, SEED_SERVER_API_URL, PATHS.USERS, payload)
      )
    );

    console.log("Populate Categories");
    const categories = await Promise.all(
      mockCategory.map(payload =>
        post(token, SEED_SERVER_API_URL, PATHS.CATEGORIES, payload)
      )
    );

    console.log("Populate Options");
    const options = await Promise.all(
      mockOptions.map(payload =>
        post(token, SEED_SERVER_API_URL, PATHS.OPTIONS, payload)
      )
    );

    console.log("Populate Products");
    const [products] = await Promise.all(
      mockProduct(categories, options).map(payload =>
        post(token, SEED_SERVER_API_URL, PATHS.PRODUCTS, payload)
      )
    );

    console.log("Populate Carts");
    const carts = await Promise.all(
      // @ts-ignore
      mockCarts(users, products).map(({ cartId, payload }) =>
        post(token, SEED_SERVER_API_URL, PATHS.CARTS + "/" + cartId, payload)
      )
    );

    console.log("Populate Orders");
    const orders = await Promise.all(
      mockOrders(carts).map(payload =>
        post(token, SEED_SERVER_API_URL, PATHS.ORDERS, payload)
      )
    );
    const payedOrder = await post(
      token,
      SEED_SERVER_API_URL,
      PATHS.ORDERS + "/" + orders[0]._id,
      mockPay
    );

    console.log("INFO CREATED:");
    console.log(
      JSON.stringify(
        {
          users,
          categories,
          options,
          products,
          carts,
          orders,
          payedOrder,
        },
        null,
        1
      )
    );
  } catch (e) {
    console.error(e);
  }
};

(async () => {
  if (IS_TEST) await startServer();

  await populateData();

  if (IS_TEST) await shutDownServer();
})();
