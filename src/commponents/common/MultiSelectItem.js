import React from 'react'

/* eslint-disable */
class MultiSelectItem extends React.Component{
    render(){
        const {
            text,
            handleChange
        } = this.props;

        return(
            <span className="multi-select-item">
                {text}
            </span>
        )
    }
}

export default MultiSelectItem;