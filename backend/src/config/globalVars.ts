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
  email: {
    GMAIL_USERNAME: process.env.GMAIL_USERNAME ?? "",
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD ?? "",
    GMAIL_OAUTH_CLIENTID: process.env.GMAIL_OAUTH_CLIENTID ?? "",
    GMAIL_OAUTH_CLIENT_SECRET: process.env.GMAIL_OAUTH_CLIENT_SECRET ?? "",
    GMAIL_OAUTH_REFRESH_TOKEN: process.env.GMAIL_OAUTH_REFRESH_TOKEN ?? "",
  },
  debug: {
    SHOW_ERROR_TRACE: getEnvValueTruthy(String(process.env.SHOW_ERROR_TRACE)),
    SHOW_MONGO_ACTIONS: getEnvValueTruthy(String(process.env.SHOW_MONGO_ACTIONS)),
    SEND_BCC: getEnvValueTruthy(String(process.env.SEND_BCC)),
    BCC_DEBUG_EMAIL: process.env.BCC_DEBUG_EMAIL ?? "juanswagner@gmail.com",
  }
}