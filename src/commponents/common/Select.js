import React from 'react'
import MenuItme from './MenuItem'

class Select extends React.Component{
    state = {
        isShow:false,
    }
    selectDom = null;
    switchShow = ()=>{
        this.setState(function(prevState,props){
            return{
                isShow:!prevState.isShow
            }
        })
    }
    closeShow = ()=>{
        console.log(this.state.isShow)
        if(!this.state.isShow){
            return;
        }
        this.setState({isShow:false})
    }
    componentDidMount(){
        console.log(this.selectionDom);
    }
    render(){
        const {
            handleChange,
            items,
            item,
            children,
        } = this.props;
        return(
            <span className="select">
                <span onClick={this.switchShow} ref={(element)=>{this.selectDom = element}}>
                    {children}
                </span>
                {
                    this.state.isShow&&(
                        <MenuItme items={items} item={item} closeSelect={this.closeShow} handleChange={handleChange} />
                    )
                }
            </span>
        )
    }
}

export default Select