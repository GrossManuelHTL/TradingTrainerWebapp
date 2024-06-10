import {getMonthRange} from "../API/apidata.mjs";
import {getStockName, fetchStock} from "../ServerClient/serverClient.mjs";

const colors = [
    "#17e285", "#ff5733", "#ba55d3", "#3357ff", "#ff33a1",
    "#ff4500", "#33fff5", "#ffae33", "#e217e2", "#2e8b57",
    "#8b2e2e", "#2e8b8b", "#8b572e", "#a133ff", "#32cd32",
    "#1e90ff", "#ff69b4", "#33ff57", "#ff6347", "#4682b4"
];

let names = [];
let stocks = [];
let data = [];
let graphs = [];
let button = document.getElementById("button");

button.onclick = async function() {
    let input = document.getElementById("stockInput");
    let stockName = await fetchStock(input.value);
    await load(stockName);
}

async function load(name) {
    names.push(name);
    let st = await getMonthRange(name);
    stocks.push(st);

    getDataProviderDate();
    getGraphs();
    Chart();
}

function Chart()
{
    if ($('#chart').length) {

        var chart = AmCharts.makeChart("chart", {
            "type": "serial",
            "theme": "light",
            "legend": {
                "useGraphSettings": true
            },
            "dataProvider": data,
            "startDuration": 0.5,
            "graphs": graphs,
            "chartCursor": {
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "date",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "fillAlpha": 0.05,
                "fillColor": "#000000",
                "gridAlpha": 0,
                "position": "top"
            },
            "export": {
                "enabled": false
            }
        });
    }
}

let symbol = window.location.search.split("=")[1];
let name = await getStockName(symbol);
await load(name);

function getDataProviderDate()
{
    data = [];
    for (let i = 0; i < stocks.length; i++) {
        for(let j = 0; j < stocks[i].length; j++) {
            if (i === 0) data.push({date: formatDate(stocks[i][j].date)});
            data[j][names[i]] = stocks[i][j].data;
        }
    }
}

function formatDate(date) {
    let month = (date.getMonth()+1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${month}:${day}`;
}

function getGraphs()
{
    graphs = [];
    for (let i = 0; i < names.length; i++) {
        graphs.push({
            "balloonText": `${names[i]}, [[value]]`,
            "bullet": "round",
            "hidden": false,
            "title": `${names[i]}`,
            "valueField": `${names[i]}`,
            "fillAlphas": 0,
            "lineColor": colors[i],
            "lineThickness": 2,
            "negativeLineColor": colors[i],
        });
    }
}