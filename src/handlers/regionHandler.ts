import { USERS_MESSAGES } from '~/constants/message'
import { BotView } from '../views/botView'
import databaseServices from '~/services/databaseServices'

export class RegionHandler {
  private view: BotView

  constructor(view: BotView) {
    this.view = view
  }

  public async choseRegion(chatId: number, region: string) {
    await databaseServices.users.updateOne({ chatId: chatId }, { $addToSet: { regions: region } }, { upsert: true })
    this.view.sendRegionConfirmation(chatId, region, true)
  }

  public async removeRegion(chatId: number, region: string) {
    this.view.sendRegionConfirmation(chatId, region, false)
    await databaseServices.users.updateOne({ chatId: chatId }, { $pull: { regions: region } })
  }

  public async showAllRegions(chatId: number) {
    const user = await databaseServices.users.findOne({ chatId })
    if (user && user.regions && user.regions.length > 0) {
      this.view.sendMyAllRegionMessage(chatId, user?.regions)
    } else {
      this.view.sendMessageToUser(chatId, USERS_MESSAGES.NO_REGION)
    }
  }

  public async sendRegionRemoveMessage(chatId: number) {
    const user = await databaseServices.users.findOne({ chatId })
    if (user && user.regions && user.regions.length > 0) {
      this.view.sendRegionRemoveMessage(chatId, user?.regions)
    } else {
      this.view.sendMessageToUser(chatId, USERS_MESSAGES.NO_REGION)
    }
  }
}
