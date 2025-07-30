import { IToonStats } from './IToonStats'

export class ToonStats {

    toonStatsType: IToonStats

    static readonly KEYS: Array<keyof IToonStats> = [
        'toon_id', 'name', 'species', 'laff', 'photo',
        'toonup', 'trap', 'lure', 'sound', 'throw',
        'squirt', 'drop', 'organic', 'sellbot', 'cashbot',
        'lawbot', 'bossbot'
    ] 

    constructor(toonStatsJSON: any) {
        this.toonStatsType = {
            toon_id: toonStatsJSON.id ?? toonStatsJSON.toon_id,
            name: toonStatsJSON.name,
            species: toonStatsJSON.species,
            laff: toonStatsJSON.laff,
            photo: toonStatsJSON.photo,
            toonup: toonStatsJSON.toonup,
            trap: toonStatsJSON.trap,
            lure: toonStatsJSON.lure,
            sound: toonStatsJSON.sound,
            throw: toonStatsJSON.throw,
            squirt: toonStatsJSON.squirt,
            drop: toonStatsJSON.drop,
            organic: toonStatsJSON.prestiges?.[0] ?? toonStatsJSON.organic ?? "",
            sellbot: toonStatsJSON.sellbot,
            cashbot: toonStatsJSON.cashbot,
            lawbot: toonStatsJSON.lawbot,
            bossbot: toonStatsJSON.bossbot,
        }
    }

    valid(): boolean {
        return this.toonStatsType.toon_id !== undefined;
    }

    diffToonStats(otherToonStats: ToonStats): Partial<IToonStats> {
        const patch: Partial<IToonStats> = {};
        const a = this.toonStatsType;
        const b = otherToonStats.toonStatsType;
    
        for (const key of ToonStats.KEYS) {
          if (!Object.is(a[key], b[key])) {
            patch[key] = b[key] as IToonStats[typeof key];
          }
        }
        
        return patch;
    } 
}