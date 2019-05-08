import Redis, { Redis as IRedis } from 'ioredis'
import axios from 'axios'

import { serviceUrl } from '@config/serivce.json'

type TRedisDbIndex = 0 | 1 | 2

export class db {
  private currentDbIndex: TRedisDbIndex
  private client: IRedis
  private flushClient: IRedis

  private stashedData: object[] = []

  constructor() {
    this.currentDbIndex = 0

    this.client = new Redis()
    this.flushClient = new Redis()
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

    await this.client.select(this.currentDbIndex)
  }

  async flush() {
    const currentDbHasData = await this.client.dbsize()
    if (currentDbHasData) {
      const flushRequiredDbIndex = this.currentDbIndex
      await this.switchDb()
      await this.flushClient.select(flushRequiredDbIndex)
      const stashRequiredRecordKeys = await this.flushClient.scan(0, 'MATCH', 'beacon:*')
      const stashRequiredRecordKeyRecords = await this.flushClient.mget(
        stashRequiredRecordKeys[1] as any
      )
      axios({
        method: 'put',
        url: serviceUrl,
        data: stashRequiredRecordKeyRecords,
      }).then(() => {
        this.flushClient.flushall()
      })
    }
  }
}
