import { fetchGroupData } from './fetchGroupData'
import { storeToonStatsJson } from '../repositories/storeToonStatsJson'
import type { ToonStats } from '../models/toonStats';

export async function updateAllToons() {
  const groupData = await fetchGroupData()

  console.log(groupData.groups)

  for (const group of groupData.groups) {
    for (const member of group.members) {
      console.log(member.toon)
    }
  }
  // for (const group of groupData) {
  //   for (const member of group.members) {
  //     const toon = member.toon

  //     // Defensive check in case data is malformed
  //     if (toon && toon.id) {
  //       await storeToonStatsJson(toon)
  //     }
  //   }
  // }

  console.log('Finished updating all toons.')
}
