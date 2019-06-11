/* eslint-disable */
import React from 'react'
import { AutoSizer } from 'react-virtualized'
import { getOurData,getTime,handleTime,handleOriginTime,getUrlParams } from "./utils"
import styled from 'styled-components';

import ChartLoadingScreen from './chartLoadingScreen';
import { StandardSelect,IndicatorSelect } from '../SelectMenu';
import { Socket } from '../socket';

import {
  Hideable
} from '../common/index'

export const timeSpans = [
    { name: '1 min', label: '1m',period:'KLINE_1MIN' },
    { name: '5 min', label: '5m',period:'KLINE_5MIN' },
    { name: '15 min', label: '15m',period:'KLINE_15MIN' },
    { name: '30 min', label: '30m',period:'KLINE_30MIN' },
    { name: '1 hr', label: '1h',period:'KLINE_1HR' },
    { name: '4 hr', label: '4h',period:'KLINE_4HR' },
    { name: '12 hr', label: '12h',period:'KLINE_12HR' },
    { name: '1 day', label: '1d',period:'KLINE_1DAY' },
    // { name: '7 days', label: '7d' },
    // { name: '1 month', label: '1M' },
].map((p, index) => ({ ...p, rank: index }));

const chartTypes= [
    { name: 'Candles', icon: 'timeline-bar-chart' },
    { name: 'Heikin Ashi', aicon: 'chart' },
    { name: 'Line', icon: 'timeline-line-chart' },
    { name: 'Area', icon: 'timeline-area-chart' },
  ].map((p, index) => ({ ...p, rank: index }));
  
const indicators = [
    { name: 'Volume', active: true, height: 1 },
    { name: 'Trendline', active: true, height: 0 },
    { name: 'MACD', active: false, height: 1 },
    { name: 'RSI', active: false, height: 1 },
    { name: 'ATR', active: false, height: 1 },
    { name: 'ForceIndex', active: false, height: 1 },
  ].map((p, index) => ({ ...p, rank: index }));

