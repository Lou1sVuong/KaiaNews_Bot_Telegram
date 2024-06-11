import { config } from 'dotenv'

config()
export const envConfig = {
  BOT_FATHER_TOKEN: process.env.BOT_TOKEN as string,
  NEWS_API_TOKEN: process.env.NEWS_API_TOKEN as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbName: process.env.DB_NAME as string,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string
} as const
