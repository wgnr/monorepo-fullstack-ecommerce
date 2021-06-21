import { GlobalVars } from "./config"
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routes"

// App variables
const PORT = GlobalVars.PORT;
const app = express();

// App configuration
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api", router)

// Serve application
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
