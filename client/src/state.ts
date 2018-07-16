import { FetchStatus } from "./fetchStatus";
import { WeightRecord } from "./records";

export interface WeightLogState {
    readonly fetched: FetchStatus
    readonly records: ReadonlyArray<WeightRecord>
}

export interface State {
    weightLog: WeightLogState
}
