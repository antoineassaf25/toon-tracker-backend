import { fetchGroupData } from './fetchGroupData'
import { storeToonStats } from '../repositories/storeToonStats'
import { ToonStats } from '../models/ToonStats';

export async function updateAllToons() {
  const groupData = await fetchGroupData()

  //console.log(groupData.groups)

  for (const group of groupData.groups) {
    for (const member of group.members) {
      
      const toon = new ToonStats(member.toon);
      
      if (toon.valid()) {
        await storeToonStats(toon)
      }
    }
  }

}
