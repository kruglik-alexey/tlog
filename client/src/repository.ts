import { WeightRecord, WeightScale } from "./records";
import data from "./wl";
import { uniqueId } from "lodash-es";

const dateRe = /(\d*)\.(\d*)\.(\d*) (\d*):(\d*)/;
function parseDate(str: string) {
    const match = str.match(dateRe);
    return new Date(2018, parseInt(match[2]) - 1, parseInt(match[1]), parseInt(match[4]), parseInt(match[5]));
}

export function loadWeightLog() : Promise<WeightRecord[]> {
    return new Promise(r => {
        r(data.map(d => ({
            id: uniqueId(),
            date: parseDate(d.date),
            dateCreated: parseDate(d.date),
            weight: d.weight,
            scale: WeightScale.Kg,
            bf: d.bf,
            source: null,
            note: null
        } as WeightRecord)));
    });
}
