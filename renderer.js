const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

ipcRenderer.send('plugins_reload');
