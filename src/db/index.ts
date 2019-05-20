import Redis, { Redis as IRedis } from 'ioredis'
import axios from 'axios'

import { serviceUrl } from '@config/serivce.json'

type TRedisDbIndex = 10 | 11 | 12

export class db {
  private currentDbIndex: TRedisDbIndex
  private client: IRedis
  private flushClient: IRedis
  private ipClient: IRedis

  private stashedData: object[] = []

  constructor() {
    this.currentDbIndex = 10

    this.client = new Redis({ host: process.env.REDIS_URL })
    this.flushClient = new Redis({ host: process.env.REDIS_URL })
    this.ipClient = new Redis({ host: process.env.REDIS_URL })

    this.ipClient.select(0)
  }

  getIp(ip: string) {}
  setIp(ip: string, loc: string, isp: string) {}

  getClient() {
    return this.client
  }

  getDbIndex() {
    return this.currentDbIndex
  }

  async switchDb() {
    if (this.currentDbIndex === 12) {
      this.currentDbIndex = 10
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
      if (stashRequiredRecordKeys[1].length) {
        const stashRequiredRecordKeyRecords = await this.flushClient.mget(
          stashRequiredRecordKeys[1] as any
        )
        axios({
          method: 'put',
          url: serviceUrl,
          data: stashRequiredRecordKeyRecords,
        })
          .then(() => {
            this.flushClient.flushall()
          })
          .catch(reason => {
            console.log(reason.message)
          })
      }
    }
  }
}
