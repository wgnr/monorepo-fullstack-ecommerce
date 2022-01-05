import request from "supertest";
import { GlobalVars } from "@config/index";
import { connectServices, closeServices } from "@root/appServices";
import { httpServer as app } from "@root/app";
import { ICartAddItem } from "@models/entities/carts/carts.interface";
import {
  IOrderNew,
  OrderStatus,
  IOrderPayment,
} from "@models/entities/orders/orders.interface";
import { UserType, IUserNewPublic } from "@models/entities/users/users.interface";
import { CartStatus } from "@models/entities/carts/carts.interface";

const baseUrl = "/api";

beforeAll(async () => {
  await connectServices(GlobalVars.db);
});

afterAll(async () => {
  await closeServices();
});

const mockedUser: IUserNewPublic = {
  email: `mock-name-${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, "-")}@mock-domain.com`,
  firstName: "mock-name",
  lastName: "mock-last-name",
  password: "holisholis",
};

let mockUserToken: string;
let mockUserId: string;
let mockUserCartId: string;
let productId: string;
let variantId: string;
let orderId: string;
let orderTotal: number;

describe("Complete purchase cycle", () => {
  it("should register a new account", async () => {
    const { body: user } = await request(app)
      .post(`${baseUrl}/auth/signup`)
      .send(mockedUser)
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201);

    expect(user).toBeDefined();
    expect(user.email).toBe(mockedUser.email);
    expect(user.firstName).toBe(mockedUser.firstName);
    expect(user.lastName).toBe(mockedUser.lastName);
    expect(user.type).toBe(UserType.USER);
    expect(user.currentCart).toBeDefined();
    expect(user.password).not.toBeDefined();
  });

  it("should log in", async () => {
    const { email, password } = mockedUser;

    const {
      body: { token },
    } = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({ email, password })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(typeof token).toBe("string");
    expect(token).toMatch(/\w{1,}.\w{1,}.\w{1,}/);
    mockUserToken = token;
  });

  it("should get the current cartId", async () => {
    const path = `${baseUrl}/users`;

    const { body: user } = await request(app)
      .get(path)
      .auth(mockUserToken, { type: "bearer" })
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(Array.isArray(user)).toBeFalsy();
    expect(user._id).toBeDefined();
    expect(user.password).not.toBeDefined();
    expect(user.currentCart).toBeDefined();

    mockUserCartId = user.currentCart;
    mockUserId = user._id;
  });

  it("should list products", async () => {
    const path = `${baseUrl}/products`;

    const { body: products } = await request(app)
      .get(path)
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(Array.isArray(products)).toBeTruthy();
    expect(products.length).toBeGreaterThan(0);

    const product = products[0];

    expect(product._id).toBeDefined();

    productId = product._id;
  });

  it("should get a product populated", async () => {
    const path = `${baseUrl}/products/${productId}/populated`;

    const { body: product } = await request(app)
      .get(path)
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(Array.isArray(product)).toBeFalsy();
    expect(product.price).toBeGreaterThan(0);
    expect(product.name).toBeDefined();

    const { variants } = product;
    expect(Array.isArray(variants)).toBeTruthy();
    expect(variants.length).toBeGreaterThan(0);

    const variant = variants[0];
    expect(variant._id).toBeDefined();
    expect(variant.stock).toBeGreaterThan(0);
    expect(variant.stock - variant.stockInCheckout).toBeGreaterThan(0);

    variantId = variant._id;
  });

  it("should add variant to cart", async () => {
    const path = `${baseUrl}/cart/${mockUserCartId}`;
    const payload: ICartAddItem[] = [
      {
        comment: `Comment ${new Date().toISOString()}`,
        quantity: 1,
        variantId,
      },
    ];

    const { body: cart } = await request(app)
      .post(path)
      .auth(mockUserToken, { type: "bearer" })
      .set("Accept", "application/json")
      .send(payload)
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(Array.isArray(cart)).toBeFalsy();
    expect(cart.status).toBe(CartStatus.OPEN);
    expect(cart._id).toBe(mockUserCartId);
    expect(cart.user).toBe(mockUserId);

    const { variants } = cart;
    expect(Array.isArray(variants)).toBeTruthy();
    expect(variants.length).toBeGreaterThan(0);

    const itemInCart = variants[0];
    expect(itemInCart.quantity).toBe(payload[0].quantity);
    expect(itemInCart.comment).toBe(payload[0].comment);
    expect(itemInCart.variant).toBe(payload[0].variantId);
  });

  it("should create a new order", async () => {
    const path = `${baseUrl}/orders`;
    const payload: IOrderNew = {
      cartId: mockUserCartId,
      payload: {
        address: {
          street: "Johan Stresse",
          streetNumber: "2125 5A",
          CP: "2000",
        },
        contactName: mockedUser.firstName,
        email: mockedUser.email,
        phone: "+5490000000000",
      },
    };

    const { body: order } = await request(app)
      .post(path)
      .auth(mockUserToken, { type: "bearer" })
      .set("Accept", "application/json")
      .send(payload)
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(Array.isArray(order)).toBeFalsy();
    expect(order.status).toBe(OrderStatus.AWAITING_PAYMENT);
    expect(order.payload).toEqual(payload.payload);
    expect(Array.isArray(order.details)).toBeTruthy();
    expect(order.details.length).toBe(1);
    expect(order._id).toBeDefined();
    expect(order.cart).toBe(mockUserCartId);
    expect(order.total).toBeGreaterThan(0);
    expect(order.user).toBe(mockUserId);
    expect(order.orderNumber).toBeDefined();

    orderId = order._id;
    orderTotal = order.total;
  });

  it("should create a new order", async () => {
    const path = `${baseUrl}/orders/${orderId}`;
    const payload: IOrderPayment = {
      method: "cash",
      paymentNumber: `mock-${new Date().toISOString()}`,
      totalPayed: orderTotal,
    };

    const { body: order } = await request(app)
      .post(path)
      .auth(mockUserToken, { type: "bearer" })
      .set("Accept", "application/json")
      .send(payload)
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(Array.isArray(order)).toBeFalsy();
    expect(order.status).toBe(OrderStatus.COMPLETED);
    expect(order.cart.status).toBe(CartStatus.PURCHASED);
    expect(order.total).toBe(orderTotal);
    expect(order.payment).toEqual(payload);
  });

  it("should have a new cart assigned", async () => {
    const path = `${baseUrl}/cart`;

    const { body: cart } = await request(app)
      .get(path)
      .auth(mockUserToken, { type: "bearer" })
      .expect("Content-Type", /application\/json/)
      .expect(200);

    expect(Array.isArray(cart)).toBeFalsy();
    expect(cart.status).toBe(CartStatus.OPEN);
    expect(cart.user).toBe(mockUserId);
    expect(cart._id).not.toBe(mockUserCartId);

    const { variants } = cart;
    expect(Array.isArray(variants)).toBeTruthy();
    expect(variants.length).toBe(0);
  });
});
