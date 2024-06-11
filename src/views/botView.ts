import TelegramBot, { InlineKeyboardButton } from 'node-telegram-bot-api'

export class BotView {
  private bot: TelegramBot

  constructor(bot: TelegramBot) {
    this.bot = bot
  }
  public sendWelcomeMessage(chatId: number) {
    this.bot.sendMessage(
      chatId,
      `Welcome to the KaiaNews Bot. Here are the available commands:
      /setregion : Filter by region
      /setcurrencies : Filter by currency
      /news : Get news updates`
    )
  }
  public sendChoseRegion(chatId: number) {
    const keyboard: InlineKeyboardButton[][] = [
      [
        { text: 'Deutsch', callback_data: 'add_region_de' },
        { text: 'Dutch', callback_data: 'add_region_nl' },
        { text: 'Español', callback_data: 'add_region_es' },
        { text: 'Français', callback_data: 'add_region_fr' },
        { text: 'Italiano', callback_data: 'add_region_it' },
        { text: 'Português', callback_data: 'add_region_pt' }
      ],
      [
        { text: 'Русский', callback_data: 'add_region_ru' },
        { text: '한국인', callback_data: 'add_region_ko' },
        { text: 'Türkçe', callback_data: 'add_region_tr' },
        { text: 'عربي', callback_data: 'add_region_ar' },
        { text: '中國人', callback_data: 'add_region_cn' },
        { text: '日本', callback_data: 'add_region_jp' }
      ],
      [
        { text: 'My All Region', callback_data: 'myall_region' },
        { text: 'Remove Region', callback_data: 'remove_region' }
      ]
    ]

    this.bot.sendMessage(chatId, 'Select the region you want to receive news from', {
      reply_markup: {
        inline_keyboard: keyboard
      }
    })
  }

  public sendChoseCurrency(chatId: number) {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'BTC', callback_data: 'add_currency_BTC' },
            { text: 'ETH', callback_data: 'add_currency_ETH' }
          ],
          [{ text: 'Selected currency list', callback_data: 'added_currency' }],
          [{ text: 'Delete selected currency', callback_data: 'remove_currency' }]
        ]
      }
    }
    this.bot.sendMessage(chatId, 'Select the currencies you want to filter by', options)
  }

  public sendRegionConfirmation(chatId: number, region: string, added: boolean) {
    const action = added ? 'added' : 'removed'
    this.bot.sendMessage(chatId, `You have ${action} the region: ${region}`)
  }

  public sendNewsUpdate(chatId: number, news: string) {
    this.bot.sendMessage(chatId, `${news}`)
  }

  public sendRegionRemoveMessage(chatId: number, regions: string[]) {
    const inlineKeyboard = regions.map((region) => [{ text: region, callback_data: `remove_region_${region}` }])
    this.bot.sendMessage(chatId, 'Select the region you want to delete:', {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    })
  }

  public sendCurrencyRemoveMessage(chatId: number, currency: string[]) {
    const inlineKeyboard = currency.map((currency) => [
      { text: currency, callback_data: `remove_currency_${currency}` }
    ])
    this.bot.sendMessage(chatId, 'Select the currency you want to delete:', {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    })
  }

  public sendMyAllRegionMessage(chatId: number, regions: string[]) {
    const inlineKeyboard = regions.map((region) => [{ text: region, callback_data: 'noop' }])
    this.bot.sendMessage(chatId, 'Here are all the regions you selected:', {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    })
  }

  public sendMyAllCurrencyMessage(chatId: number, currencies: string[]) {
    const inlineKeyboard = currencies.map((currencies) => [{ text: currencies, callback_data: 'noop' }])
    this.bot.sendMessage(chatId, 'Here are all the currencies you selected:', {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    })
  }

  public sendCurrencyConfirmation(chatId: number, currency: string, added: boolean) {
    const message = added ? `You have added currency ${currency}` : `You have removed the currency ${currency}`
    this.bot.sendMessage(chatId, message)
  }

  public sendMessageToUser(chatId: number, message: string) {
    this.bot.sendMessage(chatId, message)
  }
}
