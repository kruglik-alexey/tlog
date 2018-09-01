import * as React from 'react';
import WL from './weightLog';
import Adder from './weightAdder';
import Plot from './weightPlot';

export default () => {
    return (
        <div>
            <Adder/>
            <WL/>
            <Plot />
        </div>
    );
}
