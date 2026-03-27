const { app, BrowserWindow, ipcMain, dialog, protocol, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const WebTorrent = require('webtorrent');
const http = require('http');

// Single instance lock - prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // Handle second instance (when user opens another file while app is running)
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
      
      // Check if a file was passed
      const filePath = commandLine[commandLine.length - 1];
      if (filePath && filePath.endsWith('.torrent') && fs.existsSync(filePath)) {
        console.log('📂 Second instance: opening torrent file:', filePath);
        setTimeout(() => handleTorrentFile(filePath), 500);
      } else if (filePath && filePath.startsWith('magnet:')) {
        console.log('🧲 Second instance: opening magnet link');
        setTimeout(() => handleMagnetLink(filePath), 500);
      }
    }
  });
}

let mainWindow;
let tray = null;
let streamServer;
const configPath = path.join(app.getPath('userData'), 'config.json');

// WebTorrent client в main process (работает как обычный торрент-клиент)
const client = new WebTorrent();

console.log('🌌 WebTorrent client initialized in main process');
console.log('This client uses TCP/UDP like qBittorrent!');

// Create HTTP server for streaming
function createStreamServer() {
  streamServer = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    const infoHash = url.searchParams.get('infoHash');
    const fileIndex = parseInt(url.searchParams.get('fileIndex'));
    
    console.log('🎬 Stream request:', { infoHash: infoHash?.substring(0, 10), fileIndex });
    
    const torrent = client.get(infoHash);
    if (!torrent || !torrent.files[fileIndex]) {
      console.error('❌ File not found');
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    const file = torrent.files[fileIndex];
    console.log('📹 Streaming:', file.name, formatBytes(file.length));
    
    // Detect content type
    const ext = file.name.split('.').pop().toLowerCase();
    const contentTypes = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'mkv': 'video/x-matroska',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime'
    };
    const contentType = contentTypes[ext] || 'video/mp4';
    
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
      const chunksize = (end - start) + 1;
      
      console.log(`📦 Range request: ${start}-${end}/${file.length}`);
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${file.length}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      
      const stream = file.createReadStream({ start, end });
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        res.end();
      });
      stream.pipe(res);
    } else {
      console.log('📦 Full file request');
      res.writeHead(200, {
        'Content-Length': file.length,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      });
      const stream = file.createReadStream();
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        res.end();
      });
      stream.pipe(res);
    }
  });
  
  streamServer.listen(8888, () => {
    console.log('🎬 Stream server running on http://localhost:8888');
  });
}

function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (e) {
    console.error('Config load error:', e);
  }
  return {
    downloadPath: app.getPath('downloads'),
    downloadLimit: 0,
    uploadLimit: 0,
    theme: 'amoled',
    language: 'ru'
  };
}

function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (e) {
    console.error('Config save error:', e);
  }
}

function createWindow() {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  const windowOptions = {
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    frame: false,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  };
  
  // Add icon only if it exists
  if (fs.existsSync(iconPath)) {
    windowOptions.icon = iconPath;
  }
  
  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
  
  // Hide to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  
  // Start sending torrent updates
  startTorrentUpdates();
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  let trayIcon;
  
  if (fs.existsSync(iconPath)) {
    trayIcon = nativeImage.createFromPath(iconPath);
  } else {
    // Create a simple tray icon if file doesn't exist
    trayIcon = nativeImage.createEmpty();
  }
  
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Показать NebulaTorrent',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Скрыть в трей',
      click: () => {
        mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: 'Выход',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('NebulaTorrent');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  // Set as default handler for .torrent files
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('magnet', process.execPath, [path.resolve(process.argv[1])]);
    }
  } else {
    app.setAsDefaultProtocolClient('magnet');
  }
  
  // Register file association for .torrent files
  if (process.platform === 'win32') {
    app.setAsDefaultProtocolClient('nebula-torrent');
  }
  
  createWindow();
  createTray();
  createStreamServer();
  
  // Handle .torrent file opened with app (macOS)
  app.on('open-file', (event, filePath) => {
    event.preventDefault();
    if (filePath.endsWith('.torrent')) {
      handleTorrentFile(filePath);
    }
  });
  
  // Handle magnet links
  app.on('open-url', (event, url) => {
    event.preventDefault();
    if (url.startsWith('magnet:')) {
      handleMagnetLink(url);
    }
  });
  
  // Check if app was opened with a file (Windows)
  if (process.platform === 'win32' && process.argv.length >= 2) {
    const filePath = process.argv[process.argv.length - 1];
    if (filePath.endsWith('.torrent') && fs.existsSync(filePath)) {
      setTimeout(() => handleTorrentFile(filePath), 1000);
    } else if (filePath.startsWith('magnet:')) {
      setTimeout(() => handleMagnetLink(filePath), 1000);
    }
  }
});

