import { config } from 'dotenv'
import { envConfig } from './constants/config'
import { BotController } from './controllers/botController'
import cron from 'node-cron'

config()
const token = envConfig.BOT_FATHER_TOKEN

if (!token) {
  throw new Error('BOT_TOKEN is not defined')
}

const botController = new BotController(token)

botController.init()
console.log('Bot is running...')

// // Thiết lập cron job để cập nhật tin tức mỗi giờ
// cron.schedule('0 * * * *', () => {
//   botController.updateNewsForAllUsers()
// })
