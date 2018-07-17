import * as React from 'react';
import WL from './weightLog';
import Adder from './weightAdder';

export default () => {
    return (
        <div>
            <Adder/>
            <WL/>
        </div>
    );
}
