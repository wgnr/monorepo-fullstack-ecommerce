import { config } from "dotenv";
import { existsSync } from 'fs'
import { resolve } from "path"

const isProd = process.env.NODE_ENV === "production"
const envPath = resolve(process.cwd(), `.env.${isProd ? "production" : "development"}`)
// if .env.development | .env.production isn't available, load regular .env
config(existsSync(envPath) ? { path: envPath } : {});

export const GlobalVars = {
  isProd,
  PORT: parseInt(process.env.PORT as string) || 3000,
  db: {
    URL: process.env.MONGODB_URI,
  },
  debug: {
    showErrorTrace: ["true", "1", "yes"].includes(process.env.SHOW_ERROR_TRACE as string)
  }
}