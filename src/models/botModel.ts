import axios from 'axios'
import { User } from '~/Schemas/userShemas'
import { envConfig } from '~/constants/config'

export class BotModel {
  private users: Map<number, User> = new Map()

  public addUserRegion(chatId: number, region: string) {
    const user = this.users.get(chatId) || { chatId, regions: [] }
    if (!user.regions.includes(region)) {
      user.regions.push(region)
    }
    this.users.set(chatId, user)
  }

  public removeUserRegion(chatId: number, region: string) {
    const user = this.users.get(chatId)
    if (user) {
      user.regions = user.regions.filter((r) => r !== region)
      this.users.set(chatId, user)
    }
  }

  public getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  public async fetchNewsForRegions(regions: string[], currencies?: string[]): Promise<string> {
    const regionString = regions.join(',')
    let url = `https://cryptopanic.com/api/v1/posts/?auth_token=${envConfig.NEWS_API_TOKEN}&regions=${regionString}`

    if (currencies) {
      url += `&currencies=${currencies.join(',')}`
    }
    const response = await axios.get(url)
    return this.decorateNews(response.data.results)
  }

  private decorateNews(results: any[]): string {
    const decoratedNews = results.map((post: any, index: number) => {
      const emoji = this.getEmoji(index)
      const fullLink = this.getFullLink(post.domain, post.slug)
      return `${index + 1}. ${emoji} ${post.title} - [Get full here](${fullLink})`
    })
    return `📰 Update news:\n${decoratedNews.join('\n')}`
  }

  private getEmoji(index: number): string {
    const emojis = [
      '🌟',
      '💼',
      '💰',
      '🌎',
      '🏅',
      '📉',
      '⛏',
      '🚀',
      '💡',
      '🔗',
      '📉',
      '🤖',
      '💼',
      '💰',
      '🔥',
      '⚠️',
      '⏳',
      '📉',
      '🌏',
      '🤣'
    ]
    return emojis[index % emojis.length]
  }

  private getFullLink(domain: string, slug: string): string {
    return `${domain}/${slug}`
  }
}
