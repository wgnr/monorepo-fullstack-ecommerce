import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

// App variables
const PORT: number = parseInt(process.env.PORT as string) || 3000;
const app = express();

// App configuration
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve application
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