class OHLCV extends React.PureComponent{
    constructor(props){
        super(props);
        this.getCurrentChartData = this.getCurrentChartData.bind(this);
        this.handleChartData = this.handleChartData.bind(this);
        // this.changeTimeSpan = this.changeTimeSpan.bind(this);
    }
    componentDidMount(){

    }
    state = {
        toolHight:0, //工具栏高度
        indicatorHeight: 1, //指标高度
        currentChart: chartTypes[0], //当前选择的图表
        chartTypes: chartTypes, //所有图表数组
        indicators: indicators, //所有指标数据
        timeSpans: timeSpans, //所有时间周期数据
        currentTimeSpan:timeSpans[0], //当前选择时间周期
        expandedChard: true, 
        isOpen: true,
        ohlcvData:null, //图表数据
        contractNo:'FO_NQ_1906',//合约编号
        period:'KLINE_UNKNOWN',//周期
        count:500,//条数
        WSUrl:'wss://quote.vs.com:8889/',//ws地址
        socket:null, //ws实例
        wsObj:{
            account:'chenlin',
            password:'a123456',
            version:'2.0'
        },
        isConnectWS:false,
        offsetTime:60000,
        lastData:{},
        LastVolume:'',
        start:0,
        end:0,
        dotSize:3,
        urlParams:{
            chartType:'',
            period:'KLINE_UNKNOWN',
            contractNo:'FO_NQ_1906',
            contractName:'国际原油',
            apiUrl:'https://hkquote.vs.com:8088/QryHistoryQuote',
            WSUrl:'wss://hkquote.vs.com:8889',
            priceType:1,//1最新价 2买价 3卖价
            dotSize:3,
        }
    }
    //获取当前选择的图表数据
    getCurrentChartData = ()=>{
        var params = {
            contractCode:this.state.contractNo,
            count:this.state.count,
            period:this.state.period
        }
		getOurData(this.state.urlParams.apiUrl,params).then(data => {
            if(!data.data.lines){
                this.setState({ ohlcvData:[] })
            }else{
                this.handleChartData(data.data.lines);
            }
		})
    }
    //处理图表数据
    handleChartData = (data)=>{
        const {
            urlParams,
            period
        }=this.state;
        var newData = data.map((value,index)=>{
            return {
                close:value[1],
                date:new Date(value[0]),
                high:value[4],
                low:value[3],
                open:value[2],
                volume:value[5],
            }
        })
        if(urlParams.chartType === 'LIGHT'){
            this.setState({ 
                ohlcvData:newData.length>=2?[newData[newData.length-2],newData[newData.length-1]]:newData.length===1?[newData[newData.length-1]]:[],
                isConnectWS:true,
                start:1,
                end:0,
                lastData:newData.length>=1?newData[newData.length-1]:[]
            });
        }else{
            if(period == 'KLINE_UNKNOWN'){
                this.setState({ 
                    ohlcvData:newData,
                    isConnectWS:true,
                    lastData:newData.length>=1?newData[newData.length-1]:[],
                    start:newData.length-1,
                    end:newData.length>500?newData.length-500:0,
                });
            }else{
                this.setState({ 
                    ohlcvData:newData,
                    isConnectWS:true,
                    lastData:newData.length>=1?newData[newData.length-1]:[],
                    start:newData.length-1,
                    end:newData.length>100?newData.length-100:0,
                });
            }
        }

    }
    //切换周期
    changeTimeSpan = (e)=>{
        if(this.state.currentTimeSpan === e){
            return;
        }
        this.setState({currentTimeSpan:e});
        var params = {
            contractCode:this.state.contractNo,
            count:this.state.count,
            period:e.period
        }
        this.setState({ohlcvData:null})
		getOurData(params).then(data => {
            if(!data.data.lines){
                this.setState({ ohlcvData:[] })
            }else{
                this.handleChartData(data.data.lines);
            }
		})
    }
    //切换图表类型
    changeChartType = (e)=>{
        if(this.state.currentChart === e){
            return;
        }
        this.setState({currentChart:e});
    }
    //选择指标
    changeIndicator = (indicator)=>{
        const { indicators, indicatorHeight } = this.state;
        let newIndicatorHeight;
        let active = !indicator.active;
        active
          ? (newIndicatorHeight = indicatorHeight + indicators[indicator.rank].height)
          : (newIndicatorHeight = indicatorHeight - indicators[indicator.rank].height);
        this.setState({
            indicators:[
                ...indicators.slice(0,indicator.rank),
                {...indicators[indicator.rank], active},
                ...indicators.slice(indicator.rank + 1),
            ],
            indicatorHeight: newIndicatorHeight,
        })
    }
    swicthIndicator = (indicator)=>{
        if(indicator.name == 'Volume'){
            this.setState({
                indicators:[
                    { name: 'Volume', active: true, height: 1 },
                    { name: 'Trendline', active: true, height: 0 },
                    { name: 'MACD', active: false, height: 1 },
                    { name: 'RSI', active: false, height: 1 },
                    { name: 'ATR', active: false, height: 1 },
                    { name: 'ForceIndex', active: false, height: 1 },
                ],
            })
        }else if(indicator.name == 'MACD'){
            this.setState({
                indicators:[
                    { name: 'Volume', active: false, height: 1 },
                    { name: 'Trendline', active: true, height: 0 },
                    { name: 'MACD', active: true, height: 1 },
                    { name: 'RSI', active: false, height: 1 },
                    { name: 'ATR', active: false, height: 1 },
                    { name: 'ForceIndex', active: false, height: 1 },
                ],
            })
        }
    }
    handleWSData = (data)=>{
        if(this.state.ohlcvData==null){
            return;
        }
        const {
            lastData,
            offsetTime,
            LastVolume,
            ohlcvData,
            urlParams
        } = this.state;
        if(LastVolume === ''){
            this.setState({LastVolume:data[6]})
        }
        var preTime = '';
        var nowTime = '';
        if(urlParams.chartType!=='LIGHT'){
            preTime = handleOriginTime(lastData.date,'yyyy-mm-dd hh:mm');
            nowTime = handleOriginTime(data[1],'yyyy-mm-dd hh:mm');
        }else{
            preTime = lastData.date?lastData.date:new Date();
            nowTime = data[1];
        }
        if(getTime(nowTime)-getTime(preTime)>=offsetTime||ohlcvData.length===0){
            var newData = {
                close:data[3],
                date:new Date(data[1]),
                high:data[3],
                low:data[3],
                open:data[3],
                volume:0,
            }
            //下一个点
            this.setState(function(prevState,props){
                prevState.ohlcvData.push(newData)
                return{
                    ohlcvData:prevState.ohlcvData,
                    lastData:newData,
                    LastVolume:data[6],
                }
            })
            if(urlParams.chartType==='LIGHT'){
                this.setState(function(prevState,props){
                    return{
                        start:prevState.ohlcvData.length-1,
                        end:0,
                    }
                })
                if(ohlcvData.length>50){
                    this.setState(function(prevState,props){
                        return{
                            ohlcvData:prevState.ohlcvData.slice(-50),
                        }
                    })
                }
            }
        }else{
            //当前点
            var _lastData = lastData;
            if(_lastData.high<data[3]){
                //比较高
                _lastData.high = data[3]
            }
            if(_lastData.low>data[3]){
                //比较低
                _lastData.low = data[3]
            }
            _lastData.close = data[3];
            _lastData.volume+=(data[6]-this.state.LastVolume);
            this.setState(function(prevState,props){
                prevState.ohlcvData.splice(prevState.ohlcvData.length-1,1,_lastData);
                return{
                    ohlcvData:prevState.ohlcvData.slice(0),
                    lastData:_lastData,
                    LastVolume:data[6],
                }
            })
        }
    }
    componentWillMount(){
        if(getUrlParams()){
            var _urlParams = getUrlParams();
            this.state.urlParams = _urlParams;
            this.state.period = _urlParams.period;
            this.state.contractNo = _urlParams.contractNo;
            this.state.WSUrl = _urlParams.WSUrl;
            this.state.chartType = _urlParams.chartType;
            this.state.dotSize = _urlParams.dotSize
        }
        const {
            period,
            chartTypes,
            urlParams
        } = this.state;
        if(urlParams.chartType!=='LIGHT'){
            this.getCurrentChartData();
            switch(period){
                case 'KLINE_UNKNOWN':this.setState({
                    offsetTime:60000,
                    currentChart:chartTypes[3],
                    indicators:[
                        { name: 'Volume', active: true, height: 1},
                        { name: 'Trendline', active: true, height: 0 },
                        { name: 'MACD', active: false, height: 1 },
                        { name: 'RSI', active: false, height: 1 },
                        { name: 'ATR', active: false, height: 1 },
                        { name: 'ForceIndex', active: false, height: 1 },
                    ]
                });break;
                case 'KLINE_1MIN':this.setState({offsetTime:60000});break;
                case 'KLINE_5MIN':this.setState({offsetTime:300000});break;
                case 'KLINE_15MIN':this.setState({offsetTime:900000});break;
                case 'KLINE_30MIN':this.setState({offsetTime:1800000});break;
                case 'KLINE_1HR':this.setState({offsetTime:3600000});break;
                case 'KLINE_2HR':this.setState({offsetTime:7200000});break;
                case 'KLINE_4HR':this.setState({offsetTime:14400000});break;
                case 'KLINE_12HR':this.setState({offsetTime:43200000});break;
                case 'KLINE_1DAY':this.setState({offsetTime:96400000});break;
                default:break;
            }
        }else{
            this.getCurrentChartData();
            this.setState({
                offsetTime:1000,
                currentChart:chartTypes[2],
                indicatorHeight:0,
                indicators:[
                    { name: 'Volume', active: false, height: 0 },
                    { name: 'Trendline', active: true, height: 0 },
                    { name: 'MACD', active: false, height: 1 },
                    { name: 'RSI', active: false, height: 1 },
                    { name: 'ATR', active: false, height: 1 },
                    { name: 'ForceIndex', active: false, height: 1 },
                ]
            })
        }
    }
    render(){
        const {
            state:{
                indicators,
                indicatorHeight,
                currentChart,
                currentTimeSpan,
                ohlcvData,
                toolHight,
                WSUrl,
                wsObj,
                isConnectWS,
                contractNo,
                start,
                end,
                urlParams,
                dotSize,
                period
            },
            changeTimeSpan,
            changeChartType,
            changeIndicator,
            swicthIndicator,
            handleWSData
        } = this;
        return (
            <Hideable>
                {/* <AutoSizer style={{width:'100%',height:toolHight,display:'flex'}}>
                    {({width})=>(
                        <Toolbar
                            state={this.state}
                            changeTimeSpan={changeTimeSpan}
                            currentTimeSpan={currentTimeSpan}
                            currentChart={currentChart}
                            changeChartType={changeChartType}
                            changeIndicator={changeIndicator}
                        >
                        </Toolbar>
                    )}
                </AutoSizer> */}
                <Socket
                    url={WSUrl}
                    wsObj={wsObj}
                    isConnectWS={isConnectWS}
                    onMessage={handleWSData}
                    contractNo={contractNo}
                >
                    <ChartLoadingScreen
                        toolHight={toolHight}
                        indicatorHeight={indicatorHeight}
                        currentChart={currentChart}
                        data={ohlcvData}
                        indicatorLength={indicators.length}
                        volume={indicators[0]}
                        line={indicators[1]}
                        macd={indicators[2]}
                        rsi={indicators[3]}
                        atr={indicators[4]}
                        forceIndex={indicators[5]}
                        start={start}
                        end={end}
                        chartType={urlParams.chartType}
                        dotSize={dotSize}
                        swicthIndicator={swicthIndicator}
                        period={period}
                    />
                </Socket>
                
            </Hideable>
        )
    }
}

