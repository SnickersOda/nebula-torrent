const { createElement: h, useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

// NO WebTorrent in renderer! Using main process instead (like qBittorrent architecture)

// Icons (SVG inline) - Minimalist Design
const Icons = {
  download: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    h('polyline', { points: '7 10 12 15 17 10' }),
    h('line', { x1: 12, y1: 15, x2: 12, y2: 3 })
  ),
  magnet: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M12 2L2 7l10 5 10-5-10-5z' }),
    h('path', { d: 'M2 17l10 5 10-5' }),
    h('path', { d: 'M2 12l10 5 10-5' })
  ),
  settings: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' }),
    h('circle', { cx: 12, cy: 12, r: 3 })
  ),
  play: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', { d: 'M8 5.14v13.72L19 12z' })
  ),
  pause: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'currentColor' },
    h('rect', { x: 6, y: 4, width: 4, height: 16, rx: 1 }),
    h('rect', { x: 14, y: 4, width: 4, height: 16, rx: 1 })
  ),
  trash: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('polyline', { points: '3 6 5 6 21 6' }),
    h('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }),
    h('line', { x1: 10, y1: 11, x2: 10, y2: 17 }),
    h('line', { x1: 14, y1: 11, x2: 14, y2: 17 })
  ),
  folder: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' })
  ),
  minimize: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' },
    h('line', { x1: 5, y1: 12, x2: 19, y2: 12 })
  ),
  maximize: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 })
  ),
  close: () => h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' },
    h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
    h('line', { x1: 6, y1: 6, x2: 18, y2: 18 })
  ),
  search: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('circle', { cx: 11, cy: 11, r: 8 }),
    h('line', { x1: 21, y1: 21, x2: 16.65, y2: 16.65 })
  ),
  video: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('polygon', { points: '23 7 16 12 23 17 23 7' }),
    h('rect', { x: 1, y: 5, width: 15, height: 14, rx: 2 })
  ),
  back: () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('line', { x1: 19, y1: 12, x2: 5, y2: 12 }),
    h('polyline', { points: '12 19 5 12 12 5' })
  ),
  check: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('polyline', { points: '20 6 9 17 4 12' })
  ),
  alert: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('line', { x1: 12, y1: 8, x2: 12, y2: 12 }),
    h('line', { x1: 12, y1: 16, x2: 12.01, y2: 16 })
  ),
  chart: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('line', { x1: 18, y1: 20, x2: 18, y2: 10 }),
    h('line', { x1: 12, y1: 20, x2: 12, y2: 4 }),
    h('line', { x1: 6, y1: 20, x2: 6, y2: 14 })
  ),
  palette: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('circle', { cx: 13.5, cy: 6.5, r: 0.5 }),
    h('circle', { cx: 17.5, cy: 10.5, r: 0.5 }),
    h('circle', { cx: 8.5, cy: 7.5, r: 0.5 }),
    h('circle', { cx: 6.5, cy: 12.5, r: 0.5 }),
    h('path', { d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z' })
  ),
  folderOpen: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' }),
    h('path', { d: 'M2 13h20' })
  ),
  downloadIcon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    h('polyline', { points: '7 10 12 15 17 10' }),
    h('line', { x1: 12, y1: 15, x2: 12, y2: 3 })
  ),
  uploadIcon: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    h('polyline', { points: '17 8 12 3 7 8' }),
    h('line', { x1: 12, y1: 3, x2: 12, y2: 15 })
  ),
  fire: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z' })
  ),
  checkCircle: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
    h('polyline', { points: '22 4 12 14.01 9 11.01' })
  ),
  pauseCircle: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('line', { x1: 10, y1: 15, x2: 10, y2: 9 }),
    h('line', { x1: 14, y1: 15, x2: 14, y2: 9 })
  ),
  globe: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('line', { x1: 2, y1: 12, x2: 22, y2: 12 }),
    h('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
  ),
  barChart: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('line', { x1: 12, y1: 20, x2: 12, y2: 10 }),
    h('line', { x1: 18, y1: 20, x2: 18, y2: 4 }),
    h('line', { x1: 6, y1: 20, x2: 6, y2: 16 })
  ),
  scale: () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M12 3v18' }),
    h('path', { d: 'M3 12h18' }),
    h('path', { d: 'M3 6h18' }),
    h('path', { d: 'M3 18h18' })
  ),
  nebula: () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('ellipse', { cx: 12, cy: 8, rx: 8, ry: 2, opacity: 0.3 }),
    h('ellipse', { cx: 12, cy: 10, rx: 6, ry: 1.5, opacity: 0.5 }),
    h('ellipse', { cx: 12, cy: 12, rx: 4, ry: 1, opacity: 0.7 }),
    h('ellipse', { cx: 12, cy: 14, rx: 2, ry: 0.5 }),
    h('circle', { cx: 8, cy: 6, r: 0.5, fill: 'currentColor' }),
    h('circle', { cx: 16, cy: 7, r: 0.5, fill: 'currentColor' }),
    h('circle', { cx: 10, cy: 5, r: 0.3, fill: 'currentColor' })
  )
};

