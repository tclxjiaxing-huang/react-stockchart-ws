
/* eslint-disable */
import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";
import { Socket } from "net";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");
function postFetch(url,data){
    return fetch(url,{
        body:JSON.stringify(data),
        method:'POST',
    }).then(response=>response.json())
}
export function getData() {
	const promiseMSFT = fetch("https://cdn.jsdelivr.net/gh/rrag/react-stockcharts@master/docs/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}

export function getOurData(api,params) {
	const promiseMSFT = postFetch(api,params);
	return promiseMSFT;
}

export function handleOurData(data) {
    if(!Array.isArray(data)){
        return data;
    }
    var newData = [];
    return newData;
}

export function getTime(date){
	return new Date(date).getTime();
}
//处理ws时间
export function handleTime(date){
	var a = date.slice(' ')[0];
	var b = date.slice(' ')[1].slice('.')[0];
	var c = b[0]+':'+b[1]+':00';
	return a+' '+c;
}
//处理时间戳
export function handleOriginTime(date,type){
	var newDate = new Date(date);
	var year = newDate.getFullYear();
	var month = (newDate.getMonth()+1)<10?'0'+(newDate.getMonth()+1):(newDate.getMonth()+1);
	var day = newDate.getDate()<10?'0'+newDate.getDate():newDate.getDate();
	var hour = newDate.getHours()<10?'0'+newDate.getHours():newDate.getHours();
	var minute = newDate.getMinutes()<10?'0'+newDate.getMinutes():newDate.getMinutes();
	var result = '';
	switch(type){
		case 'yyyy-mm-dd':result=year+'/'+month+'/'+day;break;
		case 'yyyy-mm-dd hh:mm':result=year+'/'+month+'/'+day+' '+hour+':'+minute+':00';break;
		default:break;
	}
	return result;
}
//获取url参数
export function getUrlParams(){
    if (window.location.href.indexOf('?') == -1) {
        return false;
    }
    var url = decodeURI(decodeURI(window.location.href.split('?')[1])); //获取url中"?"符后的字串
    var theRequest = {};
    var strs = url.split("&");
    for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
    return theRequest;
}
