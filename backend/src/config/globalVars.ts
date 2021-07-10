import { config } from "dotenv";
import { existsSync } from 'fs'
import { resolve } from "path"

export const getEnvValueTruthy =
  (value: string): boolean => ["true", "1", "yes", "on"].includes(value.toLowerCase())

/* LOAD CONFIGURATION */
const isProd = process.env.NODE_ENV === "production"
const envPath = resolve(process.cwd(), `.env.${isProd ? "production" : "development"}`)
// if .env.development | .env.production isn't available, load regular .env
config(existsSync(envPath) ? { path: envPath } : {});

export const GlobalVars = {
  isProd,
  PORT: parseInt(process.env.PORT as string) || 3000,
  db: {
    URL: process.env.MONGODB_URI ?? "",
    USER: process.env.MONGODB_USER ?? "",
    PASSWORD: process.env.MONGODB_PASSWORD ?? "",
    DB: process.env.MONGODB_DB ?? "",
  },
  debug: {
    SHOW_ERROR_TRACE: getEnvValueTruthy(String(process.env.SHOW_ERROR_TRACE)),
    SHOW_MONGO_ACTIONS: getEnvValueTruthy(String(process.env.SHOW_MONGO_ACTIONS)),
  }
}