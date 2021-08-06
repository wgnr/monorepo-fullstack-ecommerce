import { config } from "dotenv";
import { existsSync } from 'fs'
import { resolve } from "path"

export const getEnvValueTruthy =
  (value: string): boolean => ["true", "1", "yes", "on"].includes(value.toLowerCase())

/* LOAD CONFIGURATION */
const IS_PROD = process.env.NODE_ENV === "production"
const envPath = resolve(process.cwd(), `.env.${IS_PROD ? "production" : "development"}`)
// if .env.development | .env.production isn't available, load regular .env
config(existsSync(envPath) ? { path: envPath } : {});

const PORT = parseInt(process.env.PORT as string) || 3000
const defaultServerUrl = `http://localhost:${PORT}`

export const GlobalVars = {
  IS_PROD,
  PORT: parseInt(process.env.PORT as string) || 3000,
  SERVER_URL: IS_PROD ? process.env.PROD_URL ?? defaultServerUrl : defaultServerUrl,
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
  },
  auth: {
    jwt: {
      JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET ?? "MAKE_SURE_TO_CHANGE_THIS_SECRET_AFTER_!@##$%^&*",
      // https://github.com/vercel/ms
      JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME ?? "1d",
    },
    socials: {
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID ?? "",
      FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET ?? ""
    }
  }
}