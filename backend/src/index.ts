import { createServer } from "http";
import cors from "cors";
import express from "express"
import helmet from "helmet";
import path from "path";
import { connectToMongo } from "@models/index"
import { GlobalVars } from "@config/index"
import { router } from "@routes/index"
import { router as ErrorRouter } from "@routes/error"
import ChatsService from "@services/chat"


const PORT = GlobalVars.PORT;
__dirname = path.resolve();

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
  const app = express();
  const httpServer = createServer(app);

  // App configuration
  app.use(helmet({
    // Needed for websocket.io
    contentSecurityPolicy: false
  }));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", router)
  app.use("/", express.static(`${__dirname}/public`));
  app.use(ErrorRouter)
  ChatsService.initSocketIO(httpServer)

  // Serve application
  const server = httpServer
    .listen(PORT, () => { console.log(`Listening on port ${PORT}`); })
    .on("error", (error) => console.error(`Error in server!!!!!\n${error}`));
})()
