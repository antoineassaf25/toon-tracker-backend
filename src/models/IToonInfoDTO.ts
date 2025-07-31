import { ILocationData } from './ILocationData';
import { ToonStats } from './ToonStats'
import { IToonStatsUpdates } from './IToonStatsUpdates';

export interface IToonInfoDTO {
    toonStats: ToonStats;
    locationData: ILocationData;
    userHistoryData: Array<Partial<IToonStatsUpdates>>
}