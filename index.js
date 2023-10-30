const getData = () => {
    const app = document.getElementsByClassName('app')[0]
    console.log("🚀 ~ file: index.js:4 ~ getData ~ document.getElementsByClassName('tableClassName')[0]:",  document.querySelector('table'))
    document.querySelector('table') && app.removeChild( document.querySelector('table'))
    const token = document.getElementById('token').value 
    localStorage.setItem('token', token)
    const api = document.getElementById('api').value
    localStorage.setItem('api', api)
    fetch(api, { method: "GET", headers: { apiToken: token } }).then(resp => console.log(resp.json().then(data => {
        renderTable(data)
    })))
}


function renderTable(data) {
    const appElement = document.querySelector('.app');

    const table = document.createElement('table');

    const headerRow = table.insertRow();
    data[0].forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = index; 
        headerRow.appendChild(th);
    });

    data.forEach((row) => {
        const tableRow = table.insertRow();

        row.forEach((cell, index) => {
            const td = document.createElement('td');

            if (cell === null) {
                td.textContent = '- ';
            } else if ((index === 19 || index === 20) && Array.isArray(cell) && cell.length > 0) {
                // Create a button to show the detailed content in a separate table
                const button = document.createElement('button');
                button.textContent = 'Show Details';
                button.addEventListener('click', () => showDetails(cell));
                td.appendChild(button);
            } else {
                td.textContent = cell;
            }

            tableRow.appendChild(td);
        });

    });



    appElement.appendChild(table);
}

function showDetails(data) {
    const detailsTable = document.createElement('table');

    const headerRow = detailsTable.insertRow();
    Object.keys(data[0]).forEach((key) => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    data.forEach((item) => {
        const tableRow = detailsTable.insertRow();
        Object.values(item).forEach((value) => {
            const td = document.createElement('td');
            td.textContent = value;
            tableRow.appendChild(td);
        });
    });

    const detailsWindow = window.open('', '_blank', 'width=600,height=400');
    detailsWindow.document.body.appendChild(detailsTable);
}

