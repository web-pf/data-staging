import { createClient, RedisClient } from 'redis'
import { promisify } from 'util'

type TRedisDbIndex = 0 | 1 | 2

export class db {
  private currentDbIndex: TRedisDbIndex
  private client: RedisClient
  private flushClient: RedisClient

  public getRecord: (arg1: string) => Promise<{}>
  public setRecord: (arg1: string, arg2: string) => Promise<{}>
  public getAllRecords: (arg1: string) => Promise<string[]>
  public incrRecord: (arg1: string) => Promise<number>

  constructor() {
    this.currentDbIndex = 1

    this.client = createClient()
    this.flushClient = createClient()

    this.getAllRecords = promisify(this.client.keys).bind(this.client)
    this.getRecord = promisify(this.client.get).bind(this.client)
    this.setRecord = promisify(this.client.set).bind(this.client)
    this.incrRecord = promisify(this.client.incr).bind(this.client)
  }

  getClient() {
    return this.client
  }

  getDbIndex() {
    return this.currentDbIndex
  }

  async switchDb() {
    if (this.currentDbIndex === 2) {
      this.currentDbIndex = 0
    } else {
      this.currentDbIndex += 1
    }

    console.log(this.currentDbIndex)

    await promisify(this.client.select).bind(this.client)(this.currentDbIndex)
  }

  async flush() {
    const allRecords = await this.getAllRecords('*')
    if (allRecords[1] && allRecords[1].length) {
      const flushRequiredDbIndex = this.currentDbIndex
      await this.switchDb()
      await promisify(this.flushClient.select).bind(this.flushClient)(flushRequiredDbIndex)
      this.flushClient.scan('0', 'MATCH', 'beacon:*', (err, result) => {
        if (!err) {
          this.flushClient.mget(result[1], (err, result) => {
            console.log(result)
          })
        }
      })
    } else {

    }
  }
}
