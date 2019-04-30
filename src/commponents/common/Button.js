import React from 'react'

class Button extends React.Component{
    render(){
        const {
            className,
            handleClick,
            text
        } = this.props;
        return(
            <button 
                className={className} 
                onClick={handleClick}
                >
                <span>{text}</span>
            </button>
        )
    }
}

export default Button;