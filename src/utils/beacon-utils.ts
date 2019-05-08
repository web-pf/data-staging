import { IBeaconData } from '@/beacon'
import { db } from '../db'
export const dbm = new db()
export const saveBeacon = async (beaconData: IBeaconData) => {
  const { appId } = beaconData
  const beaconIndex = await dbm.getClient().incr(`counter:${appId}`)
  await dbm.getClient().set(`beacon:${appId}:${beaconIndex}`, JSON.stringify(beaconData))
  return beaconIndex
}
