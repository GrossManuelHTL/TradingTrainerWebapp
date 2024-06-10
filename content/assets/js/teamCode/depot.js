import {getStockName, getUser, sellStock} from "./ServerClient/serverClient.mjs";
import { getQuote } from "./API/apidata.mjs";

async function handleButtonClick(id, amount){
    let user = await getUser(JSON.parse(localStorage.getItem('currentUser')).email);
    let stock = user.stocks[id];
    await sellStock(stock, amount);
    await delay(500);
    let table = document.getElementById("depotTable");
    deleteAllRows(table)
    buildTable();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function umleiten(symbol) {
    const basisUrl = "../content/stockInfo.html?symbol=";
    window.location.href = `${basisUrl}` + symbol;
}

function deleteAllRows(table) {
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
}

window.umleiten = umleiten;
window.handleButtonClick = handleButtonClick;

async function buildTable() {
    let user = await getUser(JSON.parse(localStorage.getItem('currentUser')).email);
    let table = document.getElementById("depotTable");
    let firstRow = table.insertRow(0);
    firstRow.innerHTML= `
        <tr class="heading-td">
            <td class="mv-icon">Symbol</td>
            <td class="coin-name">Amount</td>
            <td class="buy">Purchase Value</td>
            <td class="sell">Actual Value</td>
            <td class="trends">Impact</td>
            <td class="attachments">Win/Lose</td>
            <td class="stats-chart"></td>
        </tr>
    `

    let money = document.getElementById("wert");
    money.innerText = "Money: " + user.money.toFixed(2) + " USD";

    let i = 0;
    for (let stock of user.stocks) {
        let symbol = stock.symbol;
        let val = stock.currentPrice;

        let quote = await getQuote(symbol);
        let actualValue = quote.currentPrice;

        let imagePath = "../content/assets/images/icon/market-value/trends-down-icon.png";
        if (val <= actualValue) {
            imagePath = "../content/assets/images/icon/market-value/trends-up-icon.png";
        }
        let winLose = (actualValue - val) * stock.amount;

        let newRow = table.insertRow(-1);

        newRow.innerHTML = `
            <td onclick="umleiten('${symbol}')">${await getStockName(symbol)}</td> 
            <td>${stock.amount}</td>
            <td>${val.toFixed(2)}</td>
            <td>${actualValue.toFixed(2)}</td>
            <td style="padding-left: 3%"><img src="${imagePath}" alt="Impact"></td>
            <td>${winLose.toFixed(2)}</td>
            <td>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target='#${i}'>Sell</button>
                <div class="modal fade" id='${i}' tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Sell ${symbol}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="numberForm">
                                    <div class="form-group">
                                        <label for="numberInput">How much do you want to sell?</label>
                                        <input type="number" class="form-control" id="numberInput" required>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary"  onclick="handleButtonClick(${i}, document.getElementById('numberInput').value)" data-dismiss="modal">Sell</button>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
        `;
        i++;
    }
}

await buildTable();
