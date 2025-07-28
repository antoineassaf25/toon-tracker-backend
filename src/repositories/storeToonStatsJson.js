import supabaseClient from '../db/supabaseClient.js'

export async function storeToonStatsJson(toon_payload) {

    const toon_id = toon_payload.id

    const { data, error } = await supabaseClient
        .from('toon_stats_json')
        .select('*')
        .eq('toon_id', toon_id)
        .single()
    

    if (error && error.code === 'PGRST116') {
        // row doesnt exist

        const { error: insertError } = await supabaseClient
            .from('toon_stats_json')
            .insert([{
                toon_id: toon_payload.id,
                stats_start: toon_payload,
                stats_current: toon_payload,
                created_at: new Date().toISOString(),
                modified_at: null
            }])

    } else if (data) {
        // Toon exists — maybe UPDATE

        const current = data.stats_current
        const incoming = toon_payload

        const hasChanged = JSON.stringify(current) !== JSON.stringify(incoming)

        if (!hasChanged) {
            console.log('Nothing to update for toon: ', toon_id)
            return
        }

        const { error: updateError } = await supabaseClient
            .from('toon_stats_json')
            .update({
            stats_current: toon_payload,
            modified_at: new Date().toISOString()
            })
            .eq('toon_id', toon_payload.id)

        if (updateError) {
            console.error('Failed to update toon stats:', updateError)
        }

    } else if (error) {
        // Some other unexpected error
        console.error('Unexpected DB error:', error)
    }

}