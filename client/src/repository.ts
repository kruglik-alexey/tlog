import { WeightRecord, WeightScale } from "./records";
import data from "./wl";
import * as moment from 'moment';

const dateRe = /(\d*)\.(\d*)\.(\d*) (\d*):(\d*)/;
function parseDate(str: string) {
    const match = str.match(dateRe);
    return new Date(2018, parseInt(match[2]) - 1, parseInt(match[1]), parseInt(match[4]), parseInt(match[5]));
}

export function loadWeightLog() : Promise<WeightRecord[]> {
    return new Promise(r => {
        r(data.map(d => ({
            date: moment(parseDate(d.date)),
            dateCreated: moment(parseDate(d.date)),
            weight: d.weight,
            scale: WeightScale.Kg,
            bf: d.bf,
            source: null,
            note: null
        } as WeightRecord)));
    });
}
