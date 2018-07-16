import { FetchStatus } from "./fetchStatus";
import { WeightRecord } from "./records";
import { WeightLogState } from "./state";
import { loadWeightLog } from "./repository";

interface FetchedAction {
    type: "WL_FETCHED"
    records: WeightRecord[]
}

interface FetchAction {
    type: "WL_FETCH"
}

interface AddAction {
    type: "WL_ADD",
    record: WeightRecord
}

const _fetch = () => ({type: "WL_FETCH"} as FetchAction);

export const fetch = () => dispatch => {
    dispatch(_fetch());
    loadWeightLog().then(rs => dispatch(fetched(rs)));
}
export const fetched = (records: WeightRecord[]) => ({type: "WL_FETCHED", records} as FetchedAction);
export const add = (record: WeightRecord) => ({type: "WL_ADD", record} as AddAction);

export function weightLogReducer(
    state : WeightLogState = {fetched: FetchStatus.No, records: []},
    action : FetchAction | FetchedAction | AddAction) : WeightLogState {
    switch (action.type) {
        case "WL_FETCH": {
            return {
                ...state,
                records: [],
                fetched: FetchStatus.Fetching
            }
        }
        case "WL_FETCHED": {
            return {
                ...state,
                records: action.records,
                fetched: FetchStatus.Fetched
            }
        }
        case "WL_ADD": {
            return {
                ...state,
                records: state.records.concat(action.record)
            }
        }
        default: return state;
    }
}
