import React from 'react'
/* eslint-disable */
class MenuItem extends React.Component{
    handleClick = (value)=>{
        this.props.closeSelect();
        this.props.handleChange(value);
    }
    componentWillMount(e){
        if(document.getElementById('select-box')){
            // document.getElementById('select-box').parentNode.removeChild(document.getElementById('select-box'));
            // document.getElementById('select-box').style.display = 'none';
        }
    }
    render(){
        const {
            className,
            handleChange,
            item,
            items,
            closeSelect,
        } = this.props;
        return(
            <ul id="select-box">
                {
                    items.map((value,index)=><li 
                            key={index} 
                            className={(item&&item.name==value.name?'menu-item-active ':'') + 'menu-item'} 
                            onClick={this.handleClick.bind(this,value)}
                        >
                            <span>{value.name}</span>
                        </li>
                    )
                }
            </ul>
        )
    }
}

export default MenuItem;
