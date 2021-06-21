import { GlobalVars } from "./config"
import express from "express";
import cors from "cors";
import helmet from "helmet";

// App variables
const PORT = GlobalVars.PORT;
const app = express();

// App configuration
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve application
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
