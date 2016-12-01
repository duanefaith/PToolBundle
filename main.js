const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const url = require('url');
const path = require('path');

const PluginReader = require('./Classes/PluginReader.js');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({width: 1280, height: 800});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null
  });
}

function appReady() {
  createMainWindow();
}

app.on('ready', appReady);

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

ipcMain.on('plugins_reload', (event) => {
  PluginReader.reload((plugins) => {
    event.sender.send('plugins_reload_success', plugins);
  });
});

ipcMain.on('plugin_load_specific', (event, name) => {
  PluginReader.loadPlugin(name, (plugin) => {
    event.sender.send('plugin_load_specific_success', name, plugin);
  });
});
