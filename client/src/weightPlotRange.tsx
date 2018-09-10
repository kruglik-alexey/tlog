import * as React from "react";
import { connect } from "react-redux";
import { FetchStatus } from "./fetchStatus";
import { State } from "./state";
import * as Slider from 'rc-slider';
import { WeightRecord } from "./records";

const Range = Slider.createSliderWithTooltip(Slider.Range);

export interface WeightPlotRange {
    from: number,
    to: number
}

interface StateProps {
    fetchStatus: FetchStatus,
    weightLog: ReadonlyArray<WeightRecord>
}

interface OwnProps {
    rangeChangeHandler: (WeightPlotRange) => void
}

type WeightPlotRangeProps = StateProps & OwnProps;

interface WeightPlotRangeState {
    range: WeightPlotRange
}

class WeightPlotRangeSelector extends React.Component<WeightPlotRangeProps, WeightPlotRangeState> {
    constructor(props: WeightPlotRangeProps) {
        super(props);
        this.state = {
            range: {
                from: 0,
                to: 0
            }
        }
    }

    render() {
        if (this.props.fetchStatus !== FetchStatus.Fetched) {
            return <span />;
        }
        return <Range />;
    }
}

function mapStateToProps(state: State) : StateProps {
    return {
        fetchStatus: state.weightLog.fetched,
        weightLog: state.weightLog.records
    }
}

function mergeProps(stateProps: StateProps, dispatchProps, ownProps: OwnProps): WeightPlotRangeProps {
    return Object.assign({}, stateProps, ownProps);
}

export default connect(mapStateToProps, null, mergeProps)(WeightPlotRangeSelector);
