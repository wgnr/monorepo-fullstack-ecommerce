import fetch from "node-fetch";

export enum PATHS {
  CATEGORIES = "/api/categories",
  /* {
    "products": [],
    "_id": "610de55cdbcece62f8c8f226",
    "name": "qqq"
} */
  OPTIONS = "/api/options",
  /* {
    "_id": "610de581dbcece62f8c8f22a",
    "name": "fulxcxano",
    "values": [
        {
            "_id": "610de581dbcece62f8c8f22b",
            "value": "XS"
        },
        {
            "_id": "610de581dbcece62f8c8f22c",
            "value": "S"
        }
    ]
} */
  PRODUCTS = "/api/products",
  /* [
    {
        "categories": [
            "60fdcfc4eb935c4aa0351b99"
        ],
        "photos": [],
        "price": 14.22,
        "variants": [
            "610dd8c201adcf4bb0da7434",
            "610dd8c201adcf4bb0da7435"
        ],
        "_id": "610dd8c201adcf4bb0da742e",
        "name": "with PIC",
        "createdAt": "2021-08-07T00:50:10.072Z",
        "updatedAt": "2021-08-07T00:50:10.438Z"
    }
] */

  USERS = "/api/auth/signup",
  /* {
    "type": "USER",
    "_id": "610de67fdbcece62f8c8f230",
    "email": "pedro08@pedris.com",
    "firstName": "Pedro",
    "lastName": "Abraham",
    "password": "$2a$10$z9VPlHuRkfqjYSuzIgXakuFeqd.7PqV9kwNtymcpegXWFDhIonFt.",
    "currentCart": "610de67fdbcece62f8c8f231",
    "createdAt": "2021-08-07T01:48:47.565Z",
    "updatedAt": "2021-08-07T01:48:47.565Z",
    "id": "610de67fdbcece62f8c8f230"
  } */

  CARTS = "/api/cart",
  /* {
      "status": "OPEN",
      "_id": "6106f5588477be391049fbb3",
      "variants": [
          {
              "quantity": 2,
              "_id": "610df7f9541291460c125eb3",
              "comment": "2 XX",
              "variant": "60fdd02a1b644e0b3c696e38"
          },
          {
              "quantity": 2,
              "_id": "610df7f9541291460c125eb4",
              "comment": "7 aa",
              "variant": "60fdd02a1b644e0b3c696e39"
          }
      ],
      "user": "6106f48f8477be391049fb94",
      "createdAt": "2021-08-01T19:26:16.475Z",
      "updatedAt": "2021-08-07T03:03:21.687Z"
  } */
  ORDERS = "/api/orders",
}

const optionsPOST = (body: {}, token?: string) => ({
  method: "post",
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
  },
});

export const getToken = async (
  base_url: string,
  email: string,
  password: string
) => {
  try {
    const res = await fetch(
      `${base_url}/api/auth/login`,
      optionsPOST({ email, password })
    );
    const { token } = await res.json();
    return token;
  } catch (err) {
    console.log(err.message);
  }
};
/* {
    "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjgzMDA2NTMsImV4cCI6MTYyODMwNjY1Mywic3ViIjoiNjEwOTMzMDdlZWE2OWYwNGQwNGEwNmE2In0.AkurrEscXCiiA_V2C8p-4zeSTVk9cf5BnnX6UiZ04RkFpKkdCvQeePdLfzxehtyav3KbzvmYXFyjjOY4VSj5PQ"
} */

export const post = async (
  token: string,
  base_url: string,
  path: string,
  payload: any
) => {
  try {
    const res = await fetch(`${base_url}${path}`, optionsPOST(payload, token));
    return await res.json();
  } catch (err) {
    console.log(err.message);
  }
};
