// Internationalization (i18n) for NebulaTorrent

const translations = {
  ru: {
    // Title Bar
    appName: 'NebulaTorrent',
    
    // Toolbar
    addTorrent: 'Добавить торрент',
    addMagnet: 'Добавить магнет',
    statistics: 'Статистика',
    changeTheme: 'Сменить тему',
    settings: 'Настройки',
    searchPlaceholder: 'Поиск торрентов...',
    
    // Sidebar
    allTorrents: 'Все торренты',
    downloading: 'Загружаются',
    completed: 'Завершённые',
    
    // Stats Bar
    downloaded: 'Загружено',
    uploaded: 'Отдано',
    active: 'Активные',
    peers: 'Пиры',
    
    // Torrent Card
    pause: 'Пауза',
    resume: 'Продолжить',
    remove: 'Удалить',
    openFolder: 'Открыть папку',
    playVideo: 'Воспроизвести',
    
    // Empty State
    noTorrents: 'Торрентов пока нет. Добавьте первый!',
    dragDropHint: 'Перетащите .torrent файлы сюда',
    
    // Modals
    addTorrentFile: 'Добавить торрент файл',
    selectTorrentFile: 'Выберите .torrent файл с вашего компьютера',
    addMagnetLink: 'Добавить магнет ссылку',
    magnetUri: 'Magnet URI',
    magnetPlaceholder: 'magnet:?xt=urn:btih:...',
    
    // Settings Modal
    settingsTitle: 'Настройки',
    downloads: 'Загрузки',
    downloadFolder: 'Папка загрузок',
    downloadLimit: 'Лимит загрузки (КБ/с, 0 = без лимита)',
    uploadLimit: 'Лимит отдачи (КБ/с, 0 = без лимита)',
    language: 'Язык',
    selectLanguage: 'Выберите язык',
    
    // Theme Modal
    chooseTheme: 'Выбрать тему',
    themeAmoled: 'AMOLED',
    themeCyberpunk: 'Киберпанк',
    themeMatrix: 'Матрица',
    themeMinimal: 'Светлая',
    
    // Stats Modal
    sessionStatistics: 'Статистика сессии',
    completedTorrents: 'Завершено',
    activeTorrents: 'Активные',
    pausedTorrents: 'На паузе',
    totalPeers: 'Всего пиров',
    totalTorrents: 'Всего торрентов',
    ratio: 'Рейтинг',
    
    // Delete Modal
    deleteTorrent: 'Удалить торрент',
    deleteChoose: 'Выберите что удалить:',
    removeFromList: 'Убрать из списка',
    deleteFilesAndRemove: 'Удалить файлы + убрать из списка',
    
    // Buttons
    cancel: 'Отмена',
    add: 'Добавить',
    save: 'Сохранить',
    close: 'Закрыть',
    selectFile: 'Выбрать файл',
    
    // Notifications
    torrentAdded: 'Торрент добавлен',
    downloadComplete: 'Загрузка завершена',
    error: 'Ошибка'
  },
  
  en: {
    // Title Bar
    appName: 'NebulaTorrent',
    
    // Toolbar
    addTorrent: 'Add Torrent',
    addMagnet: 'Add Magnet',
    statistics: 'Statistics',
    changeTheme: 'Change Theme',
    settings: 'Settings',
    searchPlaceholder: 'Search torrents...',
    
    // Sidebar
    allTorrents: 'All Torrents',
    downloading: 'Downloading',
    completed: 'Completed',
    
    // Stats Bar
    downloaded: 'Downloaded',
    uploaded: 'Uploaded',
    active: 'Active',
    peers: 'Peers',
    
    // Torrent Card
    pause: 'Pause',
    resume: 'Resume',
    remove: 'Remove',
    openFolder: 'Open Folder',
    playVideo: 'Play Video',
    
    // Empty State
    noTorrents: 'No torrents yet. Add one to get started!',
    dragDropHint: 'Drag & drop .torrent files here',
    
    // Modals
    addTorrentFile: 'Add Torrent File',
    selectTorrentFile: 'Select a .torrent file from your computer',
    addMagnetLink: 'Add Magnet Link',
    magnetUri: 'Magnet URI',
    magnetPlaceholder: 'magnet:?xt=urn:btih:...',
    
    // Settings Modal
    settingsTitle: 'Settings',
    downloads: 'Downloads',
    downloadFolder: 'Download Folder',
    downloadLimit: 'Download Limit (KB/s, 0 = unlimited)',
    uploadLimit: 'Upload Limit (KB/s, 0 = unlimited)',
    language: 'Language',
    selectLanguage: 'Select Language',
    
    // Theme Modal
    chooseTheme: 'Choose Theme',
    themeAmoled: 'AMOLED',
    themeCyberpunk: 'Cyberpunk',
    themeMatrix: 'Matrix',
    themeMinimal: 'Minimal White',
    
    // Stats Modal
    sessionStatistics: 'Session Statistics',
    completedTorrents: 'Completed',
    activeTorrents: 'Active',
    pausedTorrents: 'Paused',
    totalPeers: 'Total Peers',
    totalTorrents: 'Total Torrents',
    ratio: 'Ratio',
    
    // Delete Modal
    deleteTorrent: 'Delete Torrent',
    deleteChoose: 'Choose what to delete:',
    removeFromList: 'Remove from list only',
    deleteFilesAndRemove: 'Delete files + remove from list',
    
    // Buttons
    cancel: 'Cancel',
    add: 'Add',
    save: 'Save',
    close: 'Close',
    selectFile: 'Select File',
    
    // Notifications
    torrentAdded: 'Torrent Added',
    downloadComplete: 'Download Complete',
    error: 'Error'
  }
};

// Get translation function
function getTranslations(lang = 'ru') {
  return translations[lang] || translations.ru;
}

// Export for use in renderer
if (typeof window !== 'undefined') {
  window.i18n = {
    translations,
    getTranslations,
    currentLang: localStorage.getItem('language') || 'ru'
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, getTranslations };
}
