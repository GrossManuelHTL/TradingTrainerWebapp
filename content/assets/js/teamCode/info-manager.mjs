import {getQuote, getStockNews} from "./API/apidata.mjs";
import {buyStock, getUser, getStockName} from "./ServerClient/serverClient.mjs";

let symbol = window.location.search.split("=")[1];

export async function buildInfo() {
    let name = await getStockName(symbol);
    document.getElementById("stock-symbol").textContent = name;

    const news = await getStockNews(symbol);
    let newsContainer = document.getElementById("news");
    news.forEach((newsItem) => {
        let newsElement = document.createElement("div");
        newsElement.classList.add("col-12", "mb-4");
        newsElement.innerHTML = `
            <div class="card h-100" style = "width: 100%; display: flex; justify-content: center; align-content: center">
                <img src="${newsItem.image}" class="card-img-top" alt="${newsItem.headline}">
                <div class="card-body">
                    <h5 class="card-title">${newsItem.headline}</h5>
                    <p class="card-text">${newsItem.summary}</p>
                    <a href="${newsItem.url}" target="_blank" class="btn btn-primary">Read More</a>
                </div>
            </div>`;
        newsContainer.appendChild(newsElement);
    });
}

buildInfo();

let info = await getQuote(symbol);
let user = await getUser(JSON.parse(localStorage.getItem("currentUser")).email);

document.getElementById("quote").innerText = info.currentPrice;

document.getElementById('numberForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    info.amount = document.getElementById('stockInput').value;

    if(user.money - parseInt(info.amount) * info.currentPrice < 0) {
        alert("You do not have enough money");
        return false;
    }
    if (info.amount <= 0){
        alert("You do not have enough amount");
        return false;
    }
    await buyStock(info).then(() => alert("Stock bought!"));
});


let button = document.getElementById("comparer");
button.addEventListener("click", async () => {
    window.location.href = "../content/comparer.html?symbol=" + symbol;

});
