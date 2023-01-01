const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    runJlink: (config:any) => ipcRenderer.send('run-jlink', config)
})

// contextBridge.exposeInMainWorld('electronAPI',{
//     openFile: () => ipcRenderer.invoke('dialog:openFile')
// })

// contextBridge.exposeInMainWorld('electronAPI2', {
//     handleCounter: (callback:any) => ipcRenderer.on('update-counter', callback)
// })
