import * as React from "react";
import { connect } from "react-redux";
import { FetchStatus } from "./fetchStatus";
import { State } from "./state";
import * as Slider from 'rc-slider';
import { min, max } from 'lodash-es';
import { Moment } from "moment";

const Range = Slider.createSliderWithTooltip(Slider.Range);

export interface WeightPlotRange {
    fromDate: Moment,
    toDate: Moment
}

interface StateProps {
    fetchStatus: FetchStatus,
    minDate: Moment,
    maxDate: Moment
}

interface OwnProps {
    rangeChangeHandler: (WeightPlotRange) => void
}

type WeightPlotRangeProps = StateProps & OwnProps;

interface WeightPlotRangeState {
    range?: WeightPlotRange
}

const rangeKind = 'month';

class WeightPlotRangeSelector extends React.Component<WeightPlotRangeProps, WeightPlotRangeState> {
    constructor(props) {
        super(props);
        this.state = { };
    }

    getMinDate() {
        return this.props.minDate.clone().startOf(rangeKind);
    }

    getMaxDate() {
        return this.props.maxDate.clone().endOf(rangeKind);
    }

    handleRangeChange = ([from, to]) => {
        const range = {
            fromDate: this.getMinDate().add(from, rangeKind),
            toDate: this.getMinDate().add(to, rangeKind)
        }
        this.setState({ range });
        this.props.rangeChangeHandler(range);
    }

    render() {
        if (this.props.fetchStatus !== FetchStatus.Fetched) {
            return <span />;
        }

        const minDate = this.getMinDate();
        const maxDate = this.getMaxDate();
        // +1 to make last point is 01 of month next to latest record's month
        const max = maxDate.diff(minDate, rangeKind) + 1;

        let rangeFrom, rangeTo;
        if (!!this.state.range) {
            rangeFrom = this.state.range.fromDate.diff(minDate, rangeKind);
            rangeTo = this.state.range.toDate.diff(minDate, rangeKind);
        } else {
            rangeFrom = 0;
            rangeTo = max;
        }

        return (<Range
            min={0}
            max={max}
            dots={true}
            allowCross={false}
            tipFormatter={v => minDate.clone().add(v, rangeKind).format('L')}
            value={[rangeFrom, rangeTo]}
            onChange={this.handleRangeChange}/>);
    }
}

function mapStateToProps(state: State) : StateProps {
    const dates = state.weightLog.records.map(r => r.date);
    const minDate = min(dates);
    const maxDate = max(dates);

    return {
        fetchStatus: state.weightLog.fetched,
        minDate,
        maxDate
    }
}

function mergeProps(stateProps: StateProps, dispatchProps, ownProps: OwnProps): WeightPlotRangeProps {
    return Object.assign({}, stateProps, ownProps);
}

export default connect(mapStateToProps, null, mergeProps)(WeightPlotRangeSelector);
