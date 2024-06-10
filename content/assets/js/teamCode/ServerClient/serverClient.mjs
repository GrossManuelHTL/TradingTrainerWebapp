import {User} from "../model.mjs";

const userUrl = 'http://localhost:3000/users';
const stockUrl = 'http://localhost:3000/stocks';

export function updateUser(user) {
    fetch(`${userUrl}/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(data => localStorage.setItem('currentUser', JSON.stringify(user)))
        .catch(error => console.error('Error:', error));
}

export async function getUser(email)
{
    try {
        let resp = await fetch(`${userUrl}?email=${email}`);
        let js = await resp.json();
        let data = js[0];
        return new User(data.id, data.name, data.email, data.password, data.money, data.stocks);
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getStockName(symbol)
{
    try {
        let resp = await fetch(`${stockUrl}?symbol=${symbol}`)
        let data = await resp.json();

        if(!data) {
            return null;
        }

        return data[0].name;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function getStockSym(name)
{
    console.log(name);
    try {
        let resp = await fetch(`${stockUrl}?name=${encodeURIComponent(name)}`);
        let data = await resp.json();

        if(!data) {
            return null;
        }

        return data[0].symbol;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function buyStock(stock)
{
    let us = await getUser(JSON.parse(localStorage.getItem('currentUser')).email);
    us.addStock(stock);
    us.money -= stock.currentPrice * stock.amount;

    updateUser(us);
}

export async function sellStock(stock, amount)
{
    let user = await getUser(JSON.parse(localStorage.getItem('currentUser')).email);
    await user.removeStock(stock, amount);

    updateUser(user);
}

export async function fetchStock(query = '') {
    try {
        let resp = await fetch(`${stockUrl}`);
        let data = await resp.json();
        let stock = data.filter(stock => stock.name.toLowerCase().startsWith(query.toLowerCase()));
        if (stock) {
            return stock[0].name;
        }
        return null;
    } catch (error) {
        console.error('Error:', error);
    }
}