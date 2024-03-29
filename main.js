import { app, BrowserWindow } from 'electron';
import fetchChromeHistory from './history.js';

// Function to create the main window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        // fullscreen: true,
        webPreferences: {
            // devTools: false
        },
        icon: 'game-icon.ico',
    });
    
    win.loadFile('index.html');
};

app.on('ready', () => {
    fetchChromeHistory();
    createWindow();
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
