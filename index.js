
const getData = () => {
    const token = document.getElementById('token').value
    const api = document.getElementById('api').value
    fetch(api, { method: "GET", headers: { apiToken: token } }).then(resp => console.log(resp.json().then(data => {
        renderTable(data)
    })))
}


const createTableFromArrayOfArray = (arrayOfObj, sliceUntil, tableClassName,isObject,extraRow) => {
    console.log("🚀 ~ file: index.js:9 ~ createTableFromArrayOfArray ~ arrayOfObj:", arrayOfObj)
    const table = document.createElement('table')
    table.className = tableClassName
    arrayOfObj.forEach((row,rowNumber) => {
        table.appendChild(createRow(row, sliceUntil, rowNumber,isObject))
    });
    document.querySelector('.app')?.appendChild(table)
    console.log(table)
}

const createRow = (rowData,sliceUntil,rowNumber,isObject,extraRow) => {
    const dataWithoutHistory = isObject? rowData : rowData.slice(0, sliceUntil)
    const row = document.createElement("tr")
    let iterateOver = isObject ? Object.values(dataWithoutHistory) : dataWithoutHistory
    if (extraRow) {
        iterateOver = [extraRow,(isObject?Object.values(dataWithoutHistory) : dataWithoutHistory)]
    }
    iterateOver.forEach((data) => {
        const col = document.createElement("td")
        col.innerText = data || "-"
        row.appendChild(col)
    });
    const button = document.createElement('button')
    button.innerText = "Check history"
    button.onclick = () => {
            const mainTable = document.getElementsByClassName('main-table')[0];
        mainTable.style.display = "none";
        const extraRow = Object.keys(rowData[19][0]|| null)
        console.log("🚀 ~ file: index.js:40 ~ createRow ~ extraRow:", extraRow)
        createTableFromArrayOfArray(rowData[19], null, 'history-table', true, extraRow);
        }
        row.appendChild(button)
        return row
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

