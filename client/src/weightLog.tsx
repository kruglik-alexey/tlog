import * as React from "react";
import { connect } from "react-redux";
import { FetchStatus } from "./fetchStatus";
import { WeightRecord } from "./records";
import { State } from "./state";
import { fetch } from "./weightLogReducer";
import ReactTable from "react-table";
import { Moment } from "moment";

interface WeightLogProps {
    fetched: FetchStatus,
    records: ReadonlyArray<WeightRecord>,
    dispatch?
}

class WeightLog extends React.PureComponent<WeightLogProps> {
    componentDidMount() {
        if (this.props.fetched === FetchStatus.No) {
            this.props.dispatch(fetch());
        }
    }

    render() {
        return <ReactTable
            className="-striped -highlight"
            data={this.props.records as WeightRecord[]}
            columns={[
                {Header: 'Date', accessor: 'date', Cell: props => {
                    const date : Moment = props.value;
                    return (
                        <span>
                            {date.format('L')}
                            <small style={{paddingLeft: '5px'}}>{date.format('LT')}</small>
                        </span>);
                }},
                {Header: 'Weight', accessor: 'weight'},
                {Header: 'BF', accessor: 'bf'},
                //{Header: 'Source', accessor: 'source'},
                {Header: 'Note', accessor: 'note', sortable: false}
            ]}
            loading={this.props.fetched !== FetchStatus.Fetched}
            defaultPageSize={30}
            pageSizeOptions={[30, 60, 90, 365]}
            defaultSorted={[
                {
                  id: 'date',
                  desc: true
                }
            ]}
        />;
    }
}

export default connect((state : State) : WeightLogProps => {
    return {
        fetched: state.weightLog.fetched,
        records: state.weightLog.records
    }
})(WeightLog);
