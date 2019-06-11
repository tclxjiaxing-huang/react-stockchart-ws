/* eslint-disable */
import React from 'react'
import Hello from './helloPage/index' 
import Chart from '../commponents/candleTickChart' 


import '../style/css/index.css'

const App = ()=>{
    return(
        <div style={{height:'100%'}}>
            <Chart />
        </div>
    )
}
export default App;