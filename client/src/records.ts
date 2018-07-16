interface Record {
    id: string,
    dateCreated: Date,
    date: Date,
    note: string
}

export enum WeightScale { Kg, Lbs }

export interface WeightRecord extends Record {
    weight: number,
    scale: WeightScale,
    source: string,
    bf: number
}
