
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { 
	BarSeries,
	CandlestickSeries,
	LineSeries,
	MACDSeries,
	RSISeries,
	AreaSeries,
	StraightLine,
	ScatterSeries,
	CircleMarker, } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { curveMonotoneX } from 'd3-shape'
/** 
	MouseCoordinateY  Y轴坐标定位提示箭头
**/
import { 
	CrossHairCursor,
	CurrentCoordinate,
	MouseCoordinateY,
	MouseCoordinateX,
	EdgeIndicator
 } from "react-stockcharts/lib/coordinates";
/** 
	OHLCTooltip  可线图提示信息框
**/
import { 
	MACDTooltip,
	MovingAverageTooltip,
	OHLCTooltip,
	RSITooltip,
	SingleValueTooltip } from "react-stockcharts/lib/tooltip"
import {
  macdAppearance,
  atrAppearance,
  axisAppearance,
  mouseEdgeAppearance,
  theme,
  canvasGradient,
  edgeIndicatorAppearance,
} from './indicatorSettings'
import { elderRay } from 'react-stockcharts/lib/indicator'
import { ClickCallback } from "react-stockcharts/lib/interactive";
import {
	atr14,
	bb,
	defaultSar,
	ema12,
	ema20,
	ema26,
	ema50,
	fi,
	fullSTO,
	macdCalculator,
	rsiCalculator,
	sma5,
	sma10,
	sma20,
	smaVolume50,
	tma20,
	wma20
  } from './indicators'
/** 
	@params xAccessor 必需 启用图表缩放
	@params xScale 必需 启用图表缩放 
	@params xExtents 必需 初始图表范围 
	@params origin  起始坐标 
**/

