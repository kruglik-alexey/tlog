import { WeightRecord } from "./records";
import * as moment from 'moment';

const baseUrl = 'http://localhost:3000';

export async function loadWeightLog() : Promise<WeightRecord[]> {
    const response = await fetch(baseUrl + '/data');
    const data = await response.json();
    return data.weightLog.map(d => ({
        id: d.id,
        dateCreated: moment(d.dateCreated),
        date: moment(d.date),
        weight: d.weight,
        scale: d.scale,
        bf: d.bf,
        source: d.source,
        note: d.note
    }));
}

export async function addWeightRecord(record: WeightRecord) {
    await fetch(baseUrl + '/weightLog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
    });
}

export async function deleteWeightRecord(id: string) {
    await fetch(baseUrl + `/weightLog/${id}`, {
        method: 'DELETE'
    });
}
