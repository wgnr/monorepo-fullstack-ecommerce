// Check environment
const isProd = process.env.NODE_ENV === "production" ? "production" : "development"
import { existsSync } from 'fs'
import { resolve } from "path"
const envPath = resolve(process.cwd(),
  `.env.${isProd ? "production" : "development"}`
)

import { config } from "dotenv";
// if dev or prod env file is available, take it. Other use lead std .env
if (existsSync(envPath)) config({ path: envPath });

export const GlobalVars = {
  isProd,
  PORT: parseInt(process.env.PORT as string) || 3000,
  db: {
    URL: process.env.MONGODB_URI,
  }
}