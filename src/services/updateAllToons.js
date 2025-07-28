import { fetchGroupData } from './fetchGroupData.js'
import { storeToonStatsJson } from '../repositories/storeToonStatsJson.js'

export async function updateAllToons() {
  const groupData = await fetchGroupData()

  for (const group of groupData) {
    for (const member of group.members) {
      const toon = member.toon

      // Defensive check in case data is malformed
      if (toon && toon.id) {
        await storeToonStatsJson(toon)
      }
    }
  }

  console.log('Finished updating all toons.')
}
