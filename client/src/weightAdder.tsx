import * as React from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import { add } from './weightLogReducer';
import { WeightScale } from "./records";
import { uuid } from './uuid';

interface WeightAdderState {
    date: moment.Moment,
    weight: string,
    weightInvalid: boolean,
    bf: string,
    note: string
}

class WeightAdder extends React.Component<{dispatch?}, WeightAdderState> {
    clearState: WeightAdderState;

    constructor(props) {
        super(props);
        this.state = this.getClearState();
    }

    getClearState() : WeightAdderState {
        return {
            date: moment(),
            weight: '',
            weightInvalid: false,
            bf: '',
            note: ''
        }
    }

    handleDateChange = (date : moment.Moment) => {
        this.setState({date});
    }

    handleWeightChange = (e) => {
        this.setState({weight: e.target.value});
    }

    handleBfChange = (e) => {
        this.setState({bf: e.target.value});
    }

    handleNoteChange = (e) => {
        this.setState({note: e.target.value});
    }

    onSubmit = (e) => {
        e.preventDefault();
        if (!this.validate()) {
            return;
        }

        this.props.dispatch(add({
            id: uuid(),
            dateCreated: moment(),
            date: this.state.date,
            weight: parseFloat(this.state.weight),
            scale: WeightScale.Kg,
            bf: this.state.bf !== '' ? parseFloat(this.state.bf) : null,
            note: this.state.note
        }));

        this.setState(this.getClearState());
    }

    validate() {
        const weightInvalid = this.state.weight === '';
        this.setState({weightInvalid});
        return !weightInvalid;
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label className="mr-sm-2">Date</Label>
                    <DatePicker
                        customInput={<Input />}
                        selected={this.state.date}
                        onChange={this.handleDateChange}/>
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label className="mr-sm-2">Weight</Label>
                    <Input type="number" value={this.state.weight} onChange={this.handleWeightChange} invalid={this.state.weightInvalid}/>
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label className="mr-sm-2">Body Fat %</Label>
                    <Input type="number" value={this.state.bf} onChange={this.handleBfChange}/>
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label className="mr-sm-2">Note</Label>
                    <Input type="number" value={this.state.note} onChange={this.handleNoteChange}/>
                </FormGroup>
                <Button color="success">Add</Button>
            </Form>
        );
    }
}

export default connect()(WeightAdder);