// Utility Functions
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatSpeed(bytesPerSecond) {
  return formatBytes(bytesPerSecond) + '/s';
}

function formatTime(seconds) {
  if (!seconds || seconds === Infinity) return '∞';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Main App Component
function App() {
  const [torrents, setTorrents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMagnetModal, setShowMagnetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [config, setConfig] = useState(null);
  const [videoPlayer, setVideoPlayer] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ infoHash: null, show: false });
  const [theme, setTheme] = useState('amoled');
  const [sessionStats, setSessionStats] = useState({ downloaded: 0, uploaded: 0 });
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ru');
  const [t, setT] = useState(window.i18n.getTranslations(language));

  useEffect(() => {
    loadConfig();
    
    console.log('🌌 NebulaTorrent initialized');
    console.log('WebTorrent running in main process (like qBittorrent!)');
    
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'amoled';
    setTheme(savedTheme);
    document.body.className = `theme-${savedTheme}`;
    
    // Listen to torrent updates from main process
    window.electronAPI.onTorrentUpdate((torrentsData) => {
      setTorrents(torrentsData);
      
      // Update session stats
      const totalDownloaded = torrentsData.reduce((sum, t) => sum + (t.downloaded || 0), 0);
      const totalUploaded = torrentsData.reduce((sum, t) => sum + (t.uploaded || 0), 0);
      setSessionStats({ downloaded: totalDownloaded, uploaded: totalUploaded });
    });
    
    window.electronAPI.onTorrentAdded((data) => {
      console.log('✅ Torrent added:', data.name);
    });
    
    window.electronAPI.onTorrentError((data) => {
      console.error('❌ Torrent error:', data.error);
    });
  }, []);

  async function loadConfig() {
    const cfg = await window.electronAPI.loadConfig();
    setConfig(cfg);
  }

  async function saveConfig(newConfig) {
    await window.electronAPI.saveConfig(newConfig);
    setConfig(newConfig);
  }
  
  function changeTheme(newTheme) {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = `theme-${newTheme}`;
  }

  function updateTorrents() {
    // Not needed anymore - updates come from main process
  }

  async function addTorrentFile() {
    try {
      const fileArray = await window.electronAPI.openFile();
      if (fileArray && fileArray.length > 0) {
        console.log('📁 Sending torrent file to main process...');
        
        const result = await window.electronAPI.addTorrent({
          type: 'file',
          fileData: fileArray
        });
        
        if (result.success) {
          console.log('✅ Torrent added:', result.name);
          window.electronAPI.showNotification({
            title: '✅ Torrent Added',
            body: result.name
          });
        } else {
          console.error('❌ Failed to add torrent:', result.error);
          window.electronAPI.showNotification({
            title: '❌ Error',
            body: result.error
          });
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
    setShowAddModal(false);
  }

  async function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files.length);
    
    for (const file of files) {
      if (file.name.endsWith('.torrent')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const fileData = Array.from(new Uint8Array(event.target.result));
            console.log('📁 Sending dropped file to main process...');
            
            const result = await window.electronAPI.addTorrent({
              type: 'file',
              fileData
            });
            
            if (result.success) {
              console.log('✅ Torrent added:', result.name);
              window.electronAPI.showNotification({
                title: '✅ Torrent Added',
                body: result.name
              });
            }
          } catch (error) {
            console.error('❌ Error:', error);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.id === 'root') {
      setIsDragging(false);
    }
  }

  async function addMagnetLink(magnetUri) {
    if (!magnetUri || !magnetUri.trim()) {
      console.log('Empty magnet URI');
      return;
    }
    
    try {
      console.log('🧲 Sending magnet to main process...');
      
      const result = await window.electronAPI.addTorrent({
        type: 'magnet',
        magnetUri: magnetUri.trim()
      });
      
      if (result.success) {
        console.log('✅ Magnet added:', result.name);
        window.electronAPI.showNotification({
          title: '✅ Torrent Added',
          body: result.name
        });
      } else {
        console.error('❌ Failed to add magnet:', result.error);
        window.electronAPI.showNotification({
          title: '❌ Error',
          body: result.error
        });
      }
    } catch (error) {
      console.error('❌ Error:', error);
    }
    setShowMagnetModal(false);
  }

  async function togglePause(infoHash) {
    const torrent = torrents.find(t => t.infoHash === infoHash);
    if (torrent) {
      if (torrent.paused) {
        await window.electronAPI.resumeTorrent(infoHash);
      } else {
        await window.electronAPI.pauseTorrent(infoHash);
      }
    }
  }

  async function removeTorrent(infoHash) {
    setShowDeleteModal({ infoHash, show: true });
  }
  
  async function confirmDelete(infoHash, deleteFiles) {
    await window.electronAPI.removeTorrent(infoHash, deleteFiles);
    setShowDeleteModal({ infoHash: null, show: false });
  }
  
  async function openFolder(infoHash) {
    await window.electronAPI.openFolder(infoHash);
  }

  async function playVideo(torrentData, fileIndex) {
    try {
      const streamUrl = await window.electronAPI.getStreamUrl(torrentData.infoHash, fileIndex);
      if (streamUrl) {
        const fileName = torrentData.files[fileIndex].name;
        console.log('🎬 Opening video player:', fileName);
        console.log('Stream URL:', streamUrl);
        setVideoPlayer({ url: streamUrl, name: fileName });
      } else {
        console.error('❌ Failed to get stream URL');
      }
    } catch (error) {
      console.error('❌ Error getting stream URL:', error);
    }
  }

  const filteredTorrents = torrents.filter(t => {
    if (filter === 'downloading' && (t.done || t.paused)) return false;
    if (filter === 'completed' && !t.done) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  
  // Calculate total speeds
  const totalDownloadSpeed = torrents.reduce((sum, t) => sum + (t.downloadSpeed || 0), 0);
  const totalUploadSpeed = torrents.reduce((sum, t) => sum + (t.uploadSpeed || 0), 0);
  const activeTorrents = torrents.filter(t => !t.paused && !t.done).length;

  return h('div', { 
    id: 'root',
    className: isDragging ? 'drag-over' : '',
    onDrop: handleFileDrop,
    onDragOver: handleDragOver,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave
  },
    h(TitleBar),
    h('div', { className: 'app-container' },
      h(Sidebar, { filter, setFilter }),
      h('div', { className: 'main-content' },
        h(StatsBar, { 
          totalDownloadSpeed, 
          totalUploadSpeed, 
          activeTorrents, 
          totalTorrents: torrents.length,
          sessionStats
        }),
        h(Toolbar, {
          onAddFile: () => setShowAddModal(true),
          onAddMagnet: () => setShowMagnetModal(true),
          onSettings: () => setShowSettingsModal(true),
          onTheme: () => setShowThemeModal(true),
          onStats: () => setShowStatsModal(true),
          searchQuery,
          setSearchQuery
        }),
        h(TorrentsList, {
          torrents: filteredTorrents,
          onTogglePause: togglePause,
          onRemove: removeTorrent,
          onPlayVideo: playVideo,
          onOpenFolder: openFolder
        })
      )
    ),
    showAddModal && h(AddTorrentModal, {
      onClose: () => setShowAddModal(false),
      onAdd: addTorrentFile
    }),
    showMagnetModal && h(MagnetModal, {
      onClose: () => setShowMagnetModal(false),
      onAdd: addMagnetLink
    }),
    showSettingsModal && h(SettingsModal, {
      config,
      onClose: () => setShowSettingsModal(false),
      onSave: saveConfig
    }),
    showThemeModal && h(ThemeModal, {
      currentTheme: theme,
      onClose: () => setShowThemeModal(false),
      onSelect: (newTheme) => {
        changeTheme(newTheme);
        setShowThemeModal(false);
      }
    }),
    showStatsModal && h(StatsModal, {
      torrents,
      sessionStats,
      onClose: () => setShowStatsModal(false)
    }),
    showDeleteModal.show && h(DeleteModal, {
      onClose: () => setShowDeleteModal({ infoHash: null, show: false }),
      onDelete: (deleteFiles) => confirmDelete(showDeleteModal.infoHash, deleteFiles)
    }),
    videoPlayer && h(VideoPlayer, {
      url: videoPlayer.url,
      name: videoPlayer.name,
      onClose: () => setVideoPlayer(null)
    })
  );
}

// Title Bar Component
function TitleBar() {
  return h('div', { className: 'title-bar' },
    h('div', { className: 'title-bar-left' },
      h('div', { className: 'app-logo' }, 
        Icons.nebula(),
        ' NebulaTorrent'
      )
    ),
    h('div', { className: 'window-controls' },
      h('button', {
        className: 'window-btn',
        onClick: () => window.electronAPI.minimizeWindow()
      }, Icons.minimize()),
      h('button', {
        className: 'window-btn',
        onClick: () => window.electronAPI.maximizeWindow()
      }, Icons.maximize()),
      h('button', {
        className: 'window-btn close',
        onClick: () => window.electronAPI.closeWindow()
      }, Icons.close())
    )
  );
}

// Sidebar Component
function Sidebar({ filter, setFilter }) {
  const items = [
    { id: 'all', label: 'All Torrents', icon: Icons.download },
    { id: 'downloading', label: 'Downloading', icon: Icons.download },
    { id: 'completed', label: 'Completed', icon: Icons.folder }
  ];

  return h('div', { className: 'sidebar' },
    items.map(item =>
      h('div', {
        key: item.id,
        className: `sidebar-item ${filter === item.id ? 'active' : ''}`,
        onClick: () => setFilter(item.id)
      },
        item.icon(),
        item.label
      )
    )
  );
}

// Stats Bar Component
function StatsBar({ totalDownloadSpeed, totalUploadSpeed, activeTorrents, totalTorrents, sessionStats }) {
  return h('div', { className: 'stats-bar' },
    h('div', { className: 'stat-item' },
      h('span', { className: 'stat-icon' }, Icons.downloadIcon()),
      h('span', { className: 'stat-value' }, formatSpeed(totalDownloadSpeed))
    ),
    h('div', { className: 'stat-item' },
      h('span', { className: 'stat-icon' }, Icons.uploadIcon()),
      h('span', { className: 'stat-value' }, formatSpeed(totalUploadSpeed))
    ),
    h('div', { className: 'stat-item' },
      h('span', { className: 'stat-icon' }, Icons.fire()),
      h('span', { className: 'stat-value' }, `${activeTorrents}/${totalTorrents}`)
    ),
    h('div', { className: 'stat-item' },
      h('span', { className: 'stat-icon' }, Icons.barChart()),
      h('span', { className: 'stat-value' }, formatBytes(sessionStats.downloaded))
    )
  );
}

// Toolbar Component
function Toolbar({ onAddFile, onAddMagnet, onSettings, onTheme, onStats, searchQuery, setSearchQuery }) {
  return h('div', { className: 'toolbar' },
    h('button', {
      className: 'btn btn-primary',
      onClick: onAddFile
    },
      Icons.download(),
      'Add Torrent'
    ),
    h('button', {
      className: 'btn btn-secondary',
      onClick: onAddMagnet
    },
      Icons.magnet(),
      'Add Magnet'
    ),
    h('input', {
      type: 'text',
      className: 'search-input',
      placeholder: 'Search torrents...',
      value: searchQuery,
      onChange: (e) => setSearchQuery(e.target.value)
    }),
    h('button', {
      className: 'btn btn-secondary',
      onClick: onStats,
      title: 'Statistics'
    },
      Icons.chart()
    ),
    h('button', {
      className: 'btn btn-secondary',
      onClick: onTheme,
      title: 'Change Theme'
    },
      Icons.palette()
    ),
    h('button', {
      className: 'btn btn-secondary',
      onClick: onSettings
    },
      Icons.settings()
    )
  );
}

// Torrents List Component
function TorrentsList({ torrents, onTogglePause, onRemove, onPlayVideo, onOpenFolder }) {
  if (torrents.length === 0) {
    return h('div', { className: 'torrents-container' },
      h('div', { className: 'empty-state' },
        h('div', { className: 'empty-icon' }, Icons.nebula()),
        h('div', { className: 'empty-text' }, 'No torrents yet. Add one to get started!'),
        h('div', { className: 'empty-hint' }, 'Drag & drop .torrent files here')
      )
    );
  }

  return h('div', { className: 'torrents-container' },
    torrents.map(torrent =>
      h(TorrentCard, {
        key: torrent.infoHash,
        torrent,
        onTogglePause,
        onRemove,
        onPlayVideo,
        onOpenFolder
      })
    )
  );
}

// Torrent Card Component
function TorrentCard({ torrent, onTogglePause, onRemove, onPlayVideo, onOpenFolder }) {
  const [expanded, setExpanded] = useState(false);

  const videoFiles = torrent.files.filter(f =>
    /\.(mp4|webm|mkv|avi|mov)$/i.test(f.name)
  );
  
  const getStatusIcon = () => {
    if (torrent.done) return Icons.checkCircle();
    if (torrent.paused) return Icons.pauseCircle();
    return Icons.downloadIcon();
  };

  return h('div', { className: 'torrent-card', onClick: () => setExpanded(!expanded) },
    h('div', { className: 'torrent-header' },
      h('div', { className: 'torrent-name' }, torrent.name),
      h('div', { className: 'torrent-actions', onClick: e => e.stopPropagation() },
        torrent.done && h('button', {
          className: 'action-btn',
          onClick: () => onOpenFolder(torrent.infoHash),
          title: 'Open Folder'
        }, Icons.folderOpen()),
        h('button', {
          className: 'action-btn',
          onClick: () => onTogglePause(torrent.infoHash),
          title: torrent.paused ? 'Resume' : 'Pause'
        }, torrent.paused ? Icons.play() : Icons.pause()),
        h('button', {
          className: 'action-btn',
          onClick: () => onRemove(torrent.infoHash, false),
          title: 'Remove'
        }, Icons.trash())
      )
    ),
    h('div', { className: 'progress-bar-container' },
      h('div', {
        className: 'progress-bar',
        style: { width: `${torrent.progress * 100}%` }
      })
    ),
    h('div', { className: 'torrent-stats' },
      h('div', { className: 'stat' }, 
        getStatusIcon(),
        ` ${Math.round(torrent.progress * 100)}%`
      ),
      h('div', { className: 'stat' }, 
        Icons.downloadIcon(),
        ` ${formatSpeed(torrent.downloadSpeed)}`
      ),
      h('div', { className: 'stat' }, 
        Icons.uploadIcon(),
        ` ${formatSpeed(torrent.uploadSpeed)}`
      ),
      h('div', { className: 'stat' }, 
        Icons.globe(),
        ` ${torrent.numPeers}`
      ),
      h('div', { className: 'stat' }, `ETA: ${formatTime(torrent.timeRemaining / 1000)}`),
      h('div', { className: 'stat' }, `${formatBytes(torrent.downloaded)} / ${formatBytes(torrent.length)}`)
    ),
    expanded && h('div', { className: 'file-list', onClick: e => e.stopPropagation() },
      torrent.files.map((file, idx) => {
        const isVideo = /\.(mp4|webm|mkv|avi|mov)$/i.test(file.name);
        return h('div', { key: idx, className: 'file-item' },
          h('span', { className: 'file-name' }, file.name),
          h('span', { className: 'file-size' }, formatBytes(file.length)),
          isVideo && h('button', {
            className: 'action-btn',
            onClick: () => onPlayVideo(torrent, idx),
            title: 'Play Video'
          }, Icons.video())
        );
      })
    )
  );
}

// Add Torrent Modal
function AddTorrentModal({ onClose, onAdd }) {
  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { className: 'modal', onClick: e => e.stopPropagation() },
      h('div', { className: 'modal-header' }, 'Add Torrent File'),
      h('div', { style: { marginBottom: '20px', color: 'rgba(255,255,255,0.6)' } },
        'Select a .torrent file from your computer'
      ),
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', onClick: onClose }, 'Cancel'),
        h('button', { className: 'btn btn-primary', onClick: onAdd }, 'Select File')
      )
    )
  );
}

// Magnet Modal
function MagnetModal({ onClose, onAdd }) {
  const [magnetUri, setMagnetUri] = useState('');

  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { className: 'modal', onClick: e => e.stopPropagation() },
      h('div', { className: 'modal-header' }, 'Add Magnet Link'),
      h('div', { className: 'input-group' },
        h('label', { className: 'input-label' }, 'Magnet URI'),
        h('input', {
          type: 'text',
          className: 'input',
          placeholder: 'magnet:?xt=urn:btih:...',
          value: magnetUri,
          onChange: e => setMagnetUri(e.target.value)
        })
      ),
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', onClick: onClose }, 'Cancel'),
        h('button', {
          className: 'btn btn-primary',
          onClick: () => onAdd(magnetUri)
        }, 'Add')
      )
    )
  );
}

