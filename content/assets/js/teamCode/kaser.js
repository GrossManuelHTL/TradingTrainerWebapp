import {getHoliday, getMarketNews, getMarketStatus} from "./API/apidata.mjs";

let status = await getMarketStatus();
let hoday = "no Holiday";
if (status.holiday !== null) {
    hoday = status.holiday;
}

let sesssion = status.session;
if (status.session === null){
    sesssion = `no Market`
}

let open = "Open";
if (status.isOpen === false) {
    open = "Closed";
}
let table = document.getElementById("marketStats");
try
{
    table.innerHTML = `
    <td>US Market</td>
    <td>${hoday}</td>
    <td>${open}</td>
    <td>${sesssion}</td>
    <td>Amerika, New-York</td>
`
}catch (err)
{
    console.log('is ned wichtig');
}

async function info() {
    const news = await getMarketNews();
    let newsContainer = document.getElementById("marketNews");
    news.forEach((newsItem) => {
        let newsElement = document.createElement("div");
        newsElement.classList.add("col-12", "mb-4");
        newsElement.innerHTML = `
            <div class="card h-100" style = "width: 100%; height: 70vh">
                <div class="card-body">
                    <h5 class="card-title">${newsItem.headline}</h5>
                    <p class="card-text">${newsItem.summary}</p>
                    <a href="${newsItem.url}" target="_blank" class="btn btn-primary">Read More</a>
                </div>
            </div>`;
        newsContainer.appendChild(newsElement);
    });
}
info();