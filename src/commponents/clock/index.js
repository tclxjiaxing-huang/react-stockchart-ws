import React from 'react'

class Clock extends  React.Component{
    constructor(props){
        super(props);
        this.ticker = this.ticker.bind(this);
        this.state = {
            data:new Date(),
        }
    }
    componentDidMount(){
        this.timer = setInterval(this.ticker,1000);
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }

    ticker(){
        this.setState({
            data:new Date()
        })
    }
    render(){
        return(
            <div>
                <h2>It is {this.state.data.toLocaleTimeString()}</h2>
            </div>
        )
    }
}
export default Clock;