// Settings Modal
function SettingsModal({ config, onClose, onSave }) {
  const [downloadPath, setDownloadPath] = useState(config?.downloadPath || '');
  const [downloadLimit, setDownloadLimit] = useState(config?.downloadLimit || 0);
  const [uploadLimit, setUploadLimit] = useState(config?.uploadLimit || 0);

  async function selectFolder() {
    const folder = await window.electronAPI.selectFolder();
    if (folder) setDownloadPath(folder);
  }

  function handleSave() {
    onSave({
      downloadPath,
      downloadLimit: parseInt(downloadLimit) || 0,
      uploadLimit: parseInt(uploadLimit) || 0,
      theme: 'amoled'
    });
    onClose();
  }

  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { className: 'modal', onClick: e => e.stopPropagation() },
      h('div', { className: 'modal-header' }, 'Settings'),
      h('div', { className: 'settings-section' },
        h('div', { className: 'settings-title' }, 'Downloads'),
        h('div', { className: 'input-group' },
          h('label', { className: 'input-label' }, 'Download Folder'),
          h('div', { style: { display: 'flex', gap: '8px' } },
            h('input', {
              type: 'text',
              className: 'input',
              value: downloadPath,
              readOnly: true
            }),
            h('button', {
              className: 'btn btn-secondary',
              onClick: selectFolder
            }, Icons.folder())
          )
        ),
        h('div', { className: 'input-group' },
          h('label', { className: 'input-label' }, 'Download Limit (KB/s, 0 = unlimited)'),
          h('input', {
            type: 'number',
            className: 'input',
            value: downloadLimit,
            onChange: e => setDownloadLimit(e.target.value)
          })
        ),
        h('div', { className: 'input-group' },
          h('label', { className: 'input-label' }, 'Upload Limit (KB/s, 0 = unlimited)'),
          h('input', {
            type: 'number',
            className: 'input',
            value: uploadLimit,
            onChange: e => setUploadLimit(e.target.value)
          })
        )
      ),
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', onClick: onClose }, 'Cancel'),
        h('button', { className: 'btn btn-primary', onClick: handleSave }, 'Save')
      )
    )
  );
}

