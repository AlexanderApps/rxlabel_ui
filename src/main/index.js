// import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
// import { join } from 'path'
// import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/rxlabel_icon.png?asset'
// // import { AppDatabase } from './db'
// import { AppDatabase } from './db'
// import { verifyMasterPassword, hashMasterPassword } from './auth'
// import { printerStart, enqueuePrint, printerShutdown } from './printer'
// import { themeText } from './printer_themes'
// import { cleanPrinterData } from './utils'

// let CURRENT_USER = null
// let SETTINGS = null

// function createWindow() {
//   // Create the browser window.
//   const mainWindow = new BrowserWindow({
//     width: 900,
//     height: 670,
//     minHeight: 200,
//     minWidth: 200,
//     show: false,
//     autoHideMenuBar: true,
//     ...(process.platform === 'linux' ? { icon } : {}),
//     webPreferences: {
//       preload: join(__dirname, '../preload/index.js'),
//       sandbox: false
//     }
//   })

//   mainWindow.on('ready-to-show', () => {
//     mainWindow.show()
//   })

//   mainWindow.webContents.setWindowOpenHandler((details) => {
//     shell.openExternal(details.url)
//     return { action: 'deny' }
//   })

//   // HMR for renderer base on electron-vite cli.
//   // Load the remote URL for development or the local html file for production.
//   if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
//     mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
//   } else {
//     mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
//   }
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(async () => {
//   const db = new db.AppDatabase()
//   SETTINGS = db.fetchSettings()

//   printerStart()
//   // console.log(db.getClientLabelsWithClientName(3))

//   // Set app user model id for windows
//   electronApp.setAppUserModelId('com.electron')

//   // Default open or close DevTools by F12 in development
//   // and ignore CommandOrControl + R in production.
//   // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
//   app.on('browser-window-created', (_, window) => {
//     optimizer.watchWindowShortcuts(window)
//   })

//   ipcMain.handle('settings:theme', (event, theme) => {
//     nativeTheme.themeSource = theme // 'light', 'dark', or 'system'
//     return nativeTheme.shouldUseDarkColors // Returns true if dark mode is active
//   })

//   // Settings IPC
//   ipcMain.handle('settings:get', () => db.fetchSettings())
//   ipcMain.handle('settings:save', (e, data) => db.saveSettings(data))

//   // Labels IPC
//   ipcMain.handle('labels:get', (e, searchTerm) => {
//     return db.fetchLabels(searchTerm)
//   })
//   ipcMain.handle('labels:create', (e, p, i, w) => db.createLabel(p, i, w))
//   ipcMain.handle('labels:delete', (e, id) => db.deleteLabelById(id))
//   ipcMain.handle('labels:update', (e, id, p, i, w) => db.updateLabelById(id, p, i, w))

//   // Queue IPC
//   ipcMain.handle('queue:get', () => db.fetchQueue())
//   ipcMain.handle('queue:add', (e, item) => db.pushToQueue(item))
//   ipcMain.handle('queue:remove', (e, id) => db.popFromQueue(id))
//   ipcMain.handle('queue:count', () => db.countQueueItems())
//   ipcMain.handle('queue:clear', () => db.clearQueueItems())

//   // Printing
//   ipcMain.handle('printer:print', async (_, job) => {
//     const cleaned = cleanPrinterData(job, SETTINGS, CURRENT_USER)

//     if (Array.isArray(cleaned)) {
//       await enqueuePrint(cleaned.map(themeText))
//     } else {
//       await enqueuePrint(themeText(cleaned))
//     }
//   })

//   ipcMain.handle('client-label:print', async (_, id) => {
//     const job = await db.getClientLabelsWithClientName(id)
//     const cleaned = cleanPrinterData(job, SETTINGS, CURRENT_USER)
//     console.log(cleaned)

//     if (Array.isArray(cleaned)) {
//       await enqueuePrint(cleaned.map(themeText))
//     } else {
//       await enqueuePrint(themeText(cleaned))
//     }
//   })

//   // Helper to get session status
//   ipcMain.handle('user:get-session', () => {
//     return CURRENT_USER
//   })

//   // Logout
//   ipcMain.handle('user:logout', () => {
//     CURRENT_USER = null
//     return { success: true }
//   })

//   // Login
//   ipcMain.handle('user:login', async (_, username, password) => {
//     try {
//       // 1. Validate input
//       if (!username || !password) {
//         throw new Error('Username and password are required')
//       }

//       const user = db.getUserForLogin(username)

//       // 2. Security: Use a single "Invalid credentials" message
//       // to prevent username enumeration/discovery.
//       if (!user || !user.secret) {
//         // Even if user doesn't exist, we should wait a moment to
//         // prevent timing attacks, but for local DB this is usually fine.
//         throw new Error('Invalid username or password')
//       }

//       // 3. Verify Password
//       const validated = await verifyMasterPassword(user.secret, password)

//       if (validated) {
//         CURRENT_USER = {
//           id: user.id,
//           name: user.name,
//           email: user.email
//         }

//         // Return the user object so the UI can update
//         return { success: true, user: CURRENT_USER }
//       } else {
//         throw new Error('Invalid username or password')
//       }
//     } catch (error) {
//       console.error(`Login error: ${error.message}`)
//       return { success: false, error: error.message }
//     }
//   })
//   ipcMain.handle('users:add', async (_, username, email, password) => {
//     db.createUser(username, email, await hashMasterPassword(password))
//   })
//   ipcMain.handle('users:me', () => CURRENT_USER)

//   ipcMain.handle('clients:get', () => db.fetchClients())
//   ipcMain.handle('client:get', (_, id) => db.getClientById(id))
//   ipcMain.handle('clients:add', (_, n, c, e) => db.createClient(n, c, e))
//   ipcMain.handle('client:update', (_, i, n, c, e) => {
//     console.log(n, c, e, i)
//     db.updateClient(i, n, c, e)
//   })
//   ipcMain.handle('clients:delete', (_, id) => db.deleteClientById(id))
//   ipcMain.handle('clients:get-labels', (_, id) => db.fetchClientLabels(id))
//   ipcMain.handle('clients:delete-labels', (_, id, labels) => db.deleteClientLabels(id, labels))
//   ipcMain.handle('clients:delete-label', (_, id) => db.deleteClientLabel(id))
//   ipcMain.handle('clients:add-label', (_, id, p, i, w) => db.createClientLabel(id, p, i, w))
//   ipcMain.handle('clients:add-labels', (_, data) => db.createClientLabels(data))
//   ipcMain.handle('clients:count', () => db.countClients())
//   ipcMain.handle('client-label:count', (_, id) => db.countClientLabels(id))
//   ipcMain.handle('client-label:queue', (_, id) => db.copyClientLabelToQueue(id))
//   ipcMain.handle('client-label:update', (_, id, p, i, w) => db.updateClientLabel(id, p, i, w))

//   // IPC test
//   ipcMain.on('ping', () => console.log('pong'))

//   createWindow()

//   app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// app.on('before-quit', printerShutdown)

// // Quit when all windows are closed, except on macOS. There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
// app.on('window-all-closed', () => {
//   printerShutdown()
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.

import { app, shell, BrowserWindow, ipcMain, nativeTheme, dialog } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'node:fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/rxlabel_icon.png?asset'

// Import Database and logic
import { AppDatabase } from './db' // Corrected import
import { verifyMasterPassword, hashMasterPassword } from './auth'
import { printerStart, enqueuePrint, printerShutdown } from './printer'
import { verifyLicense } from './license'
import { writeExportFile } from './utils'
import log from './logger'
import { LabelGeneratorV2 } from './label_gen_v2'
import { buildJobPages } from './label_gen_v3'
import { buildPrinterJobs } from './label_builder'
import { ensureDefaultTemplates } from './templates'

log.initialize()

let CURRENT_USER = null
let SETTINGS = null
let db = null

function createWindow() {
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const checkUserAuth = async (event) => {
  // Example: Check if CURRENT_USER is set
  return CURRENT_USER !== null
}

const checkAppLicense = async (event) => {
  return SETTINGS && SETTINGS.facility_name
}

/**
 * Higher-order function to wrap IPC handlers with Auth and Error handling
 * @param {Function} handler - The original db function to call
 * @returns {Function} - The wrapped IPC handler
 */
function withAuth(handler) {
  return async (event, ...args) => {
    try {
      // 1. Authentication Check
      // Replace with your actual auth logic (e.g., checking a global session object)
      const isAuthenticated = await checkUserAuth(event)
      if (!isAuthenticated) {
        return { success: false, error: 'Unauthorized: Please log in.' }
      }

      // 2. Execute original handler
      const result = await handler(...args)
      return { success: true, data: result }
    } catch (err) {
      // 3. Centralized Error Handling
      console.error(`IPC Error:`, err)
      return {
        success: false,
        error: err.message || 'An unexpected error occurred.'
      }
    }
  }
}

// MAIN INITIALIZATION
app.whenReady().then(async () => {
  // 1. Initialize Database (SafeStorage is now available here)
  db = new AppDatabase()
  SETTINGS = db.fetchSettings()

  console.log(db.getDiagnostics())

  console.log(db.backupManager.settings)

  ensureDefaultTemplates()

  // 2. Initialize Services
  printerStart()
  electronApp.setAppUserModelId('com.electron')

  // 3. Register IPC Handlers (Register BEFORE creating the window)
  registerIpcHandlers()

  // 4. Set up shortcuts
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 5. Create the window
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

/**
 * All IPC Handlers grouped together for clarity
 */
function registerIpcHandlers() {
  /* ------------------------------------------------------------------
   * License / Theme
   * ------------------------------------------------------------------ */

  ipcMain.handle('license:verify', (_, licenseKey) => {
    const res = verifyLicense(licenseKey)
    if (res.valid) {
      return {
        valid: true,
        payload: {
          facility_name: res.payload.facility_name,
          facility_contact: res.payload.facility_contact,
          facility_address: res.payload.facility_address
        }
      }
    }
    return { valid: false, reason: res.reason }
  })

  ipcMain.handle('app:setup-complete', async (_, data) => {
    try {
      return await setupApp(data)
    } catch (error) {
      console.error('Setup failed:', error)
      return {
        valid: false,
        reason: 'SETUP_FAILED'
      }
    }
  })

  ipcMain.handle('settings:theme', (_, theme) => {
    nativeTheme.themeSource = theme
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('app:is-setup-complete', () => {
    return db.isSetupComplete()
  })

  /* ------------------------------------------------------------------
   * Settings
   * ------------------------------------------------------------------ */

  ipcMain.handle(
    'settings:get',
    withAuth(() => db.fetchSettings())
  )
  ipcMain.handle(
    'settings:save',
    withAuth((data) => {
      console.log(data)
      const result = db.saveSettings(data)
      SETTINGS = db.fetchSettings()
      return result
    })
  )

  /* ------------------------------------------------------------------
   * Labels
   * ------------------------------------------------------------------ */

  ipcMain.handle('labels:get', (_, searchTerm = '') => db.fetchLabels(searchTerm))

  ipcMain.handle('labels:create', (_, product, instructions, warning, is_custom = 1) =>
    db.createLabel(product, instructions, warning, is_custom)
  )

  ipcMain.handle('labels:update', (_, id, product, instructions, warning, is_custom = 1) =>
    db.updateLabel(id, product, instructions, warning, is_custom)
  )

  ipcMain.handle('labels:delete', (_, id) => db.deleteLabel(id))

  /* ------------------------------------------------------------------
   * Queue
   * ------------------------------------------------------------------ */

  ipcMain.handle('queue:get', () => db.fetchQueue())

  ipcMain.handle('queue:add', (_, item) => db.pushToQueue(item))

  ipcMain.handle('queue:remove', (_, id) => db.popFromQueue(id))

  ipcMain.handle('queue:count', () => db.countQueue())

  ipcMain.handle('queue:clear', () => db.clearQueue())

  /* ------------------------------------------------------------------
   * Printing
   * ------------------------------------------------------------------ */

  ipcMain.handle('printer:print', async (_, job) => {
    enqueuePrint(buildPrinterJobs(job, SETTINGS, CURRENT_USER))
  })

  ipcMain.handle('printer:temp-print', async (_, job) => {
    const jobPages = buildJobPages(job.jobPages)
    const label = {
      printerInfo: {
        printerName: 'DP27P Label Printer'
      },
      jobInfo: {
        jobWidth: LabelGeneratorV2.PAPER_WIDTH,
        jobHeight: LabelGeneratorV2.PAPER_HEIGHT,
        orientation: 0
      },
      jobPages
    }

    await enqueuePrint(label)

    // if (Array.isArray(cleaned)) {
    //   await enqueuePrint(cleaned.map(themeText))
    // } else {
    //   await enqueuePrint(themeText(cleaned))
    // }
    // if (Array.isArray(cleaned)) {
    //   await enqueuePrint()
    // } else {
    //   await enqueuePrint(label)
    // }
  })

  ipcMain.handle('client-label:print', async (_, clientId) => {
    const job = await db.getClientLabelsWithClientName(clientId)
    enqueuePrint(buildPrinterJobs(job, SETTINGS, CURRENT_USER))
  })

  /* ------------------------------------------------------------------
   * Authentication / Users
   * ------------------------------------------------------------------ */

  ipcMain.handle('user:get-session', () => CURRENT_USER)

  ipcMain.handle('user:logout', () => {
    CURRENT_USER = null
    return { success: true }
  })

  ipcMain.handle('user:login', async (_, username, password) => {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required')
      }

      const user = db.getUserForLogin(username)
      if (!user || !user.secret) {
        throw new Error('Invalid username or password')
      }

      const valid = await verifyMasterPassword(user.secret, password)
      if (!valid) {
        throw new Error('Invalid username or password')
      }

      CURRENT_USER = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: user.position
      }

      return { success: true, user: CURRENT_USER }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('users:add', async (_, name, email, password, role = 'user', position = null) => {
    const hashed = await hashMasterPassword(password)
    return db.createUser(name, email, hashed, role, position)
  })

  ipcMain.handle('users:update', async (_, id, name, email, role = 'user', position = null) => {
    return db.updateUser(id, name, email, role, position)
  })

  ipcMain.handle('users:me', () => CURRENT_USER)

  ipcMain.handle(
    'users:get',
    withAuth(() => db.getUsers(CURRENT_USER.role))
  )

  ipcMain.handle('users:delete', (_, id) => db.deleteUser(id))

  ipcMain.handle('user:change-password', async (event, { currentPassword, newPassword }) => {
    try {
      console.log(currentPassword, newPassword)
      const curUser = await db.getUserForLogin(CURRENT_USER?.name)
      console.log(curUser)
      const isValid = await verifyMasterPassword(curUser?.secret, currentPassword)
      console.log(isValid)

      if (!isValid) {
        return { success: false, error: 'Current password is incorrect' }
      }

      const newPasswordHash = await hashMasterPassword(newPassword)
      console.log(newPassword)
      await db.changeUserPassword(curUser?.id, newPasswordHash)

      return { success: true }
    } catch (error) {
      console.error('Password change error:', error)
      return { success: false, error: 'Failed to change password' }
    }
  })

  /* ------------------------------------------------------------------
   * Clients
   * ------------------------------------------------------------------ */

  ipcMain.handle('clients:get', () => db.fetchClients())

  ipcMain.handle('client:get', (_, id) => db.getClientById(id))

  ipcMain.handle('clients:add', (_, name, contact, email, home_address = null) =>
    db.createClient(name, contact, email, home_address)
  )

  ipcMain.handle('client:update', (_, id, name, contact, email, home_address = null) =>
    db.updateClient(id, name, contact, email, home_address)
  )

  ipcMain.handle('clients:delete', (_, id) => db.deleteClient(id))

  ipcMain.handle('clients:count', () => db.countClients())

  /* ------------------------------------------------------------------
   * Client Labels
   * ------------------------------------------------------------------ */

  ipcMain.handle('clients:get-labels', (_, clientId) => db.fetchClientLabels(clientId))

  ipcMain.handle('clients:add-label', (_, clientId, product, instructions, warning) =>
    db.createClientLabel(clientId, product, instructions, warning)
  )

  ipcMain.handle('clients:add-labels', (_, data) => db.createClientLabels(data))

  ipcMain.handle('client-label:update', (_, id, product, instructions, warning) =>
    db.updateClientLabel(id, product, instructions, warning)
  )

  ipcMain.handle('client-label:delete', (_, id) => db.deleteClientLabel(id))

  ipcMain.handle('client-label:queue', (_, clientId) => db.copyClientLabelToQueue(clientId))

  ipcMain.handle('client-label:count', (_, clientId) => db.countClientLabels(clientId))

  /* ------------------------------------------------------------------
   * Admin / Stats
   * ------------------------------------------------------------------ */

  ipcMain.handle('stats:get-general', () => {
    const numClients = db.countClients()
    const numLabels = db.countLabels()
    const numUsers = db.countUsers()
    const diagnostics = db.getDiagnostics()
    const db_health = db.getHealthScore()
    const app_version = app.getVersion()
    const last_backup_date = db.lastBackupDate()
    return {
      clients: numClients,
      labels: numLabels,
      users: numUsers,
      diagnostics,
      db_health,
      app_version,
      last_backup_date
    }
  })

  ipcMain.handle('admin:get-db-backups', async () => {
    return await db.getBackups()
  })

  ipcMain.handle('admin:create-db-backup', async () => {
    return await db.createManualBackup()
  })

  ipcMain.handle('admin:last-db-backup', async () => {
    return await db.lastBackupDate()
  })

  ipcMain.handle('admin:download-backup', async (event, fileName) => {
    // 1. Ask user where to save the file
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Export Database Backup',
      defaultPath: join(app.getPath('downloads'), fileName),
      filters: [{ name: 'SQLite Database', extensions: ['db'] }]
    })

    if (canceled || !filePath) return { success: false }

    try {
      // 2. Copy the file from your internal backups folder to the user's choice
      await db.downloadBackup(fileName, filePath)
      return { success: true, path: filePath }
    } catch (error) {
      console.error('Export failed:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('admin:get-backup-key', async (event, fileName) => db.getBackupKey(fileName))

  ipcMain.handle('admin:remove-backup', async (event, fileName) => db.removeBackup(fileName))

  ipcMain.handle('admin:create-backup', async () => await db.createManualBackup())

  // Get export preview
  ipcMain.handle('admin:get-export-preview', async (event, options) => {
    try {
      const res = db.exportDataPreview(options)
      return { success: true, ...res }
    } catch (error) {
      console.error('Preview error:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('admin:import-csv-data', async (event, { table, data }) => {
    try {
      const res = await db.importCSVData(table, data)
      return { success: true, ...res }
    } catch (error) {
      console.error('CSV Import Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  })

  // Export data
  ipcMain.handle('admin:export-data', async (event, options) => {
    try {
      const {
        tables,
        format,
        includeHeaders,
        separateFiles,
        includeTimestamps,
        useDateFilter,
        dateFrom,
        dateTo
      } = options

      // Validate tables
      const allowedTables = ['labels', 'clients', 'client_labels', 'queue']
      const validTables = tables.filter((t) => allowedTables.includes(t))

      if (validTables.length === 0) {
        throw new Error('No valid tables selected')
      }

      // Show save dialog
      const dialogOptions = {
        title: 'Export Data',
        defaultPath: join(require('os').homedir(), 'Downloads', `database_export_${Date.now()}`),
        filters: []
      }

      if (separateFiles || validTables.length > 1) {
        dialogOptions.properties = ['createDirectory', 'showOverwriteConfirmation']
        dialogOptions.buttonLabel = 'Select Folder'
      } else {
        if (format === 'csv') {
          dialogOptions.filters.push({ name: 'CSV Files', extensions: ['csv'] })
        } else if (format === 'json') {
          dialogOptions.filters.push({ name: 'JSON Files', extensions: ['json'] })
        } else if (format === 'xlsx') {
          dialogOptions.filters.push({ name: 'Excel Files', extensions: ['xlsx'] })
        }
      }

      const { canceled, filePath } = await dialog.showSaveDialog(dialogOptions)

      if (canceled || !filePath) {
        return { success: false, error: 'Export cancelled' }
      }

      const exportedFiles = []

      // Export each table
      for (const tableName of validTables) {
        // Fetch data from database
        const data = db.fetchTableDataForExport(tableName, {
          includeTimestamps,
          useDateFilter,
          dateFrom,
          dateTo
        })

        // Determine output path
        let outputPath
        if (separateFiles) {
          if (!existsSync(filePath)) {
            mkdirSync(filePath, { recursive: true })
          }
          const ext = format === 'xlsx' ? 'xlsx' : format === 'json' ? 'json' : 'csv'
          outputPath = join(filePath, `${tableName}.${ext}`)
        } else {
          outputPath = filePath.endsWith(`.${format}`) ? filePath : `${filePath}.${format}`
        }

        // Write file
        writeExportFile(data, outputPath, format, {
          includeHeaders,
          tableName
        })

        exportedFiles.push(outputPath)
      }

      return {
        success: true,
        files: exportedFiles,
        message: `Successfully exported ${validTables.length} table(s)`
      }
    } catch (error) {
      console.error('Export error:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('admin:get-backup-settings', async () => {
    const nextScheduledBackup = db.backupManager.nextScheduledRun()
    console.log({ ...db.backupManager.settings, nextScheduledBackup })
    return { ...db.backupManager.settings, nextScheduledBackup }
  })

  /* ------------------------------------------------------------------
   * Misc
   * ------------------------------------------------------------------ */

  ipcMain.on('ping', () => console.log('pong'))
}

async function setupApp(data) {
  // Verify license
  const licenseResponse = verifyLicense(data.license)

  if (!licenseResponse.valid) {
    return {
      valid: false,
      reason: licenseResponse.reason
    }
  }

  const { payload } = licenseResponse

  // Add admin (only if none exists)
  const adminKey = await hashMasterPassword(payload.secret)
  await db.addAdminUserIfNoneExist(adminKey)

  // Add manager
  const { manager } = data
  const managerPasswordHash = await hashMasterPassword(manager.password)

  await db.createUser(
    manager.name,
    manager.email,
    managerPasswordHash,
    'manager',
    manager.position || null
  )

  // Save facility + system defaults
  const settings = {
    facility_name: payload.facility_name,
    facility_contact: payload.facility_contact,
    facility_address: payload.facility_address,
    alert_sound: data.defaults.alert_sound,
    queue_size: data.defaults.queue_size,
    date_format: data.defaults.date_format
  }

  await db.saveSettings(settings, 'admin')

  await db.setUpLabelsData()

  SETTINGS = db.fetchSettings()

  return {
    valid: true,
    payload: {
      facility_name: payload.facility_name,
      facility_contact: payload.facility_contact,
      facility_address: payload.facility_address
    }
  }
}

// Cleanup
app.on('before-quit', printerShutdown)

app.on('window-all-closed', () => {
  printerShutdown()
  if (process.platform !== 'darwin') app.quit()
})
