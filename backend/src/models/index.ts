
import mongoose, { Mongoose } from "mongoose";
// Use mongoose with promises
mongoose.Promise = global.Promise;

export const connectToMongo = mongoose
  .connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
