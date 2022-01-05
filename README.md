# Nodejs Express E-Commerce API

Complete functional E-Commerce API. This is the final project of the Node JS backend
development program taught by
[CODERHOUSE](https://www.coderhouse.com/online/programacion-backend). It's a nodejs
Express backend that uses MongoDB.

Features:

- A product can have multiple options which means you can have any combination of
  attributes that characterize the product. Ex. The same kind of cloth can have a
  variety of sizes and colors.
- CRUD for entities management:
  - Categories
  - Products
  - Options
  - Carts
  - Orders
  - Users
- Passport + JWT Auth
- Inventory reservations and discounting are handled by Mongo transactions.
- Small chat implemented with Socket.io
- Email notification on successful purchase (sent with nodemailer)

## Documentation

Swagger documentation:

- [Live](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/wgnr/nodejs-express-ecommerce/main/API-swagger.yaml)
- [Local](./API-swagger.yaml)

Postman collection:

- [Live](https://documenter.getpostman.com/view/15950009/TzskENv9)
- [Local](./API_E-commerce.postman_collection.json)

## Try it

You can try it [locally](#locally) or [remotely](#remotely).

### Remotely

There is an instance deployed in [heroku](https://wgnr-ecommerce.herokuapp.com/). You
can test it with this
[live Postman API](https://documenter.getpostman.com/view/15950009/TzskENv9#intro).

### Locally

> _This project uses node v14. Preferently use
> [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)._

> _You should also need a [Mongo Atlas account](https://cloud.mongodb.com/)_

First you should complete the following env vars

```bash
git clone https://github.com/wgnr/nodejs-express-ecommerce
cd nodejs-express-ecommerce
```

If you are using nvm run the following commmand. if not, make sure you are using node
v14.

```bash
nvm use
```

Then install dependencies and build then project.

```bash
npm i
npm run build
```

Prepare you `.env` file

```bash
cp .env.example .env
```

Grab your mongo credentials and replace them here:

| Name                    | Description                     |
| ----------------------- | ------------------------------- |
| `MONGODB_URI`           | Cluster mongodb url             |
| `MONGODB_DB`            | DB name, ex: Ecommerce          |
| `MONGODB_USER`          | Mongo Read + Write account name |
| `MONGODB_PASSWORD`      | The previous account password   |
| `SEED_MONGODB_URL`      | Same as `MONGODB_URI`           |
| `SEED_MONGODB_USER`     | Same as `MONGODB_USER`          |
| `SEED_MONGODB_PASSWORD` | Same as `MONGODB_PASSWORD`      |
| `SEED_ADMIN_EMAIL`      | Your application admin email    |
| `SEED_ADMIN_PASSWORD`   | Your application admin password |

There are other env variables that are described in the
[`.env.develop` file](./.env.example) but they are not necessary to serve up the app.

Now that we have set the DB info let's populate first the test db to check if
everything runs ok.

```bash
npm run db:seed:test
```

Run the all the tests... these include one
[e2e](./src/tests/e2e/completePurchaseCycle.spec.ts) case which covers a complete
purchace cycle:

- Account creation
- Account log in
- Products listing
- Add product to cart
- Create purchase order
- Payment

```bash
npm test
```

Everything should be fine to continue, seed the production db now, first serve up the
app.

```bash
npm start
```

In a new terminal, same path, run

```bash
npm run db:seed
```

🍻 The application is ready to be used! Use this
[postman colection](./API_E-commerce.postman_collection.json) to test it.
