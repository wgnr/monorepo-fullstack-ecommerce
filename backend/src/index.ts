import { GlobalVars } from "@config/index"
import express from "express"
import cors from "cors";
import helmet from "helmet";
import { router } from "@routes/index"
import { router as ErrorRouter } from "@routes/error"
import { connectToMongo } from "@models/index"

(async () => {
  // Connect to services
  await Promise.all([
    connectToMongo(GlobalVars.db)
  ])
    .then(console.log)
    .catch(e => {
      console.error(e)
      console.log("Exiting...")
      process.exit(1)
    })

  // App variables
  const PORT = GlobalVars.PORT;
  const app = express();

  // App configuration
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use("/api", router)
  app.use(ErrorRouter)

  // Serve application
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
})()
