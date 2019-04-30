import React from 'react'
import MenuItme from './MenuItem'
import MultiSelectItem from './MultiSelectItem'

class MultiSelect extends React.Component{
    state = {
        isShow:false
    }
    switchShow = ()=>{
        this.setState(function(prevState,props){
            return{
                isShow:!prevState.isShow
            }
        })
    }
    closeShow = ()=>{
        if(!this.state.isShow){
            return;
        }
        this.setState({isShow:false})
    }
    render(){
        const {
            items,
            handleChange,
            children
        } = this.props;
        return(
            <span className="multi-select">
                <span className="multi-select-box">
                    {
                        items.map((value,index)=>{
                            if(value.active){
                                return<MultiSelectItem key={index} text={value.name} />
                            }else{
                                return null
                            }
                        })
                    }
                    <input className="multi-input" onClick={this.switchShow} />
                </span>
                {
                    this.state.isShow&&(
                        <MenuItme items={items} closeSelect={this.closeShow} handleChange={handleChange} />
                    )
                }
            </span>
        )
    }
}

export default MultiSelect