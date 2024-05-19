const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

// Create an Express server
const server = express();
const PORT = 3000;

// Serve static files from the directory
server.use(express.static(path.join(__dirname)));

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to create a new BrowserWindow
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the index.html from the local server
  mainWindow.loadURL(`http://localhost:${PORT}/index.html`);
}

// Electron app lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});


const { ipcMain } = require('electron');

ipcMain.on('minimize', (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.minimize();
});

ipcMain.on('maximize', (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

ipcMain.on('close', (event) => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.close();
});