app.on('window-all-closed', () => {
  // Don't quit on window close, keep running in tray
  if (process.platform !== 'darwin' && !app.isQuitting) {
    // Keep app running
  } else if (app.isQuitting) {
    client.destroy();
    if (streamServer) {
      streamServer.close();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Send torrent updates to renderer
function startTorrentUpdates() {
  setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const torrentsData = client.torrents.map(t => ({
        infoHash: t.infoHash,
        name: t.name || 'Loading metadata...',
        progress: t.progress || 0,
        downloadSpeed: t.downloadSpeed || 0,
        uploadSpeed: t.uploadSpeed || 0,
        downloaded: t.downloaded || 0,
        uploaded: t.uploaded || 0,
        length: t.length || 0,
        timeRemaining: t.timeRemaining || Infinity,
        numPeers: t.numPeers || 0,
        paused: t.paused || false,
        done: t.done || false,
        files: (t.files || []).map(f => ({
          name: f.name,
          length: f.length,
          downloaded: f.downloaded,
          progress: f.progress || 0
        }))
      }));
      
      mainWindow.webContents.send('torrent:update', torrentsData);
    }
  }, 1000);
}

// IPC Handlers - Window
ipcMain.handle('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow.close();
});

// IPC Handlers - Dialog
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Torrent Files', extensions: ['torrent'] }]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const buffer = fs.readFileSync(result.filePaths[0]);
    return Array.from(buffer);
  }
  return null;
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// IPC Handlers - Config
ipcMain.handle('config:load', () => {
  return loadConfig();
});

ipcMain.handle('config:save', (event, config) => {
  saveConfig(config);
  return true;
});

ipcMain.handle('notification:show', (event, { title, body }) => {
  const { Notification } = require('electron');
  new Notification({ title, body }).show();
});

