import TelegramBot from 'node-telegram-bot-api'
import { BotModel } from '../models/botModel'
import { BotView } from '../views/botView'
import { RegionHandler } from '../handlers/regionHandler'
import { CurrencyHandler } from '../handlers/currencyHandler'
import databaseServices from '~/services/databaseServices'
import { USERS_MESSAGES } from '~/constants/message'

export class BotController {
  private bot: TelegramBot
  private model: BotModel
  private view: BotView
  private regionHandler: RegionHandler
  private currencyHandler: CurrencyHandler

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true })
    this.model = new BotModel()
    this.view = new BotView(this.bot)
    this.regionHandler = new RegionHandler(this.view)
    this.currencyHandler = new CurrencyHandler(this.view)
  }

  private async getNews(chatId: number, region: string[], currency?: string[]) {
    const news = await this.model.fetchNewsForRegions(region, currency)
    this.view.sendNewsUpdate(chatId, news)
  }
  public init() {
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id
      this.view.sendWelcomeMessage(chatId)
    })

    this.bot.onText(/\/setregion/, (msg) => {
      const chatId = msg.chat.id
      this.view.sendChoseRegion(chatId)
    })

    this.bot.onText(/\/setcurrencies/, (msg) => {
      const chatId = msg.chat.id
      this.view.sendChoseCurrency(chatId)
    })

    this.bot.on('callback_query', async (query) => {
      const chatId = query.message?.chat.id
      if (!chatId) return

      const data = query.data
      if (data) {
        if (data.startsWith('add_region_')) {
          const region = data.split('_')[2]
          await this.regionHandler.choseRegion(chatId, region)
        } else if (data.startsWith('remove_region_')) {
          const region = data.split('_')[2]
          await this.regionHandler.removeRegion(chatId, region)
        } else if (data === 'remove_region') {
          await this.regionHandler.sendRegionRemoveMessage(chatId)
        } else if (data === 'myall_region') {
          await this.regionHandler.showAllRegions(chatId)
        } else if (data.startsWith('add_currency_')) {
          const currency = data.split('_')[2]
          await this.currencyHandler.choseCurrency(chatId, currency)
        } else if (data === 'added_currency') {
          await this.currencyHandler.showAllCurrencies(chatId)
        } else if (data === 'remove_currency') {
          await this.currencyHandler.sendCurrencyRemoveMessage(chatId)
        } else if (data.startsWith('remove_currency_')) {
          const currency = data.split('_')[2]
          await this.currencyHandler.removeCurrency(chatId, currency)
        }
      }
    })

    this.bot.onText(/\/news/, async (msg) => {
      const chatId = msg.chat.id
      const user = await databaseServices.users.findOne({ chatId })
      await this.getNews(chatId, user?.regions || ['en'], user?.currencies)
    })

    // default command
    this.bot.onText(/.*/, (msg) => {
      const command = msg.text?.toLowerCase()

      if (command !== '/start' && command !== '/setregion' && command !== '/setcurrencies' && command !== '/news') {
        const chatId = msg.chat.id
        this.view.sendMessageToUser(chatId, USERS_MESSAGES.INVALID_COMMAND)
      }
    })
  }
}
