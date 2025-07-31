import supabaseAdmin from "../db/supabaseClient";

export async function getToonIdsFromPrefixMatch(stringMatch: string, exactMatch = false, limit = 100): Promise<({toon_id: any; name: any;})[] | null> {

    const pattern = exactMatch ? stringMatch : `${stringMatch}%`
    const { data, error } = await supabaseAdmin
        .from('toon_stats_snapshots')
        .select('toon_id,name')
        .eq('snapshot_type', 'start')
        .ilike('name', pattern)
        .order('name', {ascending: true})
        .limit(limit);

    if (error !== null) {
        console.error(`Error getting Toon Ids from match ${stringMatch}`);
        throw error
    }

    return data;
}