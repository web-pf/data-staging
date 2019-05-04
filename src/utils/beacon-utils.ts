import { IBeaconData } from '@/beacon'
import { setRecord, getRecord, incrRecord } from '../db'

export const saveBeacon = async (beaconData: IBeaconData) => {
  const { appId } = beaconData
  const beaconIndex = await incrRecord(`${appId}:counter`)
  await setRecord(`${appId}:${beaconIndex}`, JSON.stringify(beaconData))
  return beaconIndex
}
