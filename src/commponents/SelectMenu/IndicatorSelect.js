import React from 'react';
import { MultiSelect } from '../common';

class IndicatorSelect extends React.Component{

    render(){
        const {
            items,
            handleChange
        } = this.props;
        return(
            <MultiSelect
                items={items}
                handleChange={handleChange}
            >
            </MultiSelect>
        )
    }
}

export default IndicatorSelect