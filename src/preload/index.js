import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Database Functions
  getLabels: (searchTerm) => ipcRenderer.invoke('labels:get', searchTerm),
  createLabel: (product, instructions, warning) =>
    ipcRenderer.invoke('labels:create', product, instructions, warning),
  deleteLabel: (id) => ipcRenderer.invoke('labels:delete', id),
  updateLabel: (id, product, instructions, warning) =>
    ipcRenderer.invoke('labels:update', id, product, instructions, warning),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (data) => ipcRenderer.invoke('settings:save', data),

  getQueue: () => ipcRenderer.invoke('queue:get'),
  addToQueue: (item) => ipcRenderer.invoke('queue:add', item),
  removeFromQueue: (id) => ipcRenderer.invoke('queue:remove', id),
  countQueue: () => ipcRenderer.invoke('queue:count'),
  clearQueue: () => ipcRenderer.invoke('queue:clear'),
  printerPrint: (job) => ipcRenderer.invoke('printer:print', job),
  clientLabelsPrint: (id) => ipcRenderer.invoke('client-label:print', id),

  getMe: () => ipcRenderer.invoke('users:me'),
  createUser: (username, email, password) =>
    ipcRenderer.invoke('users:add', username, email, password),
  deleteUser: (id) => ipcRenderer.invoke('users:add', id),
  loginUser: (username, password) => ipcRenderer.invoke('user:login', username, password),
  getUserSession: () => ipcRenderer.invoke('user:get-session'),
  logoutUser: () => ipcRenderer.invoke('user:logout'),

  getClients: () => ipcRenderer.invoke('clients:get'),
  getClientById: (id) => ipcRenderer.invoke('client:get', id),
  updateClient: (id, name, contact, email) =>
    ipcRenderer.invoke('client:update', id, name, contact, email),
  createClient: (username, contact, email) =>
    ipcRenderer.invoke('clients:add', username, contact, email),
  getClientLabels: (id) => ipcRenderer.invoke('clients:get-labels', id),
  deleteClient: (id) => ipcRenderer.invoke('clients:delete', id),
  createClientLabel: (client_id, product, instructions, warning) =>
    ipcRenderer.invoke('clients:add-label', client_id, product, instructions, warning),
  createClientLabels: (data) => ipcRenderer.invoke('clients:add-labels', data),
  updateClientLabel: (id, product, instructions, warning) =>
    ipcRenderer.invoke('client-label:update', id, product, instructions, warning),
  deleteClientLabels: (id, labels) => ipcRenderer.invoke('clients:delete-labels', id, labels),
  deleteClientLabel: (id) => ipcRenderer.invoke('clients:delete-label', id),
  countClients: () => ipcRenderer.invoke('clients:count'),
  countClientLabels: (id) => ipcRenderer.invoke('client-label:count', id),
  sendToQueue: (id) => ipcRenderer.invoke('client-label:queue', id)
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