// Delete Modal
function DeleteModal({ onClose, onDelete }) {
  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { className: 'modal', onClick: e => e.stopPropagation() },
      h('div', { className: 'modal-header' }, 'Delete Torrent'),
      h('div', { style: { marginBottom: '20px', color: 'rgba(255,255,255,0.7)' } },
        'Choose what to delete:'
      ),
      h('div', { className: 'delete-options' },
        h('button', {
          className: 'btn btn-secondary',
          onClick: () => onDelete(false),
          style: { width: '100%', marginBottom: '10px' }
        }, 'Remove from list only'),
        h('button', {
          className: 'btn btn-danger',
          onClick: () => onDelete(true),
          style: { width: '100%' }
        }, 'Delete files + remove from list')
      ),
      h('div', { className: 'modal-actions', style: { marginTop: '20px' } },
        h('button', { className: 'btn btn-secondary', onClick: onClose }, 'Cancel')
      )
    )
  );
}

// Video Player Component
function VideoPlayer({ url, name, onClose }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    console.log('🎬 VideoPlayer mounted');
    console.log('URL:', url);
    
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url]);
  
  return h('div', { className: 'video-player-container' },
    h('div', { className: 'player-header' },
      h('button', {
        className: 'player-close-btn',
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔙 Closing video player');
          onClose();
        }
      }, Icons.back()),
      h('div', { className: 'player-title' }, name)
    ),
    h('div', { className: 'video-wrapper' },
      h('video', {
        ref: videoRef,
        src: url,
        controls: true,
        autoPlay: true,
        style: { width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' },
        onError: (e) => {
          console.error('❌ Video error:', e);
          console.error('Video element:', e.target);
          console.error('Error code:', e.target.error?.code);
          console.error('Error message:', e.target.error?.message);
        },
        onLoadStart: () => console.log('📹 Video load started'),
        onLoadedMetadata: () => console.log('✅ Video metadata loaded'),
        onCanPlay: () => console.log('▶️ Video can play')
      })
    )
  );
}

