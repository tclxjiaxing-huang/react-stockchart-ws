
import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

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
	const promiseMSFT = fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
		.then(response => response.text())
		.then(data => tsvParse(data, parseData(parseDate)))
	return promiseMSFT;
}

export function getOurData() {
	const promiseMSFT = postFetch("https://hkquote.vs.com:8088/QryHistoryQuote",{contractCode:'FO_CL_1906',count:100,period:'KLINE_UNKNOWN'})
	return promiseMSFT;
}

export function handleOurData(data) {
    if(!Array.isArray(data)){
        return data;
    }
    var newData = [];
    return newData;
}
