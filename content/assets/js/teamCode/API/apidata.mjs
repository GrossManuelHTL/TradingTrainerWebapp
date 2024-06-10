import {getDateString, Stock} from "../model.mjs";
import {getStockSym} from "../ServerClient/serverClient.mjs";

const finnhubKey = "cnk1a91r01qvd1hlrv30cnk1a91r01qvd1hlrv3g";
const mapolygonKey = "hfWWLRN1okw1sX49EmIQ1ccVwaS1GbdF";
const jpolygonKey = "aEMjzbpWJ5Z0qeGSofwG4_LDJoM9LN_5";
const mipolygonKey = "qeolYMNhlr3P4WFFLZjGYtS3Fc62Aygc";


export async function getYearsRange(symbol) {
    try {
        let d = new Date();
        d.setMonth(d.getMonth() - 36);
        let to = getDateString(d);

        let url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${to}/${getDateString(new Date())}?adjusted=true&sort=asc&apiKey=${mapolygonKey}`;

        let resp = await fetch(url);
        let data = await resp.json();

        return data.results.map(d => ({
            date: new Date(d.t),
            data: d.c,
        }));
    } catch (error) {
        console.log("Fehler beim Abrufen der Daten:", error);
    }
}

export async function getMonthRange(name) {
    try {
        let d = new Date();
        d.setMonth(d.getMonth() - 1);
        let to = getDateString(d);

        let symbol = await getStockSym(name);
        let url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${to}/${getDateString(new Date())}?adjusted=true&sort=asc&apiKey=${mipolygonKey}`;

        let resp = await fetch(url);
        let data = await resp.json();

        let stocks = [];
        data.results.forEach(d => {
            stocks.push({
                date: new Date(d.t),
                data: d.c
            });
        });
        return stocks;

    } catch (error) {
        console.error("Error:", error);
    }
}



function formatTime(date) {
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export async function getTodayStock(symbol) {
    try {
        let from = new Date();
        from.setDate(from.getDate() - 2);
        from = getDateString(from);
        let to = getDateString(new Date());

        //let url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/30/minute/${from}/${to}?adjusted=true&sort=asc&apiKey=${jpolygonKey}`;
        let url = "https://api.polygon.io/v2/aggs/ticker/AAPL/range/30/minute/2024-06-06/2024-06-07?adjusted=true&sort=asc&apiKey=aEMjzbpWJ5Z0qeGSofwG4_LDJoM9LN_5";

        let resp = await fetch(url);
        let data = await resp.json();

        let strings = [];
        let stocks = [];
        for(let d of data.results)
        {
            let str = formatTime(new Date(d.t));
            let stock = d.c;
            strings.push(str);
            stocks.push(stock);
        }

        return [strings, stocks];
    } catch (error) {
        console.log("Fehler beim Abrufen der Daten:", error);
    }
}

export async function getQuote(symbol) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    const data = await response.json();
    return new Stock(symbol, data.c, data.t);
}

export async function getMarketStatus() {
    try {
        let url = `https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${finnhubKey}`;
        let resp = await fetch(url);
        return await resp.json();
    } catch (error) {
        console.log("Fehler beim Abrufen der Daten:", error);
    }
}

export async function getHoliday() {
    try {
        let url = `https://finnhub.io/api/v1/stock/market-holiday?exchange=US&token=${finnhubKey}`;

        let resp = await fetch(url);
        return await resp.json();
    } catch (error) {
        console.log("Fehler beim Abrufen der Daten:", error);
    }
}

export async function getStockNews(symbol)
{
    let beginning = new Date();
    beginning.setDate(beginning.getDate() - 1);

    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getDateString(beginning).toString()}&to=${getDateString(new Date())}&token=${finnhubKey}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        return null;
    }
}

export async function getMarketNews()
{
    try {
        const url = `https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`;

        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}