
const tableBody = document.getElementById('stock-table-body');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
searchButton.addEventListener('click', function () {
    const query = searchInput.value.toLowerCase();
    fetchStocks(query);
});



function fetchStocks(query = '') {
    fetch('http://localhost:3000/stocks')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = '';
            data
                .filter(stock => stock.name.toLowerCase().startsWith(query))
                .forEach(stock => {
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.textContent = stock.name;
                cell.setAttribute('data-symbol', stock.symbol);
                cell.addEventListener('click', function () {
                    const symbol = this.getAttribute('data-symbol');
                    window.location.href = "../content/stockInfo.html?symbol=" + symbol;
                });
                row.appendChild(cell);
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

fetchStocks();
