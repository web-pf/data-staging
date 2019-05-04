import { createClient } from 'redis'
import {promisify} from 'util'
export const client = createClient()
export const getRecord = promisify(client.get).bind(client)
export const setRecord = promisify(client.set).bind(client)
export const incrRecord = promisify(client.incr).bind(client)