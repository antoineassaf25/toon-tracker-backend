import supabaseClient from '../db/supabaseClient'
import { ILocationData } from '../models/ILocationData'
import { IToonInfoDTO } from '../models/IToonInfoDTO'
import { IToonStats } from '../models/IToonStats'
import { IToonStatsUpdates } from '../models/IToonStatsUpdates'
import { ToonStats } from '../models/ToonStats'

export async function getToonInfoFromToonId(toon_id: number): Promise<IToonInfoDTO | null> {

    const { data: dataSnapshots, error: errorSnapshots } = await supabaseClient
        .from('toon_stats_snapshots')
        .select('*')
        .eq('toon_id', toon_id)

    if (errorSnapshots !== null) {
        console.error("Error fetching Toon Snapshot Info data from id " + toon_id + ": " + errorSnapshots.message)
        throw errorSnapshots;
    }

    if (Array.isArray(dataSnapshots) && dataSnapshots.length === 0) {
        console.log("Toon ID " + toon_id + " is not stored.")
        return null
    }

    const current_snapshot_json =
        dataSnapshots.find((x) => x.snapshot_type == 'current') ??
        dataSnapshots.find((x) => x.snapshot_type == 'start')

    const toonStatsRes = new ToonStats(current_snapshot_json);

    const { data: dataLiveInfo, error: errorLiveInfo } = await supabaseClient
        .from('toon_live_info')
        .select('*')
        .eq('toon_id', toon_id)
        .single()

    if (errorLiveInfo !== null) {
        console.error("Error fetching Toon Live Info data from id " + toon_id + ": " + errorLiveInfo.message)
        throw errorLiveInfo;
    }

    const locationDataRes: ILocationData = {
        "district": dataLiveInfo.latest_district,
        "location": dataLiveInfo.latest_location,
        "time": dataLiveInfo.latest_activity,
    }

    const { data: dataHistoryData, error: errorHistoryData} = await supabaseClient
        .from('toon_stats_updates')
        .select('*')
        .eq('toon_id', toon_id)
        .order('created_at', { ascending: true })

    if (errorHistoryData !== null) {
        console.error("Error fetching Toon History data from id " + toon_id + ": " + errorHistoryData.message)
        throw errorHistoryData;
    }

    const userHistoryDataRes: Partial<IToonStatsUpdates>[] = dataHistoryData.map((x) => {
        const res: Partial<IToonStatsUpdates> = {};
        type K = keyof IToonStatsUpdates;
        type Entry = [K, IToonStatsUpdates[K]];
        
        const entries = Object.entries(x) as Entry[];

        for (const [key, value] of entries) {
            if (value != null && key !== 'id' && key !== 'toon_id') {
                res[key] = value as number | string;
            }
        }

        return res;
    })

    return {
        toonStats: toonStatsRes,
        locationData: locationDataRes,
        userHistoryData: userHistoryDataRes
    }
}