class CandleStickChart extends React.Component {
	calculateData(inputData) {
		const elder = elderRay()
		return ema20(
			wma20(
			tma20(
				sma5(
				sma10(
				sma20(
				ema50(
					bb(
					smaVolume50(macdCalculator(ema12(ema26(elder(rsiCalculator(fullSTO(fi(defaultSar(atr14(inputData))))))))))
					)
				)
				)
				)
				)
			)
			)
		)
	}
	render() {
		const {
			type, //类型
			data:initialData, //数据
			width, //图表总宽度
			ratio, 
			indicatorHeight, //操作栏高度
			atr,
			macd,
			rsi,
			line,
			volume,
			chartHeight, //k线图图表高度
			forceIndex, 
			currentChart, //当前选择的图表
			start,
			end,
			indicatorLength,
			chartType,
			dotSize,
			swicthIndicator,
			period
		} = this.props;
		if(chartType!=='LIGHT'){
			
		}
		if(initialData==null){
			return null;
		}
		const calculateData = this.calculateData(initialData);
		if (calculateData.length <= 1) {
		  return null
		}
		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date)
		const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculateData);
		const height = chartHeight+indicatorHeight //图表总高度
		var margin = { left: 70, right: 70, top: 20, bottom: 30 }
		var gridHeight = height - margin.top - margin.bottom
		var gridWidth = width - margin.left - margin.right + 50
		var showGrid = true
		var TextsDefault={
			d: "日期: ",
			o: " 开: ",
			h: " 高: ",
			l: " 低: ",
			c: " 收: ",
			v: " 成交量: ",
			na: "-"
		}
		var yGrid = showGrid
		  ? {
			  innerTickSize: -1 * gridWidth,
			  tickStrokeDasharray: 'ShortDot',
			  tickStrokeOpacity: 0.1,
			  tickStrokeWidth: 1
			}
		  : {}
		var xGrid = showGrid
		? {
			innerTickSize: -1 * gridHeight,
			tickStrokeDasharray: 'ShortDot',
			tickStrokeOpacity: 0.1,
			tickStrokeWidth: 1
			}
		: {};
		return (
			<ChartCanvas height={chartHeight+indicatorHeight}
					ratio={ratio}
					width={width}
					margin={{ left: 30, right: Number(50)+Number(dotSize)*4, top: 10, bottom: 20 }}
					type={type}
					seriesName="MSFT"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={[start,end]}
					>
					{
						currentChart.name === 'Candles' && (
							<Chart
								id={1}
								height={chartHeight - 60}
								yExtents={[d=>[d.high,d.low],ema26.accessor(),ema12.accessor()]}
								padding={{top:45,bottom:20}}
							>
								<XAxis 
									axisAt="bottom"
									orient="bottom"
									{...xGrid}
									// showTicks={!macd.active && !rsi.active && !atr.active && !forceIndex.active}
									{...axisAppearance}
									outerTickSize={0}
								/>
								<YAxis axisAt="right" orient="right" ticks={10} {...yGrid} {...axisAppearance} outerTickSize={0} />
								<CandlestickSeries
									opacity={1}
									widthRatio={0.6}
									fill={d => { return d.close < d.open ? theme.GREEN3 : theme.RED2 }}
									candleStrokeWidth={3}
									strokeWidth={3}
									stroke={d => { return d.close < d.open ? theme.GREEN3 : theme.RED2 }}
									wickStroke={d => { return d.close < d.open ? theme.GREEN3 : theme.RED2 }}
								/>
								<MouseCoordinateX
								  at="bottom"
								  orient="bottom"
								  displayFormat={timeFormat('%y-%m-%d/%H:%M')}
								  rectRadius={5}
								  {...mouseEdgeAppearance}
								/>
								<MouseCoordinateY at="right" orient="right" displayFormat={format('.'+dotSize+'f')} {...mouseEdgeAppearance} />
								{line.active && (
									<div>
									<LineSeries yAccessor={sma5.accessor()} stroke={sma5.stroke()} />
									<LineSeries yAccessor={sma10.accessor()} stroke={sma10.stroke()} />
									<LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
									<CurrentCoordinate yAccessor={sma5.accessor()} fill={sma5.stroke()} />
									<CurrentCoordinate yAccessor={sma10.accessor()} fill={sma10.stroke()} />
									<CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
									</div>
								 )} 
								<EdgeIndicator
								  itemType="last"
								  orient="right"
								  edgeAt="right"
								  yAccessor={d => {return data[data.length-1].close}}
								  fill={d => (data[data.length-1].close < data[data.length-1].open ? theme.GREEN3 : theme.RED2)}
								  stroke={d => (data[data.length-1].close < data[data.length-1].open ? theme.GREEN3 : theme.RED2)}
								  textFill={theme.white}
									{...edgeIndicatorAppearance}
									lineStroke={data[data.length-1].close < data[data.length-1].open ? theme.GREEN3 : theme.RED2}
									lineOpacity={0.5}
									lineStrokeDasharray="Solid"
								/>
								<LineSeries 
									yAccessor={d=>{return data[data.length-1].close}} 
									stroke={data[data.length-1].close < data[data.length-1].open ? theme.GREEN4 : theme.RED3}
								/>

								<OHLCTooltip origin={[-25, 0]} {...mouseEdgeAppearance} displayTexts={TextsDefault}/>
								<MovingAverageTooltip
									onClick={e => console.log(e)}
									origin={[-28, 15]}
									options={[
									{
										yAccessor: sma5.accessor(),
										type: 'SMA',
										stroke: sma5.stroke(),
										windowSize: sma5.options().windowSize,
									},
									{
										yAccessor: sma10.accessor(),
										type: 'SMA',
										stroke: sma10.stroke(),
										windowSize: sma10.options().windowSize,
									},
									{
										yAccessor: sma20.accessor(),
										type: 'SMA',
										stroke: sma20.stroke(),
										windowSize: sma20.options().windowSize
									}
									]}
  									textFill='#fff'
								/>
							</Chart>
						)
						}

						{currentChart.name === 'Area' && (
							<Chart id={0} yExtents={d => d.close} height={chartHeight - 60}>
							<defs>
								<linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
								<stop offset="0%" stopColor={theme.skyBlue2} stopOpacity={0.2} />
								<stop offset="70%" stopColor={theme.skyBlue1} stopOpacity={0.4} />
								<stop offset="100%" stopColor={theme.skyBlue} stopOpacity={0.8} />
								</linearGradient>
							</defs>
							<MouseCoordinateX
								at="bottom"
								orient="bottom"
								displayFormat={timeFormat('%m-%d/%H:%M')}
								rectRadius={5}
								{...mouseEdgeAppearance}
							/>
							<MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} {...mouseEdgeAppearance} />
							<XAxis
								axisAt="bottom"
								orient="bottom"
								showTicks={!macd.active && !rsi.active && !atr.active && !forceIndex.active}
								{...xGrid}
								{...axisAppearance}
								outerTickSize={0}
							/>
							<YAxis axisAt="right" orient="right" {...yGrid} ticks={10} {...axisAppearance} outerTickSize={0} />
							<AreaSeries
								yAccessor={d => d.close}
								fill="url(#MyGradient)"
								strokeWidth={1}
								stroke={'#7a8491'}
								interpolation={curveMonotoneX}
								canvasGradient={canvasGradient}
								opacity={1}
							/>

							<EdgeIndicator
								itemType="last"
								orient="right"
								edgeAt="right"
								yAccessor={d => {return data[data.length-1].close}}
								fill={d => ('#7a8491')}
								stroke={d => ('#7a8491')}
								textFill={theme.white}
								{...edgeIndicatorAppearance}
								lineStroke={'#7a8491'}
								lineOpacity={0.5}
								lineStrokeDasharray="Solid"
							/>
							</Chart>
						)}
						{currentChart.name === 'Line' && (
						  <Chart id={1} height={chartHeight - 60} yExtents={d => [d.high, d.low]}>
							<MouseCoordinateX
							  at="bottom"
							  orient="bottom"
							  displayFormat={timeFormat('%m-%d/%H:%M')}
							  rectRadius={5}
							  {...mouseEdgeAppearance}
							/>
							<MouseCoordinateY at="right" orient="right" displayFormat={format('.'+dotSize+'f')} {...mouseEdgeAppearance} />
							<XAxis
							  axisAt="bottom"
							  orient="bottom"
							  {...xGrid}
							  showTicks={!macd.active && !rsi.active && !atr.active && !forceIndex.active}
							  {...axisAppearance}
							  outerTickSize={0}
							/>
							<YAxis axisAt="right" orient="right" ticks={10} {...yGrid} {...axisAppearance} outerTickSize={0} />
							<LineSeries yAccessor={d => d.close} strokeDasharray="Solid"
								stroke="#7a8491"
							/>
							{/* <ScatterSeries yAccessor={d => d.close} marker={CircleMarker} markerProps={{ r: 3 }} /> */}
							<OHLCTooltip forChart={1} origin={[-25, 0]} {...mouseEdgeAppearance}  displayTexts={TextsDefault}/>
						  </Chart>
						)}
						{currentChart.name === 'Heikin Ashi' && (
						  <Chart
							id={0}
							height={chartHeight - 60}
							yExtents={[d => [d.high, d.low], sma5.accessor(), sma10.accessor(), sma20.accessor()]}
							padding={{ top: 10, bottom: 20 }}
						  >
							{/* <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} {...mouseEdgeAppearance} /> */}
							<XAxis
							  axisAt="bottom"
							  orient="bottom"
							  {...xGrid}
							  showTicks={!macd.active && !rsi.active && !atr.active && !forceIndex.active}
							  {...axisAppearance}
								outerTickSize={0}
							/>
							<YAxis 
								axisAt="right" 
								orient="right" 
								ticks={10} 
								{...yGrid} 
								{...axisAppearance} 
								outerTickSize={0} 
								displayFormat={format('.'+dotSize+'f')}
								/>
							
							<MouseCoordinateY 
								at="right" 
								orient="right" 
								displayFormat={format('.'+dotSize+'f')} 
								{...mouseEdgeAppearance}
							/>
			  
							<CandlestickSeries
							  fill={d => d.close < d.open ? theme.GREEN3 : theme.RED2 }
							  opacity={1}
							  stroke={d => d.close < d.open ? theme.GREEN3 : theme.RED2 }
							  widthRatio={0.8}
							  wickStroke={d => d.close < d.open ? theme.GREEN3 : theme.RED2 }
							/>
			  
							{line.active && (
							  <div>
								<LineSeries yAccessor={sma5.accessor()} stroke={sma5.stroke()} />
								<LineSeries yAccessor={sma10.accessor()} stroke={sma10.stroke()} />
								<LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
								<CurrentCoordinate yAccessor={sma5.accessor()} fill={sma5.stroke()} />
								<CurrentCoordinate yAccessor={sma10.accessor()} fill={sma10.stroke()} />
								<CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
							  </div>
							)}
			  
							<EdgeIndicator
							  itemType="last"
							  orient="right"
							  edgeAt="right"
							  yAccessor={sma5.accessor()}
							  fill={sma5.fill()}
								{...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
							<EdgeIndicator
							  itemType="last"
							  orient="right"
							  edgeAt="right"
							  yAccessor={sma10.accessor()}
							  fill={sma10.fill()}
							  {...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
							<EdgeIndicator
							  itemType="last"
							  orient="right"
							  edgeAt="right"
							  yAccessor={sma10.accessor()}
							  fill={sma10.fill()}
							  {...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
							<EdgeIndicator
							  itemType="last"
							  orient="right"
							  edgeAt="right"
							  yAccessor={d => d.close}
							  fill={d => (d.close < d.open ? theme.GREEN3 : theme.RED2)}
							  {...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
							<EdgeIndicator
							  itemType="first"
							  orient="left"
							  edgeAt="left"
							  yAccessor={sma5.accessor()}
							  fill={sma5.fill()}
							  {...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
							<EdgeIndicator
							  itemType="first"
							  orient="left"
							  edgeAt="left"
							  yAccessor={sma10.accessor()}
							  fill={sma10.fill()}
							  {...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
							<EdgeIndicator
							  itemType="first"
							  orient="left"
							  edgeAt="left"
							  yAccessor={sma20.accessor()}
							  fill={sma20.fill()}
							  {...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
							<EdgeIndicator
							  itemType="first"
							  orient="left"
							  edgeAt="left"
							  yAccessor={d => d.close}
							  fill={d => (d.close < d.open ? theme.GREEN3 : theme.RED2)}
							  {...edgeIndicatorAppearance}
								displayFormat={format('.'+dotSize+'f')}
							/>
			  
							<OHLCTooltip origin={[-40, 0]} {...mouseEdgeAppearance} displayTexts={TextsDefault}/>
							<MovingAverageTooltip
							  origin={[-28, 15]}
							  options={[
								{
								  yAccessor: sma5.accessor(),
								  type: 'SMA',
								  stroke: sma5.stroke(),
									windowSize: sma5.options().windowSize
								},
								{
								  yAccessor: sma10.accessor(),
								  type: 'SMA',
								  stroke: sma10.stroke(),
								  windowSize: sma10.options().windowSize
								},
								{
								  yAccessor: sma20.accessor(),
								  type: 'SMA',
								  stroke: sma20.stroke(),
								  windowSize: sma20.options().windowSize
								}
							  ]}
							  textFill='#fff'
							/>
						  </Chart>
						)}
						{volume.active && (
						  <Chart
							id={2}
							height={(chartHeight+indicatorHeight)/indicatorLength}
							yExtents={[d => d.volume, smaVolume50.accessor()]}
							origin={(w, h) => [
								0, 
								h - 
								(chartHeight+indicatorHeight)/indicatorLength -
								(atr.active ? (chartHeight+indicatorHeight)/indicatorLength : 0) -
								(rsi.active ? (chartHeight+indicatorHeight)/indicatorLength : 0) -
								(forceIndex.active ? (chartHeight+indicatorHeight)/indicatorLength : 0)
							]}
						  >
							<XAxis
							  axisAt="bottom"
							  orient="bottom"
							  {...axisAppearance}
							  {...xGrid}
							  showTicks={!atr.active && !rsi.active}
								tickFormat={(a,b,c)=>{
								}}
							/>
							<YAxis axisAt="right" orient="right" ticks={2} {...yGrid} {...axisAppearance} />
							{period!=='KLINE_UNKNOWN'&&(
								<ClickCallback
									onClick={ (moreProps, e) => {
									swicthIndicator({ name: 'MACD', active: false, height: 1 });
								}}
									// onMouseMove={ (moreProps, e) => { console.log("onMouseMove", moreProps, e); } }
									// onMouseDown={ (moreProps, e) => { console.log("onMouseDown", moreProps, e); } }
									// onDoubleClick={ (moreProps, e) => { console.log("onDoubleClick", moreProps, e); } }
									// onContextMenu={ (moreProps, e) => { console.log("onContextMenu", moreProps, e); } }
									// onPan={ (moreProps, e) => { console.log("onPan", moreProps, e); } }
									// onPanEnd={ (moreProps, e) => { console.log("onPanEnd", moreProps, e); } }
								/>
							)}
							{!atr.active &&
							  !rsi.active && (
								<MouseCoordinateX
								  at="bottom"
								  orient="bottom"
								  displayFormat={timeFormat('%Y-%m-%d/%H:%M')}
								  rectRadius={5}
								  {...mouseEdgeAppearance}
								/>
								)}
								<MouseCoordinateY at="right" orient="right" displayFormat={format('.'+dotSize+'f')} {...mouseEdgeAppearance} />
							<BarSeries yAccessor={d => d.volume} fill={d => d.close < d.open ? theme.GREEN3 : theme.RED2} />
							{/* <AreaSeries yAccessor={smaVolume50.accessor()} {...volumeAppearance} /> */}
						  </Chart>
						)}
						{macd.active && (
						  <Chart
							id={3}
							height={(chartHeight+indicatorHeight)/indicatorLength}
							yExtents={macdCalculator.accessor()}
							origin={(w, h) => [
							  0,
							  h -
								(chartHeight+indicatorHeight)/indicatorLength -
								(atr.active ? (chartHeight+indicatorHeight)/indicatorLength : 0) -
								(rsi.active ? (chartHeight+indicatorHeight)/indicatorLength : 0) -
								(forceIndex.active ? (chartHeight+indicatorHeight)/indicatorLength : 0)
							]}
							padding={{ top: 35, bottom: 10 }}
						  >
							<XAxis
							  axisAt="bottom"
							  orient="bottom"
							  {...axisAppearance}
							  {...xGrid}
							  showTicks={!atr.active && !rsi.active}
								tickFormat={(a,b,c)=>{
								}}
							/>
							<YAxis axisAt="right" orient="right" ticks={2} {...yGrid} {...axisAppearance} />
			  
							{!atr.active &&
							  !rsi.active && (
								<MouseCoordinateX
								  at="bottom"
								  orient="bottom"
								  displayFormat={timeFormat('%Y-%m-%d/%H:%M')}
								  rectRadius={5}
								  {...mouseEdgeAppearance}
								/>
							  )}
							<MouseCoordinateY at="right" orient="right" displayFormat={format('.'+dotSize+'f')} {...mouseEdgeAppearance} />
							<MACDSeries yAccessor={d => d.macd} {...macdAppearance} />
							<MACDTooltip
							  origin={[-28, 10]}
							  yAccessor={d => d.macd}
							  options={macdCalculator.options()}
							  appearance={macdAppearance}
							/>
							
							<ClickCallback
								onClick={ (moreProps, e) => {
									swicthIndicator({ name: 'Volume', active: false, height: 1 });
							} }
								// onMouseMove={ (moreProps, e) => { console.log("onMouseMove", moreProps, e); } }
								// onMouseDown={ (moreProps, e) => { console.log("onMouseDown", moreProps, e); } }
								// onDoubleClick={ (moreProps, e) => { console.log("onDoubleClick", moreProps, e); } }
								// onContextMenu={ (moreProps, e) => { console.log("onContextMenu", moreProps, e); } }
								// onPan={ (moreProps, e) => { console.log("onPan", moreProps, e); } }
								// onPanEnd={ (moreProps, e) => { console.log("onPanEnd", moreProps, e); } }
							/>

						  </Chart>
						)}
						{rsi.active && (
						  <Chart
							id={4}
							yExtents={[0, 100]}
							height={(chartHeight+indicatorHeight)/indicatorLength}
							origin={(w, h) => [
							  0,
							  h - (chartHeight+indicatorHeight)/indicatorLength - (atr.active ? (chartHeight+indicatorHeight)/6 : 0) - (forceIndex.active ? (chartHeight+indicatorHeight)/6 : 0)
							]}
							padding={{ top: 10, bottom: 10 }}
						  >
							<XAxis
							  axisAt="bottom"
							  orient="bottom"
							  showTicks={!atr.active && !forceIndex.active}
							  {...xGrid}
							  {...axisAppearance}
							  outerTickSize={0}
							/>
			  
							<YAxis axisAt="right" orient="right" tickValues={[30, 50, 70]} {...yGrid} {...axisAppearance} />
			  
							{!atr.active &&
							  !forceIndex.active && (
								<MouseCoordinateX
								  at="bottom"
								  orient="bottom"
								  displayFormat={timeFormat('%Y-%m-%d')}
								  {...mouseEdgeAppearance}
								/>
							  )}
							<MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} {...mouseEdgeAppearance} />
			  
							<RSISeries yAccessor={d => d.rsi} />
			  
							<RSITooltip origin={[-28, 15]} yAccessor={d => d.rsi} options={rsiCalculator.options()} />
						  </Chart>
						)}
						{atr.active && (
						  <Chart
							id={5}
							yExtents={atr14.accessor()}
							height={(chartHeight+indicatorHeight)/indicatorLength}
							origin={(w, h) => [0, h - (chartHeight+indicatorHeight)/indicatorLength - (forceIndex.active ? (chartHeight+indicatorHeight)/indicatorLength : 0)]}
							padding={{ top: 10, bottom: 10 }}
						  >
							<XAxis
							  axisAt="bottom"
							  orient="bottom"
							  {...xGrid}
							  {...axisAppearance}
							  outerTickSize={0}
							  showTicks={!forceIndex.active}
							/>
							<YAxis axisAt="right" orient="right" {...yGrid} {...axisAppearance} ticks={2} />
			  
							{!forceIndex.active && (
							  <MouseCoordinateX
								at="bottom"
								orient="bottom"
								displayFormat={timeFormat('%Y-%m-%d')}
								{...mouseEdgeAppearance}
							  />
							)}
							<MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} {...mouseEdgeAppearance} />
			  
							<LineSeries yAccessor={atr14.accessor()} {...atrAppearance} />
							<SingleValueTooltip
							  yAccessor={atr14.accessor()}
							  yLabel={`ATR (${atr14.options().windowSize})`}
							  yDisplayFormat={format('.2f')}
							  /* valueStroke={atr14.stroke()} - optional prop */
							  /* labelStroke="#4682B4" - optional prop */
							  origin={[-40, 15]}
							/>
						  </Chart>
						)}
						{forceIndex.active && (
						  <Chart
							id={6}
							height={(chartHeight+indicatorHeight)/indicatorLength}
							yExtents={fi.accessor()}
							origin={(w, h) => [0, h - (chartHeight+indicatorHeight)/indicatorLength]}
							padding={{ top: 30, right: 0, bottom: 10, left: 0 }}
						  >
							<XAxis axisAt="bottom" orient="bottom" {...xGrid} {...axisAppearance} outerTickSize={0} />
							<YAxis
							  axisAt="right"
							  orient="right"
							  {...yGrid}
							  ticks={4}
							  tickFormat={format('.2s')}
							  {...axisAppearance}
							/>
							<MouseCoordinateX
							  at="bottom"
							  orient="bottom"
							  displayFormat={timeFormat('%Y-%m-%d')}
							  {...mouseEdgeAppearance}
							/>
							<MouseCoordinateY at="right" orient="right" displayFormat={format('.4s')} {...mouseEdgeAppearance} />
			  
							<AreaSeries baseAt={scale => scale(0)} yAccessor={fi.accessor()} />
							<StraightLine yValue={0} />
			  
							<SingleValueTooltip
							  yAccessor={fi.accessor()}
							  yLabel="ForceIndex (1)"
							  yDisplayFormat={format('.4s')}
							  origin={[-40, 15]}
							/>
						  </Chart>
						)}
						<CrossHairCursor strokeDasharray={'ShortDash2'} stroke={'#ddd'}/>
			</ChartCanvas>
		);
	}
}

CandleStickChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
	type: "svg",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
