import {getQuote} from "./API/apidata.mjs";

export function getDateString(date)
{
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export class Stock
{
    constructor(symbol, currentPrice, timestamp, amount = 0)
    {
        this.symbol = symbol;
        this.currentPrice = currentPrice;
        this.time = timestamp;
        this.amount = amount;
    }
}

export class User
{
    constructor(id, name, email, password, money, stocks) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.money = money;
        this.stocks = stocks;
    }

    addStock(stock)
    {
        if(!this.stocks) {
            this.stocks = [];
        }
        if(stock) {
            this.stocks.push(stock);
            return true;
        }
        return false;
    }

    async removeStock(stock, amount)
    {
        if (amount < 0) amount = amount * -1;
        let currentPrice = await getQuote(stock.symbol);

        let idx = this.stocks.findIndex(s =>
            s.symbol === stock.symbol ||
            s.currentPrice === stock.currentPrice ||
            s.time === stock.time ||
            s.amount === stock.amount
        );

        if(this.stocks[idx].amount - amount > 0) {
            this.stocks[idx].amount -= amount;
            this.money += currentPrice.currentPrice * amount;
        } else {
            this.money += currentPrice.currentPrice * this.stocks[idx].amount;
            this.stocks = this.stocks.filter(s => s.symbol !== stock.symbol || s.currentPrice !== stock.currentPrice
                || s.time !== stock.time || s.amount !== stock.amount);
        }
    }
}