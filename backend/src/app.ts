import { createServer } from "http";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import compression from "compression";
import { router } from "@routes/index";
import { router as ErrorRouter } from "@controllers/error";
import ChatsService from "@services/chat";

__dirname = path.resolve();

const app = express();
export const httpServer = createServer(app);

// App configuration
app.use(
  helmet({
    // Needed for websocket.io
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/", express.static(`${__dirname}/public`));
app.use(ErrorRouter);
ChatsService.initSocketIO(httpServer);
