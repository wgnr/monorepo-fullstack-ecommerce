import { config } from "dotenv";
config();

export const GlobalVars = {
  NODE_ENV: process.env.NODE_ENV === "production" ? process.env.NODE_ENV : "development",
  PORT: parseInt(process.env.PORT as string) || 3000,
}