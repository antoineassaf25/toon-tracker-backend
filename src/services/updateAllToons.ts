import { fetchGroupData } from './fetchGroupData'
import { storeToonStats } from '../repositories/storeToonStats'
import { storeToonLiveInfo } from '../repositories/storeToonLiveInfo'
import { ToonStats } from '../models/ToonStats';
import { ILocationData } from '../models/ILocationData'

export async function updateAllToons() {
  const groupData = await fetchGroupData()

  for (const group of groupData.groups) {

    const groupLocationData: ILocationData = {
      "district": group.district,
      "location": group.location,
      "time": group.created,
    } 

    for (const member of group.members) {
      
      const toon = new ToonStats(member.toon);
      
      if (toon.valid()) {
        await storeToonStats(toon)
        await storeToonLiveInfo(toon, groupLocationData)
      }
    }
  }

}
