import { GlobalVars } from "@config/index"
import mongoose, { Mongoose } from "mongoose";
// Use mongoose with promises
// mongoose.Promise = global.Promise;

const { db: { URL } } = GlobalVars;

export const connectToMongo = new Promise((resolve, reject) => {
  mongoose
    .connect(URL!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(r => resolve("Connected to monogo"))
    .catch(e => reject("error" + e))
})
