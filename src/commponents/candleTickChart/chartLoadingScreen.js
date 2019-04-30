import React from 'react';
import Chart from './chart';

import { Loading,Hideable } from '../common';
import { TypeChooser } from 'react-stockcharts/lib/helper'
import { AutoSizer } from 'react-virtualized'

// type Props = {
//     volume: Object,
//     indicatorHeight: number,
//     currentChart: Object,
//     data: Array<Object>,
//     noOfCandles: number,
//     width: string,
//   };
export default class ChartLoadingScreen extends React.PureComponent{
    render(){
        const nullIndicator = { name: '', height: 0, active: false };
        const {
            macd,
            volume, //成交量
            indicatorHeight, // 顶部选择栏高度
            currentChart, //当前选择的图表
            data, //图表数据
            noOfCandles, 
            line,
            rsi,
            atr,
            forceIndex,
            toolHight,
        } = this.props;
        if(!data){
            return <Loading />;
        }
        return(
            <Hideable>
                <AutoSizer> 
                {({ width, height }) => (
                    <Chart
                        type="hybrid"
                        macd={macd}
                        volume={volume}
                        rsi={rsi}
                        line={line}
                        atr={atr ? atr : nullIndicator}
                        forceIndex={forceIndex ? forceIndex : nullIndicator}
                        indicatorHeight={indicatorHeight}
                        chartHeight={height-indicatorHeight-toolHight}
                        currentChart={currentChart}
                        data={data}
                        noOfCandles={noOfCandles}
                        width={width}
                    />
                )
                }
                </AutoSizer>
            </Hideable>
        )
    }
}