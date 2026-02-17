import Database from 'better-sqlite3-multiple-ciphers'
import { join } from 'path'
import { app, safeStorage } from 'electron'
import Store from 'electron-store'
import { randomBytes } from 'node:crypto'
import { mkdirSync, existsSync, unlinkSync, statSync, renameSync, copyFileSync } from 'fs'
import { copyFile } from 'fs/promises'
import log from './logger'
import { LABEL_INIT_DATA } from './labels_data_init'

const store = new Store()

const DEFAULT_BACKUP_SETTINGS = {
  auto: {
    enabled: true,
    frequency: 'hourly',
    maxCount: 2,
    lastRun: null
  },
  manual: {
    maxCount: 2
  }
}

// backupScheduler.js
export function getNextRun(frequency, from = Date.now()) {
  const base = new Date(from)

  switch (frequency) {
    case 'hourly':
      base.setHours(base.getHours() + 1)
      break
    case 'daily':
      base.setDate(base.getDate() + 1)
      break
    case 'weekly':
      base.setDate(base.getDate() + 7)
      break
    case 'monthly':
      base.setMonth(base.getMonth() + 1)
      break
    default:
      base.setDate(base.getDate() + 1)
  }

  return base.getTime()
}

/* ==================================================================
 * ENCRYPTION KEY MANAGEMENT
 * ================================================================== */

function getEncryptionKey() {
  log.debug('Attempting to retrieve encryption key')

  if (!safeStorage.isEncryptionAvailable()) {
    log.error('OS-level encryption not available')
    throw new Error('OS-level encryption not available')
  }

  const encryptedHex = store.get('db_key')
  if (encryptedHex) {
    log.debug('Existing encryption key found, decrypting')
    return safeStorage.decryptString(Buffer.from(encryptedHex, 'hex'))
  }

  log.info('No encryption key found, generating new key')
  const key = randomBytes(32).toString('hex')
  const encrypted = safeStorage.encryptString(key)
  store.set('db_key', encrypted.toString('hex'))
  log.info('New encryption key generated and stored')

  return key
}

/* ==================================================================
 * BACKUP MANAGEMENT CLASS
 * ================================================================== */

export class BackupManager {
  constructor(dbPath, encryptionKey, db) {
    this.dbPath = dbPath
    this.db = db
    this.encryptionKey = encryptionKey
    this.backupDir = join(app.getPath('userData'), 'backups')
    this.timer = null

    log.info('BackupManager initialized', {
      dbPath,
      backupDir: this.backupDir
    })

    this.ensureDefaults()
    this.scheduleNext()
  }

  get settings() {
    return store.get('backup_settings')
  }

  set settings(value) {
    store.set('backup_settings', value)
    log.debug('Backup settings updated', value)
  }

  ensureDefaults() {
    if (!store.has('backup_settings')) {
      store.set('backup_settings', DEFAULT_BACKUP_SETTINGS)
      log.info('Default backup settings initialized')
    }
  }

  scheduleNext() {
    const { auto } = this.settings
    if (!auto.enabled) {
      log.debug('Auto backup is disabled, skipping scheduling')
      return
    }

    const last = auto.lastRun ? new Date(auto.lastRun).getTime() : Date.now()
    const nextRun = getNextRun(auto.frequency, last)
    const delay = Math.max(1000, nextRun - Date.now())

    if (this.timer) clearTimeout(this.timer)

    log.info('Next auto backup scheduled', {
      frequency: auto.frequency,
      nextRun: new Date(nextRun).toISOString(),
      delayMs: delay
    })

    this.timer = setTimeout(async () => {
      log.info('Auto backup triggered')
      try {
        const backupPath = await this.createBackup(this.db, 'auto')
        log.info('Auto backup completed successfully', { backupPath })

        this.settings = {
          ...this.settings,
          auto: {
            ...this.settings.auto,
            lastRun: new Date().toISOString()
          }
        }
      } catch (err) {
        log.error('Auto backup failed', {
          error: err.message,
          stack: err.stack
        })
      } finally {
        this.scheduleNext()
      }
    }, delay)
  }

