import supabaseClient from '../db/supabaseClient'
import { IToonStats } from '../models/IToonStats'
import { ToonStats } from '../models/ToonStats'

export async function storeToonStats(toon: ToonStats) {

    const toon_stats: IToonStats = toon.toonStatsType;

    const toon_id = toon_stats.toon_id;

    const { data, error } = await supabaseClient
        .from('toon_stats_snapshots')
        .select('*')
        .eq('toon_id', toon_id);
    
    //console.log(toon_stats.name, toon_id, data, error)

    if (error !== null) {
        console.warn(error.message);
        return
    }
    // init snapshot doesn't exist in db. add it
    if (Array.isArray(data) && data.length === 0) {
        console.log("Adding new toon: ", toon_id, toon_stats.name);
        const { error } = await supabaseClient
            .from('toon_stats_snapshots')
            .insert([{
                ...toon_stats,
                toon_id: toon_id,
                snapshot_type: "start"
            }]);
    } else if (Array.isArray(data) && data.length > 0) {
        // there's an init snapshot, but the updated type may or may not doesn't exist
    

        const snapshot_json =
        data.find(d => d.snapshot_type === "current") ??
        data.find(d => d.snapshot_type === "start");
    
        if (!snapshot_json) return;

        //console.log("Toon already exists: ", snapshot_json.snapshot_type);
        const toon_current = new ToonStats(snapshot_json) 
        const diff: Partial<IToonStats> = toon_current.diffToonStats(toon)
        //console.log(toon_current, toon, diff)
        if (Object.keys(diff).length > 0) {
            console.log("Updating existing toon ", toon_id, toon_stats.name, diff)

            // update main table and add current
            const { error: upsertError } = await supabaseClient
                .from('toon_stats_snapshots')
                .upsert({
                    ...toon_stats,
                    toon_id: toon_id,
                    snapshot_type: "current",
                    modified_at: Object.keys(diff).length === 1 ? null : new Date()
                },
                { onConflict: 'toon_id,snapshot_type' });
            
            if (upsertError) {
                console.log("Error adding to main table: " + upsertError.message);
            }

            if ('photo' in diff) delete (diff as any).photo;

            const { error: updateError } = await supabaseClient
                .from('toon_stats_updates')
                .insert([{
                    ...diff,
                    toon_id: toon_id
                }]);
            
            if (updateError) {
                console.log("Error adding to update table: " + updateError.message);
            }
        }
    }

}