// Theme Modal
function ThemeModal({ currentTheme, onClose, onSelect }) {
  const themes = [
    { id: 'amoled', name: 'AMOLED', colors: ['#000000', '#a855f7', '#3b82f6'] },
    { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#0a0a0a', '#ff006e', '#00f5ff'] },
    { id: 'matrix', name: 'Matrix', colors: ['#000000', '#00ff41', '#008f11'] },
    { id: 'minimal', name: 'Minimal White', colors: ['#ffffff', '#6366f1', '#8b5cf6'] }
  ];
  
  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { className: 'modal', onClick: e => e.stopPropagation() },
      h('div', { className: 'modal-header' }, 'Choose Theme'),
      h('div', { className: 'theme-grid' },
        themes.map(theme =>
          h('div', {
            key: theme.id,
            className: `theme-card ${currentTheme === theme.id ? 'active' : ''}`,
            onClick: () => onSelect(theme.id)
          },
            h('div', { className: 'theme-preview' },
              theme.colors.map((color, idx) =>
                h('div', {
                  key: idx,
                  className: 'theme-color',
                  style: { background: color }
                })
              )
            ),
            h('div', { className: 'theme-name' }, theme.name),
            currentTheme === theme.id && h('div', { className: 'theme-check' }, Icons.check())
          )
        )
      ),
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', onClick: onClose }, 'Close')
      )
    )
  );
}