  /**
   * Pause automatic backups without changing user settings
   */
  pauseAutoBackup() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
      log.info('Auto backup paused')
    }
  }

  /**
   * Reset backup settings to defaults
   * Stops scheduler and reinitializes state
   */
  resetBackupSettings() {
    log.info('Resetting backup settings to defaults')
    this.pauseAutoBackup()
    store.set('backup_settings', DEFAULT_BACKUP_SETTINGS)
    this.scheduleNext()
  }

  /**
   * Resume automatic backups using existing settings
   */
  resumeAutoBackup() {
    const { auto } = this.settings

    if (!auto.enabled) {
      log.debug('Cannot resume auto backup - it is disabled in settings')
      return
    }

    // Prevent duplicate timers
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    log.info('Resuming auto backup')
    this.scheduleNext()
  }

  /**
   * Returns the next scheduled auto-backup time
   * @returns {null | { timestamp: number, iso: string }}
   */
  nextScheduledRun() {
    const { auto } = this.settings

    if (!auto.enabled) return null

    const last = auto.lastRun ? new Date(auto.lastRun).getTime() : Date.now()
    const next = getNextRun(auto.frequency, last)

    return {
      timestamp: next,
      iso: new Date(next).toISOString()
    }
  }

  /**
   * Saves encrypted backup key to store
   */
  saveBackupKey(fileName, rawKey) {
    const encrypted = safeStorage.encryptString(rawKey)
    store.set(`backup_keys.${fileName}`, encrypted.toString('hex'))
    log.debug('Backup key saved', { fileName })
  }

  /**
   * Retrieves and decrypts backup key from store
   */
  getBackupKey(fileName) {
    const hex = store.get(`backup_keys.${fileName}`)
    if (!hex) {
      log.warn('Backup key not found', { fileName })
      return null
    }
    log.debug('Backup key retrieved', { fileName })
    return safeStorage.decryptString(Buffer.from(hex, 'hex'))
  }

  /**
   * Generates timestamped backup filename
   */
  generateBackupName(type) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    return `rxlabel-backup_${ts}_${type}`
  }

  /**
   * Formats bytes to human-readable size
   */
  formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i]
  }

  /**
   * Enforces backup retention limits (2 auto, 1 manual)
   * Runs AFTER new backup is created to maintain integrity
   */
  enforceBackupRetention(type) {
    const meta = store.get('backup_meta') || {}
    const entries = Object.entries(meta)
      .filter(([, v]) => v.type === type)
      .sort((a, b) => new Date(a[1].createdAt) - new Date(b[1].createdAt))

    const limit = type === 'auto' ? this.settings.auto.maxCount : this.settings.manual.maxCount

    log.debug('Enforcing backup retention', {
      type,
      currentCount: entries.length,
      limit
    })

    // Remove oldest backups until we're at or below the limit
    while (entries.length > limit) {
      const [file] = entries.shift()
      const path = join(this.backupDir, file)

      if (existsSync(path)) {
        unlinkSync(path)
        log.info('Old backup removed due to retention policy', {
          file,
          type
        })
      }
      store.delete(`backup_keys.${file}`)
      delete meta[file]
    }

    store.set('backup_meta', meta)
  }

  /**
   * Creates an encrypted backup of the database
   * Creates new backup FIRST, then removes old ones to maintain integrity
   * @param {Database} db - The database instance to backup
   * @param {string} type - Backup type ('auto' or 'manual')
   * @returns {Promise<string>} Path to the created backup file
   */
  async createBackup(db, type = 'auto') {
    log.info('Starting backup creation', { type })

    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true })
      log.info('Backup directory created', { backupDir: this.backupDir })
    }

    const baseName = this.generateBackupName(type)
    const tempPath = join(this.backupDir, `${baseName}.db`)

    try {
      // Ensure WAL is checkpointed
      log.debug('Checkpointing WAL')
      db.pragma('wal_checkpoint(FULL)')

      // Create encrypted file copy
      log.debug('Copying database file', {
        from: this.dbPath,
        to: tempPath
      })
      copyFileSync(this.dbPath, tempPath)

      const sizeBytes = statSync(tempPath).size
      const finalName = `${baseName}_${(sizeBytes / 1e6).toFixed(2)}MB.db`
      const finalPath = join(this.backupDir, finalName)

      log.debug('Renaming backup file', {
        from: tempPath,
        to: finalPath
      })
      renameSync(tempPath, finalPath)

      // Save the encryption key for this backup
      this.saveBackupKey(finalName, this.encryptionKey)

      // Update metadata
      const meta = store.get('backup_meta') || {}
      meta[finalName] = {
        type,
        createdAt: new Date().toISOString(),
        sizeBytes
      }
      store.set('backup_meta', meta)

      log.info('Backup created successfully', {
        fileName: finalName,
        type,
        size: this.formatBytes(sizeBytes),
        path: finalPath
      })

      // Enforce retention AFTER successful backup creation
      this.enforceBackupRetention(type)

      return finalPath
    } catch (error) {
      log.error('Backup creation failed', {
        type,
        error: error.message,
        stack: error.stack
      })

      // Clean up failed backup attempt
      if (existsSync(tempPath)) {
        unlinkSync(tempPath)
        log.debug('Cleaned up failed backup temp file', { tempPath })
      }
      throw error
    }
  }

  /**
   * Gets list of all backups with metadata
   * @returns {Array} Array of backup objects sorted by creation date
   */
  getBackupsList() {
    const meta = store.get('backup_meta') || {}
    const backups = Object.entries(meta)
      .map(([fileName, info]) => {
        const fullPath = join(this.backupDir, fileName)
        const existsOnDisk = existsSync(fullPath)

        if (!existsOnDisk) {
          log.warn('Backup file in metadata but missing from disk', {
            fileName
          })
        }

        return {
          fileName,
          type: info.type,
          createdAt: info.createdAt,
          sizeBytes: info.sizeBytes,
          sizeReadable: this.formatBytes(info.sizeBytes),
          existsOnDisk
        }
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    log.debug('Retrieved backups list', { count: backups.length })
    return backups
  }

  /**
   * Removes a specific backup file
   * @param {string} fileName - Name of the backup file to remove
   */
  removeBackup(fileName) {
    log.info('Removing backup', { fileName })
    const path = join(this.backupDir, fileName)

    // Remove file from disk
    if (existsSync(path)) {
      unlinkSync(path)
      log.debug('Backup file deleted from disk', { path })
    }

    // Remove encryption key
    store.delete(`backup_keys.${fileName}`)

    // Remove from metadata
    const meta = store.get('backup_meta') || {}
    delete meta[fileName]
    store.set('backup_meta', meta)

    log.info('Backup removed successfully', { fileName })
  }

  /**
   * Removes all backup files
   */
  removeAllBackups() {
    log.info('Removing all backups')
    const meta = store.get('backup_meta') || {}
    const count = Object.keys(meta).length

    // Remove all backup files
    Object.keys(meta).forEach((fileName) => {
      const path = join(this.backupDir, fileName)
      if (existsSync(path)) {
        unlinkSync(path)
      }
      store.delete(`backup_keys.${fileName}`)
    })

    // Clear all metadata
    store.set('backup_meta', {})
    log.info('All backups removed', { count })
  }

  /**
   * Updates encryption key for future backups
   * @param {string} newKey - New encryption key
   */
  updateEncryptionKey(newKey) {
    log.info('Updating encryption key for future backups')
    this.encryptionKey = newKey
  }

  /**
   * Gets the date/time of the most recent backup (auto or manual)
   * @returns {string|null} ISO datetime string of last backup, or null if no backups exist
   */
  lastBackupDate() {
    const meta = store.get('backup_meta') || {}
    const entries = Object.entries(meta)

    if (entries.length === 0) return null

    // Sort by creation date descending and get the most recent
    const mostRecent = entries.sort(
      (a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt)
    )[0]

    return mostRecent[1].createdAt
  }

  /**
   * Calculates total size of all backups
   * @returns {Object} Object containing total size in bytes and human-readable format
   */
  totalBackupSize() {
    const meta = store.get('backup_meta') || {}
    const totalBytes = Object.values(meta).reduce((sum, backup) => {
      return sum + (backup.sizeBytes || 0)
    }, 0)

    return {
      bytes: totalBytes,
      readable: this.formatBytes(totalBytes)
    }
  }

  /**
   * Download backup of a database
   * @param {string} filename - The name of the backup to be copied
   * @param {string} desination - The destination where the backup will be copied to
   * @returns {void}
   */
  async downloadBackup(filename, desination) {
    log.info('Downloading backup', { filename, desination })
    try {
      const fullPath = join(this.backupDir, filename)
      await copyFile(fullPath, desination)
      log.info('Backup downloaded successfully', {
        filename,
        desination
      })
    } catch (error) {
      log.error('Backup download failed', {
        filename,
        desination,
        error: error.message
      })
      throw error
    }
  }
}

/* ==================================================================
 * MAIN DATABASE CLASS
 * ================================================================== */

export class AppDatabase {
  constructor() {
    const dbPath = join(app.getPath('userData'), 'rxlabel.db')
    this.dbPath = dbPath
    this.encryptionKey = getEncryptionKey()

    log.info('Initializing AppDatabase', { dbPath })

    // Initialize database connection
    try {
      this.db = new Database(dbPath)
      this.db.pragma("cipher='sqlcipher'")
      // this.db.pragma(`key='${this.encryptionKey}'`)
      this.db.pragma(`key='your-secret-password'`)
      this.db.pragma('foreign_keys = ON')
      log.info('Database connection established successfully')
    } catch (error) {
      log.error('Failed to initialize database', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }

    // Initialize backup manager
    this.backupManager = new BackupManager(dbPath, this.encryptionKey, this.db)

    // Configuration
    this.addAdminOnlyEditSettings = ['facility_name', 'facility_address', 'facility_contact']

    // Setup database
    this.init()
    this.prepareStatements()
  }

  /* ------------------------------------------------------------------
   * DATABASE ENCRYPTION & KEY MANAGEMENT
   * ------------------------------------------------------------------ */

  /**
   * Changes the database encryption key
   * @param {string} newKey - Optional manual key, else generates a new random one
   * @returns {boolean} Success status
   */
  rekey(newKey = null) {
    const nextKey = newKey || randomBytes(32).toString('hex')
    log.info('Rekeying database')

    try {
      this.db.pragma('journal_mode = DELETE')
      this.db.pragma(`rekey='${nextKey}'`)

      const encrypted = safeStorage.encryptString(nextKey)
      store.set('db_key', encrypted.toString('hex'))

      this.encryptionKey = nextKey
      this.backupManager.updateEncryptionKey(nextKey)

      this.db.pragma('journal_mode = WAL')
      log.info('Database rekeyed successfully')
      return true
    } catch (err) {
      log.error('Database rekey failed', {
        error: err.message,
        stack: err.stack
      })
      this.db.pragma('journal_mode = WAL')
      throw err
    }
  }

  /**
   * Gets encryption key (admin only)
   * @param {string} role - User role
   * @returns {string} Encryption key
   */
  dbEncryptionKey(role = 'admin') {
    if (role !== 'admin') {
      log.warn('Unauthorized attempt to access encryption key', { role })
      throw new Error('Unauthorized access to encryption key.')
    }
    log.debug('Encryption key accessed', { role })
    return this.encryptionKey
  }

  /* ------------------------------------------------------------------
   * DATABASE HEALTH & DIAGNOSTICS & OPTIMIZATION
   * ------------------------------------------------------------------ */

  /**
   * Calculates database health score (0-100)
   * @returns {Object} Health score, status, and recommendations
   */
  getHealthScore() {
    log.debug('Calculating database health score')
    const diag = this.getDiagnostics()
    let score = 0

    // 1. Integrity Check (Crucial) - 50 Points
    const integrity = this.db.pragma('integrity_check', { simple: true })
    if (integrity === 'ok') score += 50

    // 2. Efficiency Check (Bloat) - 30 Points
    const utilizationRatio =
      diag.fileSize.total > 0 ? diag.fileSize.actualData / diag.fileSize.total : 1
    score += Math.max(0, Math.floor(utilizationRatio * 30))

    // 3. Configuration Check - 20 Points
    if (diag.software.journalMode === 'wal') score += 10
    if (this.db.pragma('foreign_keys', { simple: true }) === 1) score += 10

    const result = {
      score,
      status: score > 85 ? 'Healthy' : score > 60 ? 'Degraded' : 'Critical',
      recommendations: this.getRecommendations(score, diag, integrity)
    }

    log.info('Database health score calculated', result)
    return result
  }

  /**
   * Generates health recommendations based on diagnostics
   * @returns {Array} List of recommendations
   */
  getRecommendations(score, diag, integrity) {
    const recs = []
    if (integrity !== 'ok')
      recs.push('CRITICAL: Database corruption detected. Restore from backup.')
    if (diag.fileSize.unused > 10 * 1024 * 1024)
      recs.push('Run VACUUM to reclaim over 10MB of wasted space.')
    if (diag.software.journalMode !== 'wal') recs.push('Enable WAL mode for better concurrency.')
    return recs
  }

  /**
   * Retrieves comprehensive database metadata and performance statistics
   * @returns {Object} Database diagnostics
   */
  getDiagnostics() {
    log.debug('Retrieving database diagnostics')
    try {
      // Calculate database size metrics
      const stats = this.db
        .prepare(
          `
          SELECT
            (page_count * page_size) AS totalSizeBytes,
            (freelist_count * page_size) AS freeSizeBytes,
            page_size AS pageSize,
            page_count AS pageCount
          FROM pragma_page_count(), pragma_page_size(), pragma_freelist_count()
        `
        )
        .get()

      // Retrieve version and environment metadata
      const sqliteVersion = this.db.prepare('SELECT sqlite_version() AS version').get().version
      const journalMode = this.db.pragma('journal_mode', {
        simple: true
      })

      // Retrieve encryption-specific data
      const activeCipher = this.db.pragma('cipher', { simple: true }) || 'none'

      const diagnostics = {
        fileSize: {
          total: stats.totalSizeBytes,
          unused: stats.freeSizeBytes,
          actualData: stats.totalSizeBytes - stats.freeSizeBytes,
          readable: (stats.totalSizeBytes / (1024 * 1024)).toFixed(2) + ' MB'
        },
        software: {
          sqlite: sqliteVersion,
          cipher: activeCipher || 'none',
          journalMode: journalMode
        },
        schema: {
          userVersion: this.db.pragma('user_version', {
            simple: true
          }),
          pageSize: stats.pageSize,
          totalPages: stats.pageCount
        }
      }

      log.debug('Database diagnostics retrieved', diagnostics)
      return diagnostics
    } catch (error) {
      log.error('Failed to retrieve diagnostics', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  /* ------------------------------------------------------------------
   * DATABASE OPTIMIZATION
   * ------------------------------------------------------------------ */

  /**
   * Runs a comprehensive suite of optimizations.
   * Best used on app close or during scheduled maintenance.
   */
  optimize() {
    log.info('Starting database optimization')
    const startTime = Date.now()

    try {
      // Get initial database size for comparison
      const beforeDiag = this.getDiagnostics()
      const initialSize = beforeDiag.fileSize.total

      log.info('Database state before optimization', {
        totalSize: beforeDiag.fileSize.readable,
        unusedSpace: beforeDiag.fileSize.unused,
        utilizationRatio:
          ((beforeDiag.fileSize.actualData / beforeDiag.fileSize.total) * 100).toFixed(2) + '%'
      })

      // 1. Analyze tables to update query planner statistics
      // This makes sure your indexes are actually being used efficiently
      log.debug('Running PRAGMA optimize')
      this.db.pragma('optimize')
      log.info('Query planner statistics updated successfully')

      // 2. Rebuild the entire database to remove fragmentation and shrink the file
      // Note: VACUUM requires extra disk space (approx. size of the DB)
      log.debug('Running VACUUM - this may take a while')
      const vacuumStart = Date.now()
      this.db.pragma('vacuum')
      const vacuumDuration = Date.now() - vacuumStart
      log.info('Database vacuumed successfully', {
        durationMs: vacuumDuration,
        durationSec: (vacuumDuration / 1000).toFixed(2)
      })

      // 3. Update internal indices for all tables
      log.debug('Running PRAGMA analyze')
      this.db.pragma('analyze')
      log.info('Database statistics analyzed successfully')

      // Get final database size
      const afterDiag = this.getDiagnostics()
      const finalSize = afterDiag.fileSize.total
      const spaceSaved = initialSize - finalSize
      const totalDuration = Date.now() - startTime

      const result = {
        success: true,
        timestamp: new Date().toISOString(),
        metrics: {
          durationMs: totalDuration,
          durationSec: (totalDuration / 1000).toFixed(2),
          beforeSize: beforeDiag.fileSize.readable,
          afterSize: afterDiag.fileSize.readable,
          spaceSaved: (spaceSaved / (1024 * 1024)).toFixed(2) + ' MB',
          spaceSavedBytes: spaceSaved,
          compressionRatio:
            initialSize > 0 ? ((spaceSaved / initialSize) * 100).toFixed(2) + '%' : '0%'
        }
      }

      log.info('Database optimization completed successfully', result.metrics)

      return result
    } catch (error) {
      const duration = Date.now() - startTime

      log.error('Database optimization failed', {
        error: error.message,
        stack: error.stack,
        durationMs: duration,
        stage: this.identifyOptimizationStage(error)
      })

      throw error
    }
  }

  /**
   * Helper to identify which optimization stage failed
   * @private
   */
  identifyOptimizationStage(error) {
    const msg = error.message?.toLowerCase() || ''

    if (msg.includes('vacuum')) return 'VACUUM'
    if (msg.includes('analyze')) return 'ANALYZE'
    if (msg.includes('optimize')) return 'OPTIMIZE'

    return 'UNKNOWN'
  }

  /* ------------------------------------------------------------------
   * BACKUP OPERATIONS
   * ------------------------------------------------------------------ */

  /**
   * Creates a manual backup
   * @returns {Promise<string>} Path to backup file
   */
  async createManualBackup() {
    log.info('Manual backup requested')
    return await this.backupManager.createBackup(this.db, 'manual')
  }

  /**
   * Creates an automatic backup
   * @returns {Promise<string>} Path to backup file
   */
  async createAutoBackup() {
    log.info('Auto backup requested')
    return await this.backupManager.createBackup(this.db, 'auto')
  }

  /**
   * Gets list of all backups
   * @returns {Array} List of backups
   */
  getBackups() {
    return this.backupManager.getBackupsList()
  }

  /**
   * Removes a specific backup
   * @param {string} fileName - Backup file name
   */
  removeBackup(fileName) {
    this.backupManager.removeBackup(fileName)
  }

  /**
   * Removes all backups
   */
  removeAllBackups() {
    this.backupManager.removeAllBackups()
  }

  /**
   * Gets encryption key for a specific backup
   * @param {string} fileName - Backup file name
   * @returns {string|null} Backup encryption key
   */
  getBackupKey(fileName) {
    return this.backupManager.getBackupKey(fileName)
  }

  /**
   * Gets the date/time of the most recent backup
   * @returns {string|null} ISO datetime string of last backup
   */
  lastBackupDate() {
    return this.backupManager.lastBackupDate()
  }

  /**
   * Gets total size of all backups
   * @returns {Object} Object with bytes and readable properties
   */
  totalBackupSize() {
    return this.backupManager.totalBackupSize()
  }

  /**
   * Download backup of a database
   * @param {string} filename - The name of the backup to be copied
   * @param {string} desination - The destination where the backup will be copied to
   * @returns {void}
   */
  async downloadBackup(filename, desination) {
    await this.backupManager.downloadBackup(filename, desination)
  }

  /* ------------------------------------------------------------------
   * SCHEMA INITIALIZATION
   * ------------------------------------------------------------------ */

  init() {
    log.info('Initializing database schema')
    try {
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE,
          secret TEXT NOT NULL,
          role TEXT CHECK(role IN ('admin','manager','user')) DEFAULT 'user',
          position TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          facility_name TEXT NOT NULL,
          facility_address TEXT NOT NULL,
          facility_contact TEXT NOT NULL,
          queue_size INTEGER DEFAULT 100,
          date_format TEXT,
          alert_sound INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS labels (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product TEXT NOT NULL,
          instructions TEXT,
          warning TEXT,
          is_custom INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          contact TEXT,
          email TEXT,
          home_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS client_labels (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          product TEXT NOT NULL,
          instructions TEXT,
          warning TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (client_id) REFERENCES clients(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product TEXT NOT NULL,
          instructions TEXT,
          warning TEXT,
          client TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `)
      log.info('Database schema initialized successfully')
    } catch (error) {
      log.error('Failed to initialize database schema', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  /* ------------------------------------------------------------------
   * PREPARED STATEMENTS
   * ------------------------------------------------------------------ */

  prepareStatements() {
    log.debug('Preparing SQL statements')
    try {
      /* ---------- USERS ---------- */
      this.addUser = this.db.prepare(`
        INSERT INTO users (name, email, secret, role, position)
        VALUES (?, ?, ?, ?, ?)
      `)

      this.updateUserQ = this.db.prepare(`
        UPDATE users
        SET name = ?, email = ?, role = ?, position = ?
        WHERE id = ?
      `)

      this.getAllUsers = this.db.prepare(`
        SELECT id, name, email, role, position, created_at
        FROM users
        WHERE role != 'admin'
        ORDER BY created_at DESC
      `)

      this.getAllUsersForAdmin = this.db.prepare(`
        SELECT id, name, email, role, position, created_at
        FROM users
        ORDER BY created_at DESC
      `)

      this.getUserLogin = this.db.prepare('SELECT * FROM users WHERE name = ?')

      this.deleteUserQ = this.db.prepare("DELETE FROM users WHERE id = ? AND role != 'admin'")

      this.changeUserPasswordQ = this.db.prepare(`UPDATE users SET secret = ? WHERE id = ?`)

      this.countUsersQ = this.db.prepare('SELECT COUNT(*) AS count FROM users')

      /* ---------- SETTINGS ---------- */
      this.getSettings = this.db.prepare('SELECT * FROM settings LIMIT 1')

      this.saveSettingsStmt = this.db.prepare(`
        INSERT INTO settings (
          id,
          facility_name, facility_address, facility_contact,
          date_format, queue_size, alert_sound
        ) VALUES (
          1,
          COALESCE(@facility_name, 'New Facility'),
          COALESCE(@facility_address, 'Address'),
          COALESCE(@facility_contact, 'Contact'),
          @date_format,
          @queue_size,
          @alert_sound
        )
        ON CONFLICT(id) DO UPDATE SET
          facility_name = COALESCE(@facility_name, facility_name),
          facility_address = COALESCE(@facility_address, facility_address),
          facility_contact = COALESCE(@facility_contact, facility_contact),
          date_format = COALESCE(@date_format, date_format),
          queue_size = COALESCE(@queue_size, queue_size),
          alert_sound = COALESCE(@alert_sound, alert_sound)
      `)

      this.checkSetup = this.db.prepare(`
        SELECT (
          EXISTS (SELECT 1 FROM settings WHERE facility_name IS NOT NULL AND facility_name != '') AND
          EXISTS (SELECT 1 FROM users WHERE role = 'admin')
        ) AS is_setup_complete
      `)

      /* ---------- LABELS ---------- */
      this.addLabel = this.db.prepare(`
        INSERT INTO labels (product, instructions, warning, is_custom)
        VALUES (?, ?, ?, ?)
      `)

      this.getLabels = this.db.prepare('SELECT * FROM labels ORDER BY product ASC')

      this.searchLabels = this.db.prepare(`
        SELECT * FROM labels
        WHERE product LIKE ?
        ORDER BY product ASC
      `)

      this.updateLabelQ = this.db.prepare(`
        UPDATE labels
        SET product = ?, instructions = ?, warning = ?, is_custom = ?
        WHERE id = ?
      `)

      this.deleteLabelQ = this.db.prepare('DELETE FROM labels WHERE id = ?')

      this.countLabelsQ = this.db.prepare('SELECT COUNT(*) AS count FROM labels')

      /* ---------- CLIENTS ---------- */
      this.addClient = this.db.prepare(`
        INSERT INTO clients (name, contact, email, home_address)
        VALUES (?, ?, ?, ?)
      `)

      this.updateClientQ = this.db.prepare(`
        UPDATE clients
        SET name = ?, contact = ?, email = ?, home_address = ?
        WHERE id = ?
      `)

      this.getClients = this.db.prepare('SELECT * FROM clients ORDER BY created_at DESC')

      this.getClientByIdQ = this.db.prepare('SELECT * FROM clients WHERE id = ?')

      this.deleteClientQ = this.db.prepare('DELETE FROM clients WHERE id = ?')

      this.countClientsQ = this.db.prepare('SELECT COUNT(*) AS count FROM clients')

      /* ---------- CLIENT LABELS ---------- */
      this.addClientLabel = this.db.prepare(`
        INSERT INTO client_labels (client_id, product, instructions, warning)
        VALUES (?, ?, ?, ?)
      `)

      this.addClientLabels = this.db.transaction((client_labels) => {
        for (const label of client_labels) {
          this.addClientLabel.run(label.client_id, label.product, label.instructions, label.warning)
        }
      })

      this.copyClientLabelToQueueQ = this.db.prepare(`
        INSERT INTO queue (product, instructions, warning, client)
        SELECT cl.product, cl.instructions, cl.warning, c.name
        FROM client_labels cl
        INNER JOIN clients c ON cl.client_id = c.id
        WHERE cl.client_id = ?
      `)

      this.updateClientLabelQ = this.db.prepare(`
        UPDATE client_labels
        SET product = ?, instructions = ?, warning = ?
        WHERE id = ?
      `)

      this.getClientLabelsQ = this.db.prepare(`
        SELECT *
        FROM client_labels
        WHERE client_id = ?
        ORDER BY created_at DESC
      `)

      this.countClientLabelsQ = this.db.prepare(
        'SELECT COUNT(*) AS count FROM client_labels WHERE client_id = ?'
      )

      this.deleteClientLabelQ = this.db.prepare('DELETE FROM client_labels WHERE id = ?')

      /* ---------- QUEUE ---------- */
      this.addToQueueQ = this.db.prepare(`
        INSERT INTO queue (product, instructions, warning, client)
        VALUES (?, ?, ?, ?)
      `)

      this.getQueueQ = this.db.prepare('SELECT * FROM queue ORDER BY created_at ASC')

      this.removeFromQueueQ = this.db.prepare('DELETE FROM queue WHERE id = ?')

      this.clearQueueQ = this.db.prepare('DELETE FROM queue')

      this.countQueueQ = this.db.prepare('SELECT COUNT(*) AS count FROM queue')

      log.debug('SQL statements prepared successfully')
    } catch (error) {
      log.error('Failed to prepare SQL statements', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  /* ------------------------------------------------------------------
   * PUBLIC API - USERS
   * ------------------------------------------------------------------ */

  createUser(name, email, secret, role = 'user', position = null) {
    log.info('Creating user', { name, role, position })
    try {
      const result = this.addUser.run(name, email, secret, role, position)
      log.info('User created successfully', {
        name,
        userId: result.lastInsertRowid
      })
      return result
    } catch (error) {
      log.error('Failed to create user', { name, error: error.message })
      throw error
    }
  }

  updateUser(id, name, email, role = 'user', position = null) {
    log.info('Updating user', { id, name, role, position })
    try {
      const result = this.updateUserQ.run(name, email, role, position, id)
      log.info('User update successfully', {
        name,
        userId: id
      })
      return result
    } catch (error) {
      log.error('Failed to update user', { id, name, error: error.message })
      throw error
    }
  }

  getUsers(role = 'manager') {
    log.debug('Fetching users', { requestedByRole: role })
    if (role === 'admin') {
      return this.getAllUsersForAdmin.all()
    }
    return this.getAllUsers.all()
  }

  getUserForLogin(name) {
    log.debug('Fetching user for login', { name })
    return this.getUserLogin.get(name)
  }

  changeUserPassword(id, newPassword) {
    log.info('Changing user password', { userId: id })
    try {
      const result = this.changeUserPasswordQ.run(newPassword, id)
      log.info('User password changed successfully', { userId: id })
      return result
    } catch (error) {
      log.error('Failed to change user password', {
        userId: id,
        error: error.message
      })
      throw error
    }
  }

  deleteUser(id) {
    log.info('Deleting user', { userId: id })
    try {
      const result = this.deleteUserQ.run(id)
      log.info('User deleted successfully', { userId: id })
      return result
    } catch (error) {
      log.error('Failed to delete user', {
        userId: id,
        error: error.message
      })
      throw error
    }
  }

  addAdminUserIfNoneExist(secret) {
    const row = this.db.prepare('SELECT COUNT(*) AS count FROM users WHERE role = ?').get('admin')

    if (row.count === 0) {
      log.info('No admin user found, creating default admin')
      this.createUser('admin', 'admin@example.com', secret, 'admin', 'System Administrator')
    }
  }

  countUsers() {
    return this.countUsersQ.get().count
  }

  /* ------------------------------------------------------------------
   * PUBLIC API - SETTINGS
   * ------------------------------------------------------------------ */

  saveSettings(data, role = 'user') {
    log.info('Saving settings', { role })
    const adminFields = ['facility_name', 'facility_address', 'facility_contact']
    const allFields = [...adminFields, 'date_format', 'queue_size', 'alert_sound']

    // Role Security: Nullify admin fields if user isn't admin
    if (role !== 'admin') {
      adminFields.forEach((field) => {
        data[field] = null
      })
    }

    // Param Padding: Better-sqlite3 needs every @key to exist in the object
    allFields.forEach((field) => {
      if (!(field in data)) data[field] = null
    })

    try {
      const result = this.saveSettingsStmt.run(data)
      log.info('Settings saved successfully', { role })
      return result
    } catch (error) {
      log.error('Failed to save settings', {
        role,
        error: error.message
      })
      throw error
    }
  }

  fetchSettings() {
    return this.getSettings.get()
  }

  isSetupComplete() {
    const row = this.checkSetup.get()
    return row.is_setup_complete === 1
  }

  setUpLabelsData() {
    this.db.exec(LABEL_INIT_DATA)
  }

  /* ------------------------------------------------------------------
   * PUBLIC API - LABELS
   * ------------------------------------------------------------------ */

  createLabel(product, instructions, warning, is_custom = 1) {
    log.debug('Creating label', { product })
    return this.addLabel.run(product, instructions, warning, is_custom)
  }

  fetchLabels(search = '') {
    return search ? this.searchLabels.all(`%${search}%`) : this.getLabels.all()
  }

  updateLabel(id, product, instructions, warning, is_custom = 1) {
    log.debug('Updating label', { labelId: id, product })
    return this.updateLabelQ.run(product, instructions, warning, is_custom, id)
  }

  deleteLabel(id) {
    log.debug('Deleting label', { labelId: id })
    return this.deleteLabelQ.run(id)
  }

  countLabels() {
    return this.countLabelsQ.get().count
  }

  /* ------------------------------------------------------------------
   * PUBLIC API - CLIENTS
   * ------------------------------------------------------------------ */

  createClient(name, contact, email, home_address = null) {
    log.debug('Creating client', { name })
    return this.addClient.run(name, contact, email, home_address)
  }

  updateClient(id, name, contact, email, home_address = null) {
    log.debug('Updating client', { clientId: id, name })
    return this.updateClientQ.run(name, contact, email, home_address, id)
  }

  fetchClients() {
    return this.getClients.all()
  }

  getClientById(id) {
    return this.getClientByIdQ.get(id)
  }

  deleteClient(id) {
    log.debug('Deleting client', { clientId: id })
    return this.deleteClientQ.run(id)
  }

  countClients() {
    return this.countClientsQ.get().count
  }

  /* ------------------------------------------------------------------
   * PUBLIC API - CLIENT LABELS
   * ------------------------------------------------------------------ */

  createClientLabel(client_id, product, instructions, warning) {
    log.debug('Creating client label', { clientId: client_id, product })
    return this.addClientLabel.run(client_id, product, instructions, warning)
  }

  createClientLabels(client_labels) {
    log.debug('Creating multiple client labels', {
      count: client_labels.length
    })
    return this.addClientLabels(client_labels)
  }

  fetchClientLabels(client_id) {
    return this.getClientLabelsQ.all(client_id)
  }

  updateClientLabel(id, product, instructions, warning) {
    log.debug('Updating client label', { labelId: id, product })
    return this.updateClientLabelQ.run(product, instructions, warning, id)
  }

  deleteClientLabel(id) {
    log.debug('Deleting client label', { labelId: id })
    return this.deleteClientLabelQ.run(id)
  }

  countClientLabels(id) {
    const result = this.countClientLabelsQ.get(id)
    return result.count
  }

  copyClientLabelToQueue(id) {
    return this.copyClientLabelToQueueQ.run(id)
  }

  /* ------------------------------------------------------------------
   * PUBLIC API - QUEUE
   * ------------------------------------------------------------------ */

  pushToQueue(item) {
    log.debug('Pushing to queue', { product: item.product })
    return this.addToQueueQ.run(item.product, item.instructions, item.warning, item.client)
  }

  fetchQueue() {
    return this.getQueueQ.all()
  }

  popFromQueue(id) {
    log.debug('Removing from queue', { queueId: id })
    return this.removeFromQueueQ.run(id)
  }

  clearQueue() {
    log.info('Clearing entire queue')
    return this.clearQueueQ.run()
  }

  countQueue() {
    return this.countQueueQ.get().count
  }

  exportDataPreview(options) {
    const { table, limit = 5, includeTimestamps, dateFrom, dateTo } = options
    log.debug('Exporting data preview', { table, limit })

    // Validate table name
    const allowedTables = ['labels', 'clients', 'client_labels', 'queue']
    if (!allowedTables.includes(table)) {
      log.error('Invalid table name for export preview', { table })
      throw new Error('Invalid table name')
    }

    // Build query
    let query = `SELECT * FROM ${table}`
    const params = []

    // Add date filter if specified
    if (dateFrom && dateTo) {
      query += ` WHERE created_at BETWEEN ? AND ?`
      params.push(dateFrom, dateTo + ' 23:59:59')
    }

    query += ` LIMIT ?`
    params.push(limit)

    // Execute query
    const stmt = this.db.prepare(query)
    const data = stmt.all(...params)

    // Get columns
    let columns = data.length > 0 ? Object.keys(data[0]) : []

    // Remove timestamps if not included
    if (!includeTimestamps) {
      columns = columns.filter((col) => col !== 'created_at')
      data.forEach((row) => delete row.created_at)
    }
    return { data, columns }
  }

  importCSVData(table, data) {
    log.info('Importing CSV data', { table, rowCount: data.length })

    // Validate table name to prevent SQL injection
    try {
      const allowedTables = ['labels', 'clients', 'client_labels', 'queue']
      if (!allowedTables.includes(table)) {
        log.error('Invalid table name for import', { table })
        throw new Error('Invalid table name')
      }

      // Begin transaction for better performance
      this.db.exec('BEGIN TRANSACTION')

      let insertedCount = 0

      for (const row of data) {
        // Get column names and values
        const columns = Object.keys(row).filter((key) => row[key] !== undefined && row[key] !== '')
        const values = columns.map((col) => row[col])

        if (columns.length === 0) continue

        // Build INSERT query
        const placeholders = columns.map(() => '?').join(', ')
        const columnNames = columns.join(', ')
        const query = `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`

        // Execute insert
        const stmt = this.db.prepare(query)
        stmt.run(...values)

        insertedCount++
      }

      // Commit transaction
      this.db.exec('COMMIT')
      log.info('CSV import completed successfully', {
        table,
        rowsImported: insertedCount
      })

      return {
        rowsImported: insertedCount,
        table: table
      }
    } catch (error) {
      // Rollback on error
      this.db.exec('ROLLBACK')
      log.error('CSV import failed', {
        table,
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  fetchTableDataForExport(tableName, options = {}) {
    const {
      includeTimestamps = true,
      useDateFilter = false,
      dateFrom = null,
      dateTo = null
    } = options

    log.debug('Fetching table data for export', { tableName, options })

    // Validate table name
    const allowedTables = ['labels', 'clients', 'client_labels', 'queue']
    if (!allowedTables.includes(tableName)) {
      log.error('Invalid table name for export', { tableName })
      throw new Error('Invalid table name')
    }

    // Build query
    let query = `SELECT * FROM ${tableName}`
    const params = []

    // Add date filter
    if (useDateFilter && dateFrom && dateTo) {
      query += ` WHERE created_at BETWEEN ? AND ?`
      params.push(dateFrom, dateTo + ' 23:59:59')
    }

    // Execute query
    const stmt = this.db.prepare(query)
    let data = stmt.all(...params)

    // Remove timestamps if not included
    if (!includeTimestamps) {
      data = data.map((row) => {
        const { created_at, ...rest } = row
        return rest
      })
    }

    log.info('Table data fetched for export', {
      tableName,
      rowCount: data.length
    })

    return data
  }
}
