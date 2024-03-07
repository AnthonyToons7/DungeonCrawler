const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const chromeUserDataDir = path.join(process.env.LOCALAPPDATA, 'Google/Chrome/User Data');
const profileNames = fs.readdirSync(chromeUserDataDir);
const historyDirectories = [];
let nmbr = 0;

profileNames.forEach((profileName) => {
    const profileDir = `${chromeUserDataDir}/${profileName}`;
    if (!fs.existsSync(profileDir)) {
        return;
    }

    const chromeHistoryFile = `${profileDir}/History`;
    if (!fs.existsSync(chromeHistoryFile)) {
        return;
    }

    fetchChromeHistory(profileName, chromeHistoryFile);
});


function fetchChromeHistory(profileName, historyFile) {
    const db = new sqlite3.Database(historyFile);

    const query = `
        SELECT datetime(last_visit_time / 1000000 - 11644473600, 'unixepoch') as time, url
        FROM urls
        ORDER BY last_visit_time DESC;
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            db.close();
            return;
        }

        nmbr++;
        const historyDir = `./public/gameData/assets/${profileName}_history.json`;
        historyDirectories.push(historyDir);
        
        const historyData = rows.map(row => ({ time: row.time, url: row.url }));
        const fileName = `./public/gameData/assets/${profileName}_history.json`;

        writeHistoryToFile(fileName, historyData);
        
        db.close();

        // Check if the loop has finished, then write history directories to a JSON file
        if (historyDirectories.length === nmbr) {
            writeHistoryToFile('./public/gameData/assets/historyDirectories.json', historyDirectories);
        }
    });
}

function writeHistoryToFile(filePath, data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData);
    } catch (err) {
        // console.error(`Error writing history to file '${filePath}':`, err);
    }
}

module.exports = writeHistoryToFile;
