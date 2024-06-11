import { USERS_MESSAGES } from '~/constants/message'
import { BotView } from '../views/botView'
import databaseServices from '~/services/databaseServices'

export class CurrencyHandler {
  private view: BotView

  constructor(view: BotView) {
    this.view = view
  }

  public async choseCurrency(chatId: number, currency: string) {
    await databaseServices.users.updateOne(
      { chatId: chatId },
      { $addToSet: { currencies: currency } },
      { upsert: true }
    )
    this.view.sendCurrencyConfirmation(chatId, currency, true)
  }

  public async showAllCurrencies(chatId: number) {
    const user = await databaseServices.users.findOne({ chatId })
    if (user && user.currencies && user.currencies.length > 0) {
      this.view.sendMyAllCurrencyMessage(chatId, user?.currencies)
    } else {
      this.view.sendMessageToUser(chatId, USERS_MESSAGES.NO_CURRENCY)
    }
  }

  public async removeCurrency(chatId: number, currency: string) {
    await databaseServices.users.updateOne({ chatId }, { $pull: { currencies: currency } })
    this.view.sendCurrencyConfirmation(chatId, currency, false)
  }

  public async sendCurrencyRemoveMessage(chatId: number) {
    const user = await databaseServices.users.findOne({ chatId })
    if (user && user.currencies && user.currencies.length > 0) {
      this.view.sendCurrencyRemoveMessage(chatId, user?.currencies)
    } else {
      this.view.sendMessageToUser(chatId, USERS_MESSAGES.NO_CURRENCY)
    }
  }
}
