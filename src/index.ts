import { config } from 'dotenv'
import { envConfig } from './constants/config'
import { BotController } from './controllers/botController'

config()
const token = envConfig.BOT_FATHER_TOKEN

if (!token) {
  throw new Error('BOT_TOKEN is not defined')
}

const botController = new BotController(token)

botController.init()
console.log('Bot is running...')
