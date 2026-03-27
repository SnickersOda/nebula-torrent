const { contextBridge, ipcRenderer } = require('electron');

// Expose Electron API
contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  loadConfig: () => ipcRenderer.invoke('config:load'),
  saveConfig: (config) => ipcRenderer.invoke('config:save', config),
  showNotification: (data) => ipcRenderer.invoke('notification:show', data),
  
  // Torrent operations via main process
  addTorrent: (data) => ipcRenderer.invoke('torrent:add', data),
  removeTorrent: (infoHash, deleteFiles) => ipcRenderer.invoke('torrent:remove', infoHash, deleteFiles),
  pauseTorrent: (infoHash) => ipcRenderer.invoke('torrent:pause', infoHash),
  resumeTorrent: (infoHash) => ipcRenderer.invoke('torrent:resume', infoHash),
  getTorrents: () => ipcRenderer.invoke('torrent:getAll'),
  getStreamUrl: (infoHash, fileIndex) => ipcRenderer.invoke('torrent:getStreamUrl', infoHash, fileIndex),
  openFolder: (infoHash) => ipcRenderer.invoke('torrent:openFolder', infoHash),
  
  // Listen to torrent updates
  onTorrentUpdate: (callback) => ipcRenderer.on('torrent:update', (event, data) => callback(data)),
  onTorrentAdded: (callback) => ipcRenderer.on('torrent:added', (event, data) => callback(data)),
  onTorrentError: (callback) => ipcRenderer.on('torrent:error', (event, data) => callback(data)),
  onTorrentFileOpened: (callback) => ipcRenderer.on('torrent:file-opened', (event, data) => callback(data)),
  onTorrentMagnetOpened: (callback) => ipcRenderer.on('torrent:magnet-opened', (event, data) => callback(data))
});
