import { FetchStatus } from "./fetchStatus";
import { WeightRecord } from "./records";
import { WeightLogState } from "./state";
import { loadWeightLog, addWeightRecord, deleteWeightRecord } from "./repository";

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

interface DeleteAction {
    type: "WL_DELETE",
    id: string
}

const _fetch = () => ({type: "WL_FETCH"} as FetchAction);

export const fetch = () => dispatch => {
    dispatch(_fetch());
    loadWeightLog().then(rs => dispatch(fetched(rs)));
}
export const fetched = (records: WeightRecord[]) => ({type: "WL_FETCHED", records} as FetchedAction);
export const add = (record: WeightRecord) => async dispatch => {
    await addWeightRecord(record);
    dispatch(({type: "WL_ADD", record} as AddAction));
};

export const del = (id: string) => async dispatch => {
    await deleteWeightRecord(id);
    dispatch({type: "WL_DELETE", id});
}

export function weightLogReducer(
    state : WeightLogState = {fetched: FetchStatus.No, records: []},
    action : FetchAction | FetchedAction | AddAction | DeleteAction) : WeightLogState {
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
        case "WL_DELETE": {
            return {
                ...state,
                records: state.records.filter(r => r.id !== action.id)
            }
        }
        default: return state;
    }
}
