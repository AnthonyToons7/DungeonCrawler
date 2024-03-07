const { app, BrowserWindow } = require('electron');
const fetchChromeHistory = require('./history.js');


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
