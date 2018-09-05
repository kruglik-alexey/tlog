import * as React from "react";
import { connect } from "react-redux";
import { FetchStatus } from "./fetchStatus";
import { State } from "./state";
import * as Plotly from "plotly.js-basic-dist";
import * as createPlotlyComponent from 'react-plotly.js/factory';
import { min, max } from "lodash-es";
import * as regression from 'regression';
import * as moment from 'moment';

const Plot = createPlotlyComponent(Plotly);

interface PlotRecord {
    date: moment.Moment,
    value: number
}

interface WeightPlotProps {
    fetchStatus: FetchStatus,
    weightSeries: PlotRecord[],
    bfSeries: PlotRecord[]
}

function adjustRange(records: PlotRecord[], adjustUpper: boolean) : number[] {
    const values = records.map(r => r.value);
    const minVal = min(values);
    const maxVal = max(values);
    const range = maxVal - minVal;
    if (adjustUpper) {
        return [minVal, minVal + range * 2];
    } else {
        return [maxVal - range * 2, maxVal];
    }
}

interface Trendline {
    x: Date[],
    y: number[]
}

function trendline(records: PlotRecord[]): Trendline {
    const firstDate = min(records.map(r => r.date));
    // x values should be on the scale of y values or else regression will produce just horizontal line
    // therefore use of days diff as x values
    const values = records.map(r => [r.date.diff(firstDate, 'days'), r.value]);
    const trend = regression.linear(values).points;
    return {
        x: trend.map(i => firstDate.clone().add(i[0], 'days').toDate()),
        y: trend.map(i => i[1])
    }
}

class WeightPlot extends React.PureComponent<WeightPlotProps> {
    render() {
        if (this.props.fetchStatus !== FetchStatus.Fetched) {
            return <span />;
        }
        const weightRange = adjustRange(this.props.weightSeries, false);
        const bfRange = adjustRange(this.props.bfSeries, true);

        const weightTrend = trendline(this.props.weightSeries);
        const bfTrend = trendline(this.props.bfSeries);

        var weightPlot = <Plot data={[
            {
                x: this.props.weightSeries.map(r => r.date.toDate()),
                y: this.props.weightSeries.map(r => r.value),
                type: 'scatter',
                name: 'Weight',
                hoverinfo: 'y'
            },
            {
                x: weightTrend.x,
                y: weightTrend.y,
                type: 'scatter',
                hoverinfo: 'none',
                line: {
                    width: 1,
                    dash: 'dash',
                    color: 'orange'
                }
            },
            {
                x: this.props.bfSeries.map(r => r.date.toDate()),
                y: this.props.bfSeries.map(r => r.value),
                type: 'scatter',
                name: 'Body Fat %',
                hoverinfo: 'y',
                yaxis: 'y2'
            },
            {
                x: bfTrend.x,
                y: bfTrend.y,
                type: 'scatter',
                yaxis: 'y2',
                hoverinfo: 'none',
                line: {
                    width: 1,
                    dash: 'dash',
                    color: 'orange'
                }
            }]}
            layout={{
                width: 1200,
                height: 500,
                title: 'Weight Log',
                // colors are from https://github.com/plotly/plotly.js/blob/master/src/components/color/attributes.js
                yaxis: {
                    side: 'left',
                    title: 'Weight',
                    range: weightRange,
                    titlefont: {
                        color: '#1f77b4'
                    }
                },
                yaxis2: {
                    side: 'right',
                    overlaying: 'y',
                    title: 'Body Fat %',
                    range: bfRange,
                    titlefont: {
                        color: '#2ca02c'
                    }
                },
                showlegend: false
            }}/>;
        return <div>{weightPlot}</div>;
    }
}

export default connect((state: State) : WeightPlotProps => {
    var weightSeries = state.weightLog.records.map(r => ({
        date: r.date,
        value: r.weight
    }));
    var bfSeries = state.weightLog.records.filter(r => r.bf).map(r => ({
        date: r.date,
        value: r.bf
    }));
    return {
        fetchStatus: state.weightLog.fetched,
        weightSeries,
        bfSeries
    }
})(WeightPlot);
