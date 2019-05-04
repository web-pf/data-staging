import { IBeaconData } from '@/beacon'
import { db } from '../db'
export const dbm = new db()
export const saveBeacon = async (beaconData: IBeaconData) => {
  const { appId } = beaconData
  const beaconIndex = await dbm.incrRecord(`counter:${appId}`)
  await dbm.setRecord(`beacon:${appId}:${beaconIndex}`, JSON.stringify(beaconData))
  return beaconIndex
}
