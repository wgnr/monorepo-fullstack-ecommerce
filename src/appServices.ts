import { connectToMongo, closeMongoConnection } from "@models/index";
import type { MongoConnectionParams } from "@models/index";

export const connectServices = (mongoConfig: MongoConnectionParams) =>
  Promise.all([connectToMongo(mongoConfig)])
    .then(console.log)
    .catch(e => {
      console.error(e);
      console.log("Exiting...");
      process.exit(1);
    });

export const closeServices = () =>
  Promise.all([closeMongoConnection()])
    .then(console.log)
    .catch(e => {
      console.log("Error closing services!");
      console.error(e);
    });
