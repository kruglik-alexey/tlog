import { Moment } from 'moment';

interface Record {
    dateCreated: Moment,
    date: Moment,
    note?: string
}

export enum WeightScale { Kg, Lbs }

export interface WeightRecord extends Record {
    weight: number,
    scale: WeightScale,
    bf?: number,
    source?: string
}