const Toolbar = (props)=>{
    const {
        state,
        changeTimeSpan,
        currentTimeSpan,
        currentChart,
        changeChartType,
        changeIndicator
    } = props

    return(
        <ToolbarWrapper>
            <Hideable>
                <ChartTypeMenu>
                    <StandardSelect
                    items={state.chartTypes}
                    item={currentChart}
                    handleChange={changeChartType}
                    icon="series-add"
                    />
                </ChartTypeMenu>
            </Hideable>
            <Hideable>
                <TimeSpanMenu>
                    <StandardSelect
                    items={state.timeSpans}
                    item={currentTimeSpan}
                    handleChange={changeTimeSpan}
                    icon="series-add"
                    />
                </TimeSpanMenu>
            </Hideable>
            <Hideable>
                <IndicatorMenu>
                    <IndicatorSelect
                    items={state.indicators}
                    handleChange={changeIndicator}
                    />
                </IndicatorMenu>
            </Hideable>
        </ToolbarWrapper>
    )
}
const ToolbarWrapper = styled.div`
display: flex;
justify-content: start;
`;
const ChartTypeMenu = styled.div`
  position: relative;
  float: left;
  margin-right: 25px;
  display: flex;
  align-items: center;
`;
const TimeSpanMenu = styled.div`
  position: relative;
  float: left;
  margin-right: 25px;
  display: flex;
  align-items: center;
`;
const IndicatorMenu = styled.div`
    position: relative;
    float: left;
    margin-right: 25px;
    display: flex;
    align-items: center;
`
export default OHLCV;