import { app, BrowserWindow, ipcMain,dialog,Menu } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

const exec = require('child_process').exec;

function execute(command: string, callback: { (output: any): void; (arg0: any): void; }) {
  exec(command, (error: any, stdout: any, stderr: any) => {
    callback(stdout);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.on('run-jlink', (event, config) => {
    if ((!config.hasOwnProperty('jlinkexe'))||(config.jlinkexe.length<1)){
      return;
    }
    const tmp = require('tmp');
    const webContents = event.sender
    const window = BrowserWindow.fromWebContents(webContents);
    const tmpobj = tmp.fileSync();
    console.log('File: ', tmpobj.name);
    console.log('Filedescriptor: ', tmpobj.fd);
    const fs = require('fs');

    let content = '';
    if (config.hasOwnProperty('bootloader_bin')&&config.bootloader_bin.length>1){
      content = content + 'loadfile ' + config.bootloader_bin + '\n';
    }
    if (config.hasOwnProperty('sector_table_bin')&&config.sector_table_bin.length>1){
      content = content + 'loadfile ' + config.sector_table_bin + '\n';
    }
    if (config.hasOwnProperty('app_bin')&&config.app_bin.length>1){
      content = content + 'loadfile ' + config.app_bin + '\n';
    }
    content = content + 'exit\n';

    try {
      fs.writeFileSync(tmpobj.name, content);
      // file written successfully
    } catch (err) {
      console.error(err);
    }

    // @ts-ignore
    // window.setTitle(title)
    execute(config.jlinkexe+' -device AT32F403AVGT7 -if SWD -speed 4000 -autoconnect 1 -CommanderScript '+tmpobj.name, (output) => {
      console.log(output);
    });
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'Decrement',
        }
      ]
    }

  ])

  Menu.setApplicationMenu(menu)


  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL('http://localhost:3000/index.html');

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === "win32" ? ".cmd" : "")),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }
}


async function handleFileOpen() {
  // @ts-ignore
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
  ipcMain.handle('dialog:openFile', handleFileOpen);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