// Stats Modal
function StatsModal({ torrents, sessionStats, onClose }) {
  const completedTorrents = torrents.filter(t => t.done).length;
  const activeTorrents = torrents.filter(t => !t.paused && !t.done).length;
  const pausedTorrents = torrents.filter(t => t.paused).length;
  const totalPeers = torrents.reduce((sum, t) => sum + (t.numPeers || 0), 0);
  
  return h('div', { className: 'modal-overlay', onClick: onClose },
    h('div', { className: 'modal', onClick: e => e.stopPropagation() },
      h('div', { className: 'modal-header' }, 'Session Statistics'),
      h('div', { className: 'stats-grid' },
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.downloadIcon()),
          h('div', { className: 'stats-card-label' }, 'Downloaded'),
          h('div', { className: 'stats-card-value' }, formatBytes(sessionStats.downloaded))
        ),
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.uploadIcon()),
          h('div', { className: 'stats-card-label' }, 'Uploaded'),
          h('div', { className: 'stats-card-value' }, formatBytes(sessionStats.uploaded))
        ),
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.checkCircle()),
          h('div', { className: 'stats-card-label' }, 'Completed'),
          h('div', { className: 'stats-card-value' }, completedTorrents)
        ),
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.fire()),
          h('div', { className: 'stats-card-label' }, 'Active'),
          h('div', { className: 'stats-card-value' }, activeTorrents)
        ),
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.pauseCircle()),
          h('div', { className: 'stats-card-label' }, 'Paused'),
          h('div', { className: 'stats-card-value' }, pausedTorrents)
        ),
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.globe()),
          h('div', { className: 'stats-card-label' }, 'Total Peers'),
          h('div', { className: 'stats-card-value' }, totalPeers)
        ),
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.barChart()),
          h('div', { className: 'stats-card-label' }, 'Total Torrents'),
          h('div', { className: 'stats-card-value' }, torrents.length)
        ),
        h('div', { className: 'stats-card' },
          h('div', { className: 'stats-card-icon' }, Icons.scale()),
          h('div', { className: 'stats-card-label' }, 'Ratio'),
          h('div', { className: 'stats-card-value' }, 
            sessionStats.downloaded > 0 
              ? (sessionStats.uploaded / sessionStats.downloaded).toFixed(2)
              : '0.00'
          )
        )
      ),
      h('div', { className: 'modal-actions' },
        h('button', { className: 'btn btn-secondary', onClick: onClose }, 'Close')
      )
    )
  );
}

// Initialize App
const root = createRoot(document.getElementById('root'));
root.render(h(App));
