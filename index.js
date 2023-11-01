

const ROWS_PER_PAGE = 8;
let CURRENT_PAGE = 0
let DATA_LENGET = 0
let TOTAL_PAGE = 0
let TOTAL_PLAY_TIME = 0
let TOTAL_BUFFERING_TIME = 0

let storedData = null
function getData() {
    const app = document.getElementsByClassName('app')[0]
    document.querySelector('table') && app.removeChild( document.querySelector('table'))
    const token = document.getElementById('token').value 
    localStorage.setItem('token', token)
    // const api = document.getElementById('api').value
    const api = "https://live-stats.clipstat.com/api/cms/qos-dump/stats-dump"
    localStorage.setItem('api', api)
    disableButton(true,'Fetching...')
    fetch(api, { method: "GET", headers: { apiToken: token } }).then(resp => {
        resp.json().then(data => {
            TOTAL_PAGE = Math.ceil(data.length / ROWS_PER_PAGE)
            if (TOTAL_PAGE > 1) {
                showPagination(true)
            } else {
                showPagination(false)
            }
            storedData = data
            disableButton(false,'Fetch Data')
        // renderTable(data)
            paginateTable()
            renderGraph()
    })
}).catch(() => {
    disableButton(false)
    // disableButton(false, 'Fetch Data')    
    })
}

const showPagination = (shouldShow) => {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.style.display = !shouldShow ? "none": "block"
}

//datalength = 45
const paginateTable = (pageNumber = 0) => {
    if (CURRENT_PAGE + pageNumber < TOTAL_PAGE && CURRENT_PAGE + pageNumber >= 0) { 
        CURRENT_PAGE = CURRENT_PAGE + pageNumber
        const app = document.getElementsByClassName('app')[0]
        document.querySelector('table') && app.removeChild( document.querySelector('table'))
        if (storedData) {
            
            
            const slicedData = storedData.slice((ROWS_PER_PAGE*(CURRENT_PAGE)) , Math.min((ROWS_PER_PAGE*CURRENT_PAGE)+ROWS_PER_PAGE,storedData.length))
            renderTable(slicedData)
        }
        const pageSpan = document.getElementsByClassName('page-number')[0]
        pageSpan.innerText = `Showing ${CURRENT_PAGE+1} of ${TOTAL_PAGE}`
    }
}

const nextPage = ()=>paginateTable( 1)
const prevPage = ()=>paginateTable(-1)

const disableButton = (isDisabled,text) => {
    const button = document.getElementById('fetch-button')
    isDisabled ? button?.setAttribute('disabled', 'disabled') : button?.removeAttribute('disabled');
    button.innerText = text || 'FETCH DATA';
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
        let parsedCell = null;
        row.forEach((cell, index) => {
            try {
                parsedCell = JSON.parse(cell)
            } catch (error) {
                parsedCell = cell
            }
            const td = document.createElement('td');

            if (cell === null) {
                td.textContent = '- ';
            } else if ( Array.isArray(parsedCell) && parsedCell.length > 0) {
                // Create a button to show the detailed content in a separate table
                const button = document.createElement('button');
                button.textContent = 'Show Details';
                button.addEventListener('click', () => showDetails(parsedCell));
                td.appendChild(button);
            } else {
                td.textContent = parsedCell;
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


const renderGraph = () => {
    if (storedData ) {
        const playTimeIndex= storedData[0].indexOf("playTime")
        const bufferTimeIndex = storedData[0].indexOf("bufferingTime")
        storedData.forEach(row => {
            TOTAL_PLAY_TIME = !isNaN(row[playTimeIndex]) ? TOTAL_PLAY_TIME+row[playTimeIndex] : TOTAL_PLAY_TIME
            TOTAL_BUFFERING_TIME = !isNaN(row[bufferTimeIndex]) ? TOTAL_BUFFERING_TIME + row[bufferTimeIndex] : TOTAL_BUFFERING_TIME;
        });
        const playTimeBarWidth = Math.floor(TOTAL_PLAY_TIME/(TOTAL_PLAY_TIME+TOTAL_BUFFERING_TIME)*100);
        const bufferTimeWidth = Math.floor(TOTAL_BUFFERING_TIME / (TOTAL_PLAY_TIME + TOTAL_BUFFERING_TIME) * 100);
        const otherTimeWidth = 100-playTimeBarWidth - bufferTimeWidth;

        document.getElementsByClassName('playtime-bar')[0].style.width = `${playTimeBarWidth}%`;
        document.getElementsByClassName('buffertime-bar')[0].style.width = `${bufferTimeWidth}%`;
        document.getElementsByClassName('other-bar')[0].style.width =`${otherTimeWidth}%`;
        document.getElementById('play-time-numbers').innerText = `${playTimeBarWidth}%`
        document.getElementById('buffer-time-numbers').innerText = `${bufferTimeWidth}%`
        document.getElementById('other-time-numbers').innerText = `${otherTimeWidth}%`
        // document.getElementById('play-time-numbers')?.innerText= `${(TOTAL_PLAY_TIME/(TOTAL_PLAY_TIME+TOTAL_BUFFERING_TIME)*100)}% ${Math.floor(TOTAL_PLAY_TIME)}`
        // document.getElementById('play-time-numbers')?.innerText= `${(TOTAL_BUFFERING_TIME/(TOTAL_PLAY_TIME+TOTAL_BUFFERING_TIME)*100)}% ${Math.floor(TOTAL_BUFFERING_TIME)}`
    }
}
