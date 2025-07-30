import supabaseClient from '../db/supabaseClient'
import { ILocationData } from '../models/ILocationData'

import { IToonStats } from '../models/IToonStats'
import { ToonStats } from '../models/ToonStats'

export async function storeToonLiveInfo(toon: ToonStats, location: ILocationData) {
    const toon_stats: IToonStats = toon.toonStatsType;
    const toon_id = toon_stats.toon_id;

    const { error: upsertError } = await supabaseClient
        .from('toon_live_info')
        .upsert({
            latest_activity: new Date(),
            latest_district: location.district,
            latest_location: location.location,
            toon_id: toon_id
        });
    
    if (upsertError) {
        console.log("Error tracking live toon location:", upsertError.message);
    }
}