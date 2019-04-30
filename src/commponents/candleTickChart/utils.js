
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

export function getOurData(params) {
	const promiseMSFT = postFetch("https://hkquote.vs.com:8088/QryHistoryQuote",params);
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
