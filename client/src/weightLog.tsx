import * as React from "react";
import { connect } from "react-redux";
import { FetchStatus } from "./fetchStatus";
import { WeightRecord } from "./records";
import { State } from "./state";
import { fetch, del } from "./weightLogReducer";
import ReactTable from "react-table";
import { Moment } from "moment";
import { ContextMenu, Item, ContextMenuProvider } from 'react-contexify';

interface WeightLogProps {
    fetched: FetchStatus,
    records: ReadonlyArray<WeightRecord>,
    dispatch?
}

const contextMenuId = "menu";

const SimpleCell = props => {
    return (
        <ContextMenuProvider id={contextMenuId} data={props.original}>
            {props.value || ''}
        </ContextMenuProvider>
    );
}

class WeightLog extends React.PureComponent<WeightLogProps> {
    componentDidMount() {
        if (this.props.fetched === FetchStatus.No) {
            this.props.dispatch(fetch());
        }
    }

    handleDeleteMenu = ({dataFromProvider}) => {
        console.log(dataFromProvider);
        this.props.dispatch(del(dataFromProvider.id));
    }

    render() {
        return (
            <div>
                <ReactTable
                    className="-striped -highlight"
                    data={this.props.records as WeightRecord[]}
                    columns={[
                        {Header: 'Date', accessor: 'date', Cell: props => {
                            const date : Moment = props.value;
                            return (
                                <ContextMenuProvider id={contextMenuId} data={props.row}>
                                    <span>
                                        {date.format('L')}
                                        <small style={{paddingLeft: '5px'}}>{date.format('LT')}</small>
                                    </span>
                                </ContextMenuProvider>
                            );
                        }},
                        {Header: 'Weight', accessor: 'weight', Cell: SimpleCell},
                        {Header: 'BF', accessor: 'bf', Cell: SimpleCell},
                        //{Header: 'Source', accessor: 'source'},
                        {Header: 'Note', accessor: 'note', sortable: false, Cell: SimpleCell}
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
                />
                <ContextMenu id={contextMenuId}>
                    <Item onClick={this.handleDeleteMenu}>Delete</Item>
                </ContextMenu>
            </div>);
    }
}

export default connect((state : State) : WeightLogProps => {
    return {
        fetched: state.weightLog.fetched,
        records: state.weightLog.records
    }
})(WeightLog);
