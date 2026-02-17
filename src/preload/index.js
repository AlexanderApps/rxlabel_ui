import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
// Custom APIs exposed to renderer
const api = {
  /* ------------------------------------------------------------------
   * Labels
   * ------------------------------------------------------------------ */

  getLabels: (searchTerm = '') => ipcRenderer.invoke('labels:get', searchTerm),

  createLabel: (product, instructions, warning, is_custom = 1) =>
    ipcRenderer.invoke('labels:create', product, instructions, warning, is_custom),

  updateLabel: (id, product, instructions, warning, is_custom = 1) =>
    ipcRenderer.invoke('labels:update', id, product, instructions, warning, is_custom),

  deleteLabel: (id) => ipcRenderer.invoke('labels:delete', id),

  /* ------------------------------------------------------------------
   * Settings
   * ------------------------------------------------------------------ */

  getSettings: () => ipcRenderer.invoke('settings:get'),

  saveSettings: (data) => ipcRenderer.invoke('settings:save', data),

  setTheme: (theme) => ipcRenderer.invoke('settings:theme', theme),

  /* ------------------------------------------------------------------
   * Queue
   * ------------------------------------------------------------------ */

  getQueue: () => ipcRenderer.invoke('queue:get'),

  addToQueue: (item) => ipcRenderer.invoke('queue:add', item),

  removeFromQueue: (id) => ipcRenderer.invoke('queue:remove', id),

  countQueue: () => ipcRenderer.invoke('queue:count'),

  clearQueue: () => ipcRenderer.invoke('queue:clear'),

  /* ------------------------------------------------------------------
   * Printing
   * ------------------------------------------------------------------ */

  printerPrint: (job) => ipcRenderer.invoke('printer:print', job),
  printerTempPrint: (job) => ipcRenderer.invoke('printer:temp-print', job),

  clientLabelsPrint: (clientId) => ipcRenderer.invoke('client-label:print', clientId),

  /* ------------------------------------------------------------------
   * Authentication / Users
   * ------------------------------------------------------------------ */

  loginUser: (username, password) => ipcRenderer.invoke('user:login', username, password),

  logoutUser: () => ipcRenderer.invoke('user:logout'),

  getUserSession: () => ipcRenderer.invoke('user:get-session'),

  getMe: () => ipcRenderer.invoke('users:me'),

  getUsers: () => ipcRenderer.invoke('users:get'),

  createUser: (name, email, password, role = 'user', position = null) =>
    ipcRenderer.invoke('users:add', name, email, password, role, position),

  updateUser: (id, name, email, role = 'user', position = null) =>
    ipcRenderer.invoke('users:update', id, name, email, role, position),

  deleteUser: (id) => ipcRenderer.invoke('users:delete', id),

  changeUserPassword: (data) => ipcRenderer.invoke('user:change-password', data),

  /* ------------------------------------------------------------------
   * Clients
   * ------------------------------------------------------------------ */

  getClients: () => ipcRenderer.invoke('clients:get'),

  getClientById: (id) => ipcRenderer.invoke('client:get', id),

  createClient: (name, contact, email, home_address = null) =>
    ipcRenderer.invoke('clients:add', name, contact, email, home_address),

  updateClient: (id, name, contact, email, home_address = null) =>
    ipcRenderer.invoke('client:update', id, name, contact, email, home_address),

  deleteClient: (id) => ipcRenderer.invoke('clients:delete', id),

  countClients: () => ipcRenderer.invoke('clients:count'),

  /* ------------------------------------------------------------------
   * Client Labels
   * ------------------------------------------------------------------ */

  getClientLabels: (clientId) => ipcRenderer.invoke('clients:get-labels', clientId),

  createClientLabel: (clientId, product, instructions, warning) =>
    ipcRenderer.invoke('clients:add-label', clientId, product, instructions, warning),

  createClientLabels: (data) => ipcRenderer.invoke('clients:add-labels', data),

  updateClientLabel: (id, product, instructions, warning) =>
    ipcRenderer.invoke('client-label:update', id, product, instructions, warning),

  deleteClientLabel: (id) => ipcRenderer.invoke('client-label:delete', id),

  countClientLabels: (clientId) => ipcRenderer.invoke('client-label:count', clientId),

  sendClientLabelsToQueue: (clientId) => ipcRenderer.invoke('client-label:queue', clientId),

  /* ------------------------------------------------------------------
   * License
   * ------------------------------------------------------------------ */
  verifyLicense: (licenseKey) => ipcRenderer.invoke('license:verify', licenseKey),

  saveSetup: (data) => ipcRenderer.invoke('app:setup-complete', data),

  isSetupComplete: () => ipcRenderer.invoke('app:is-setup-complete'),

  /* ------------------------------------------------------------------
   * Admin / Stats
   * ------------------------------------------------------------------ */
  getStats: () => ipcRenderer.invoke('stats:get-general'),

  getBackups: () => ipcRenderer.invoke('admin:get-db-backups'),

  createManualBackup: () => ipcRenderer.invoke('admin:create-db-backup'),

  lastBackupDate: () => ipcRenderer.invoke('admin:last-db-backup'),

  downloadBackup: (fileName) => ipcRenderer.invoke('admin:download-backup', fileName),

  getBackupKey: (fileName) => ipcRenderer.invoke('admin:get-backup-key', fileName),

  removeBackup: (fileName) => ipcRenderer.invoke('admin:remove-backup', fileName),

  createBackup: () => ipcRenderer.invoke('admin:create-backup'),

  getExportPreview: (options) => ipcRenderer.invoke('admin:get-export-preview', options),

  exportData: (options) => ipcRenderer.invoke('admin:export-data', options),

  importCSVData: (data) => ipcRenderer.invoke('admin:import-csv-data', data),

  getBackupSettings: () => ipcRenderer.invoke('admin:get-backup-settings')
}

// Use `contextBridge` APIs to expose Electron APIs
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
