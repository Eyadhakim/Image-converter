const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    convertAndSaveImages: (images, format) => ipcRenderer.invoke('convert-and-save-images', images, format)
});