// IPC Handlers - Torrent Operations
ipcMain.handle('torrent:add', async (event, data) => {
  try {
    const config = loadConfig();
    const opts = {
      path: config.downloadPath || app.getPath('downloads')
    };
    
    console.log('📥 Adding torrent in main process...');
    
    return new Promise((resolve, reject) => {
      let torrentInput;
      
      if (data.type === 'magnet') {
        torrentInput = data.magnetUri;
        console.log('🧲 Magnet link:', torrentInput.substring(0, 50) + '...');
      } else if (data.type === 'file') {
        torrentInput = Buffer.from(data.fileData);
        console.log('📁 Torrent file, size:', torrentInput.length);
      }
      
      client.add(torrentInput, opts, (torrent) => {
        console.log('✅ Torrent added:', torrent.name || 'Loading...');
        console.log('InfoHash:', torrent.infoHash);
        
        // Setup event listeners
        torrent.on('metadata', () => {
          console.log('📦 Metadata received:', torrent.name);
          console.log('Files:', torrent.files.length);
          torrent.files.forEach((file, i) => {
            console.log(`  ${i + 1}. ${file.name} (${formatBytes(file.length)})`);
          });
          mainWindow.webContents.send('torrent:added', {
            infoHash: torrent.infoHash,
            name: torrent.name
          });
        });
        
        torrent.on('ready', () => {
          console.log('🚀 Torrent ready');
          console.log('Pieces:', torrent.pieces.length);
        });
        
        torrent.on('wire', (wire) => {
          console.log('🔗 Connected to peer:', wire.remoteAddress);
        });
        
        let lastLog = Date.now();
        torrent.on('download', () => {
          if (Date.now() - lastLog > 5000) {
            console.log(`⬇️ ${torrent.name}: ${(torrent.progress * 100).toFixed(1)}% | ${formatSpeed(torrent.downloadSpeed)} | Peers: ${torrent.numPeers}`);
            lastLog = Date.now();
          }
        });
        
        torrent.on('done', () => {
          console.log('✅ Download complete:', torrent.name);
          const { Notification } = require('electron');
          new Notification({
            title: '✅ Download Complete',
            body: torrent.name
          }).show();
        });
        
        torrent.on('error', (err) => {
          console.error('❌ Torrent error:', err);
          mainWindow.webContents.send('torrent:error', {
            infoHash: torrent.infoHash,
            error: err.message
          });
        });
        
        torrent.on('warning', (err) => {
          console.warn('⚠️ Warning:', err.message);
        });
        
        resolve({
          success: true,
          infoHash: torrent.infoHash,
          name: torrent.name || 'Loading metadata...'
        });
      });
    });
  } catch (error) {
    console.error('❌ Error adding torrent:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('torrent:remove', (event, infoHash, deleteFiles) => {
  const torrent = client.get(infoHash);
  if (torrent) {
    const torrentPath = torrent.path;
    const torrentName = torrent.name;
    
    torrent.destroy({ destroyStore: deleteFiles }, () => {
      if (deleteFiles && torrentPath) {
        // Delete the entire torrent folder
        const fullPath = path.join(torrentPath, torrentName);
        try {
          if (fs.existsSync(fullPath)) {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log('🗑️ Deleted folder:', fullPath);
          }
        } catch (err) {
          console.error('Error deleting folder:', err);
        }
      }
    });
    
    console.log('🗑️ Torrent removed:', torrentName);
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('torrent:pause', (event, infoHash) => {
  const torrent = client.get(infoHash);
  if (torrent) {
    torrent.pause();
    console.log('⏸️ Torrent paused:', torrent.name);
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('torrent:resume', (event, infoHash) => {
  const torrent = client.get(infoHash);
  if (torrent) {
    torrent.resume();
    console.log('▶️ Torrent resumed:', torrent.name);
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('torrent:getAll', () => {
  return client.torrents.map(t => ({
    infoHash: t.infoHash,
    name: t.name || 'Loading...',
    progress: t.progress || 0
  }));
});

ipcMain.handle('torrent:getStreamUrl', (event, infoHash, fileIndex) => {
  const torrent = client.get(infoHash);
  if (torrent && torrent.files[fileIndex]) {
    return `http://localhost:8888?infoHash=${infoHash}&fileIndex=${fileIndex}`;
  }
  return null;
});

ipcMain.handle('torrent:openFolder', (event, infoHash) => {
  const torrent = client.get(infoHash);
  if (torrent && torrent.path) {
    // Open the specific torrent folder, not just downloads folder
    const fullPath = path.join(torrent.path, torrent.name);
    shell.openPath(fullPath);
    console.log('📂 Opening folder:', fullPath);
    return { success: true };
  }
  return { success: false };
});

// Utility
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatSpeed(bytesPerSecond) {
  return formatBytes(bytesPerSecond) + '/s';
}

// Handle .torrent file opened with app
function handleTorrentFile(filePath) {
  console.log('📂 Opening .torrent file:', filePath);
  
  if (mainWindow) {
    mainWindow.show();
    
    const buffer = fs.readFileSync(filePath);
    const fileData = Array.from(buffer);
    
    mainWindow.webContents.send('torrent:file-opened', { fileData });
  }
}

// Handle magnet link
function handleMagnetLink(magnetUri) {
  console.log('🧲 Opening magnet link');
  
  if (mainWindow) {
    mainWindow.show();
    mainWindow.webContents.send('torrent:magnet-opened', { magnetUri });
  }
}
