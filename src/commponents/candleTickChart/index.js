
import React from 'react';
import OHLCV from './OHLCV'

class ChartComponent extends React.Component {
	componentDidMount() {
	}
    render(){
        return(
            <OHLCV contractNo='FO_CL_1906' period='KLINE_UNKNOWN'></OHLCV>
        )
    }
}

export default ChartComponent
