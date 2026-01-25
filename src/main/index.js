import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/rxlabel_icon.png?asset'
import { db } from './db'
import { verifyMasterPassword, hashMasterPassword } from './auth'
import { printerStart, enqueuePrint, printerShutdown } from './printer'
import { themeText } from './printer_themes'
import { cleanPrinterData } from './utils'

let CURRENT_USER = null
let SETTINGS = null

ipcMain.handle('settings:theme', (event, theme) => {
  nativeTheme.themeSource = theme // 'light', 'dark', or 'system'
  return nativeTheme.shouldUseDarkColors // Returns true if dark mode is active
})

// Settings IPC
ipcMain.handle('settings:get', () => db.fetchSettings())
ipcMain.handle('settings:save', (e, data) => db.saveSettings(data))

// Labels IPC
ipcMain.handle('labels:get', (e, searchTerm) => {
  return db.fetchLabels(searchTerm)
})
ipcMain.handle('labels:create', (e, p, i, w) => db.createLabel(p, i, w))
ipcMain.handle('labels:delete', (e, id) => db.deleteLabelById(id))
ipcMain.handle('labels:update', (e, id, p, i, w) => db.updateLabelById(id, p, i, w))

// Queue IPC
ipcMain.handle('queue:get', () => db.fetchQueue())
ipcMain.handle('queue:add', (e, item) => db.pushToQueue(item))
ipcMain.handle('queue:remove', (e, id) => db.popFromQueue(id))
ipcMain.handle('queue:count', () => db.countQueueItems())
ipcMain.handle('queue:clear', () => db.clearQueueItems())

// Printing
ipcMain.handle('printer:print', async (_, job) => {
  const cleaned = cleanPrinterData(job, SETTINGS, CURRENT_USER)

  if (Array.isArray(cleaned)) {
    await enqueuePrint(cleaned.map(themeText))
  } else {
    await enqueuePrint(themeText(cleaned))
  }
})

ipcMain.handle('client-label:print', async (_, id) => {
  const job = await db.getClientLabelsWithClientName(id)
  const cleaned = cleanPrinterData(job, SETTINGS, CURRENT_USER)
  console.log(cleaned)

  if (Array.isArray(cleaned)) {
    await enqueuePrint(cleaned.map(themeText))
  } else {
    await enqueuePrint(themeText(cleaned))
  }
})

// Helper to get session status
ipcMain.handle('user:get-session', () => {
  return CURRENT_USER
})

// Logout
ipcMain.handle('user:logout', () => {
  CURRENT_USER = null
  return { success: true }
})

// Login
ipcMain.handle('user:login', async (_, username, password) => {
  try {
    // 1. Validate input
    if (!username || !password) {
      throw new Error('Username and password are required')
    }

    const user = db.getUserForLogin(username)

    // 2. Security: Use a single "Invalid credentials" message
    // to prevent username enumeration/discovery.
    if (!user || !user.secret) {
      // Even if user doesn't exist, we should wait a moment to
      // prevent timing attacks, but for local DB this is usually fine.
      throw new Error('Invalid username or password')
    }

    // 3. Verify Password
    const validated = await verifyMasterPassword(user.secret, password)

    if (validated) {
      CURRENT_USER = {
        id: user.id,
        name: user.name,
        email: user.email
      }

      // Return the user object so the UI can update
      return { success: true, user: CURRENT_USER }
    } else {
      throw new Error('Invalid username or password')
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`)
    return { success: false, error: error.message }
  }
})
ipcMain.handle('users:add', async (_, username, email, password) => {
  db.createUser(username, email, await hashMasterPassword(password))
})
ipcMain.handle('users:me', () => CURRENT_USER)

ipcMain.handle('clients:get', () => db.fetchClients())
ipcMain.handle('client:get', (_, id) => db.getClientById(id))
ipcMain.handle('clients:add', (_, n, c, e) => db.createClient(n, c, e))
ipcMain.handle('client:update', (_, i, n, c, e) => {
  console.log(n, c, e, i)
  db.updateClient(i, n, c, e)
})
ipcMain.handle('clients:delete', (_, id) => db.deleteClientById(id))
ipcMain.handle('clients:get-labels', (_, id) => db.fetchClientLabels(id))
ipcMain.handle('clients:delete-labels', (_, id, labels) => db.deleteClientLabels(id, labels))
ipcMain.handle('clients:delete-label', (_, id) => db.deleteClientLabel(id))
ipcMain.handle('clients:add-label', (_, id, p, i, w) => db.createClientLabel(id, p, i, w))
ipcMain.handle('clients:count', () => db.countClients())
ipcMain.handle('client-label:count', (_, id) => db.countClientLabels(id))
ipcMain.handle('client-label:queue', (_, id) => db.copyClientLabelToQueue(id))
ipcMain.handle('client-label:update', (_, id, p, i, w) => db.updateClientLabel(id, p, i, w))

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minHeight: 200,
    minWidth: 200,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  SETTINGS = db.fetchSettings()

  printerStart()
  // console.log(db.getClientLabelsWithClientName(3))

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', printerShutdown)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  printerShutdown()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
