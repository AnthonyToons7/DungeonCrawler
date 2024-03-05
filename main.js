const { app, BrowserWindow } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


// Function to create the main window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        fullscreen: false,
        webPreferences: {
            // devTools: false
        }
    });
    
    win.loadFile('index.html');
};


// Event handler for when Electron has finished initialization
app.whenReady().then(() => {
    // Create the main window
    createWindow();
    fetchChromeHistory();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// On macOS, re-create a window when the dock icon is clicked and there are no other windows open
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


const fs = require('fs');

const chromeUserDataDir = path.join(process.env.LOCALAPPDATA, 'Google/Chrome/User Data');
const profileNames = fs.readdirSync(chromeUserDataDir);

profileNames.forEach((profileName) => {
    const profileDir = `${chromeUserDataDir}/${profileName}`;
    if (!fs.existsSync(profileDir)) {
        console.error('Profile directory does not exist:', profileDir);
        return;
    }

    const chromeHistoryFile = `${profileDir}/History`;
    if (!fs.existsSync(chromeHistoryFile)) {
        console.error('History file does not exist:', chromeHistoryFile);
        return;
    }

    console.log('Fetching history from profile:', profileName);
    // Fetch history from chromeHistoryFile
    setTimeout(()=>{
        fetchChromeHistory(chromeHistoryFile);
    }, 1000);
});

// Function to fetch browser history from Google Chrome and write it to a text file
function fetchChromeHistory(historyFile) {
    const chromeHistoryFile = historyFile;
    const db = new sqlite3.Database(chromeHistoryFile);

    const query = `
        SELECT datetime(last_visit_time / 1000000 - 11644473600, 'unixepoch') as time, url
        FROM urls
        ORDER BY last_visit_time DESC
        LIMIT 10;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching Chrome history:', err);
            return;
        }
        if(rows){
            const historyData = rows.map(row => ({ time: row.time, url: row.url }));
            // Write history data to text file
            writeHistoryToFile('./public/gameData/assets/history.json', historyData);
        }
    });

    db.close();
}
function writeHistoryToFile(filePath, data) {
    let fileName = filePath;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    setTimeout(() => {
        try {
            const jsonData = JSON.stringify(data, null, 2);

            fs.writeFile(fileName, jsonData, (err) => {
                if (err) {
                    console.error(`Error writing history to file '${fileName}':`, err);
                } else {
                    console.log(`History data written to file '${fileName}' successfully`);
                }
            });
        } catch (err) {
            console.error('Error converting data to JSON:', err);
        }
    }, 2000);
}


module.exports = writeHistoryToFile;