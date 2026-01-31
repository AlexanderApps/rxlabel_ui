import Database from 'better-sqlite3-multiple-ciphers'
import { join } from 'path'
import { app, safeStorage } from 'electron'
import Store from 'electron-store'
import { randomBytes } from 'node:crypto'
import { mkdirSync, existsSync } from 'fs'

const store = new Store()

// /**
//  * Saves a key for a specific backup file
//  * @param {string} fileName
//  * @param {string} rawKey
//  */
// function saveBackupKey(fileName, rawKey) {
//   const encrypted = safeStorage.encryptString(rawKey)
//   // Store in a nested object: { backups: { "backup-123.db": "HEX_DATA" } }
//   store.set(`backup_keys.${fileName}`, encrypted.toString('hex'))
// }

// /**
//  * Retrieves the key for a specific backup
//  */
// export function getBackupKey(fileName) {
//   const encryptedHex = store.get(`backup_keys.${fileName}`)
//   if (!encryptedHex) return null
//   return safeStorage.decryptString(Buffer.from(encryptedHex, 'hex'))
// }

// async backup(fileName = `backup-${Date.now()}.db`) {
//   const backupDir = join(app.getPath('userData'), 'backups');
//   if (!existsSync(backupDir)) mkdirSync(backupDir, { recursive: true });

//   const backupPath = join(backupDir, fileName);

//   try {
//     // Perform the hot backup
//     await this.db.backup(backupPath);

//     // CRITICAL: Save the current key associated with THIS filename
//     // Even if this.encryptionKey changes later, we can still open this backup
//     saveBackupKey(fileName, this.encryptionKey);

//     return backupPath;
//   } catch (error) {
//     console.error('Backup failed:', error);
//     throw error;
//   }
// }

// function openBackup(fileName) {
//   const backupPath = join(app.getPath('userData'), 'backups', fileName);
//   const backupKey = getBackupKey(fileName);

//   if (!backupKey) throw new Error("Key for this backup not found in local store.");

//   const backupDb = new Database(backupPath);
//   backupDb.pragma("cipher='sqlcipher'");
//   backupDb.pragma(`key='${backupKey}'`);

//   return backupDb;
// }

/**
 * Retrieves or generates a hardware-bound encryption key
 */
function getEncryptionKey() {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('OS-level encryption is not available on this device.')
  }

  const encryptedKeyHex = store.get('db_key')

  if (encryptedKeyHex) {
    return safeStorage.decryptString(Buffer.from(encryptedKeyHex, 'hex'))
  }

  const newKey = randomBytes(16).toString('hex')
  const encrypted = safeStorage.encryptString(newKey)
  store.set('db_key', encrypted.toString('hex'))

  return newKey
}

export class AppDatabase {
  constructor() {
    const dbPath = join(app.getPath('userData'), 'rxlabel.db')
    this.encryptionKey = getEncryptionKey()

    this.db = new Database(dbPath)
    this.db.pragma("cipher='sqlcipher'")
    // this.db.pragma(`key='${encryptionKey}'`)
    this.db.pragma(`key='your-secret-password'`)
    this.db.pragma('foreign_keys = ON')

    // this.store = store
    this.addAdminOnlyEditSettings = ['facility_name', 'facility_address', 'facility_contact']

    this.init()
    this.prepareStatements()
  }

  /**
   * Robustly changes the database encryption key
   * @param {string} newPassphrase - Optional manual key, else generates a new random one
   */
  rekey(newPassphrase = null) {
    const nextKey = newPassphrase || randomBytes(32).toString('hex')

    try {
      // 1. Rekeying cannot happen in WAL mode with this library
      this.db.pragma('journal_mode = DELETE')

      // 2. Apply the new key to the database file
      // Use .rekey() method if using binary buffers, or pragma for strings
      this.db.pragma(`rekey='${nextKey}'`)

      // 3. Persist the new key to safeStorage
      const encrypted = safeStorage.encryptString(nextKey)
      store.set('db_key', encrypted.toString('hex'))
      this.encryptionKey = nextKey

      // 4. Restore performance settings
      this.db.pragma('journal_mode = WAL')

      return true
    } catch (error) {
      console.error('Rekeying failed:', error)
      // Attempt to restore WAL if rekey failed
      this.db.pragma('journal_mode = WAL')
      throw error
    }
  }

  /**
   * Retrieves comprehensive database metadata and performance statistics.
   * Returns an object containing size, version, and encryption details.
   */
  getDiagnostics() {
    try {
      // 1. Calculate database size metrics in bytes
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

      // 2. Retrieve version and environment metadata
      const sqliteVersion = this.db.prepare('SELECT sqlite_version() AS version').get().version
      const journalMode = this.db.pragma('journal_mode', { simple: true })

      // 3. Retrieve encryption-specific data (specific to Multiple Ciphers)
      // Using simple: true to extract only the string value from the pragma result
      const activeCipher = this.db
        .prepare("SELECT sqlite3mc_codec_data('cipher') AS cipher")
        .get().cipher

      return {
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
          userVersion: this.db.pragma('user_version', { simple: true }),
          pageSize: stats.pageSize,
          totalPages: stats.pageCount
        }
      }
    } catch (error) {
      console.error('Failed to retrieve diagnostics:', error)
      throw error
    }
  }

  /**
   * Asynchronously creates a hot backup of the encrypted database.
   * The backup file will use the same encryption key as the original.
   * @param {string} fileName - Optional custom name for the backup file
   */
  async backup(fileName = `backup-${Date.now()}.db`) {
    const backupDir = join(app.getPath('userData'), 'backups')

    // Ensure backup directory exists
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true })
    }

    const backupPath = join(backupDir, fileName)

    try {
      // .backup() returns a promise that resolves when complete
      await this.db.backup(backupPath, {
        // Optional progress monitoring
        progress: ({ totalPages, remainingPages }) => {
          const progress = (((totalPages - remainingPages) / totalPages) * 100).toFixed(1)
          console.log(`Backup progress: ${progress}%`)
        }
      })

      return backupPath
    } catch (error) {
      console.error('Database backup failed:', error)
      throw error
    }
  }

  /* ------------------------------------------------------------------
   * Schema
   * ------------------------------------------------------------------ */

  init() {
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
  }

  /* ------------------------------------------------------------------
   * Prepared Statements
   * ------------------------------------------------------------------ */

  prepareStatements() {
    /* ---------- USERS ---------- */
    this.addUser = this.db.prepare(`
      INSERT INTO users (name, email, secret, role, position)
      VALUES (?, ?, ?, ?, ?)
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
  }

  /* ------------------------------------------------------------------
   * Public API
   * ------------------------------------------------------------------ */

  /* Users */
  createUser(name, email, secret, role = 'user', position = null) {
    return this.addUser.run(name, email, secret, role, position)
  }

  getUsers(role = 'manager') {
    if (role === 'admin') {
      return this.getAllUsersForAdmin.all()
    }
    return this.getAllUsers.all()
  }

  getUserForLogin(name) {
    return this.getUserLogin.get(name)
  }

  deleteUser(id) {
    return this.deleteUserQ.run(id)
  }

  addAdminUserIfNoneExist(secret) {
    const row = this.db.prepare('SELECT COUNT(*) AS count FROM users WHERE role = ?').get('admin')

    if (row.count === 0) {
      this.createUser('admin', 'admin@example.com', secret, 'admin', 'System Administrator')
    }
  }

  saveSettings(data, role = 'user') {
    const adminFields = ['facility_name', 'facility_address', 'facility_contact']
    const allFields = [...adminFields, 'date_format', 'queue_size', 'alert_sound']

    // 1. Role Security: Nullify admin fields if user isn't admin
    if (role !== 'admin') {
      adminFields.forEach((field) => {
        data[field] = null // Forces ON CONFLICT to skip these columns
      })
    }

    // 2. Param Padding: Better-sqlite3 needs every @key to exist in the object
    allFields.forEach((field) => {
      if (!(field in data)) data[field] = null
    })

    return this.saveSettingsStmt.run(data)
  }

  fetchSettings() {
    return this.getSettings.get()
  }

  isSetupComplete() {
    const row = this.checkSetup.get()
    return row.is_setup_complete === 1
  }

  /* Labels */
  createLabel(product, instructions, warning, is_custom = 1) {
    return this.addLabel.run(product, instructions, warning, is_custom)
  }

  fetchLabels(search = '') {
    return search ? this.searchLabels.all(`%${search}%`) : this.getLabels.all()
  }

  updateLabel(id, product, instructions, warning, is_custom = 1) {
    return this.updateLabelQ.run(product, instructions, warning, is_custom, id)
  }

  deleteLabel(id) {
    return this.deleteLabelQ.run(id)
  }

  /* Clients */
  createClient(name, contact, email, home_address = null) {
    return this.addClient.run(name, contact, email, home_address)
  }

  updateClient(id, name, contact, email, home_address = null) {
    return this.updateClientQ.run(name, contact, email, home_address, id)
  }

  fetchClients() {
    return this.getClients.all()
  }

  getClientById(id) {
    return this.getClientByIdQ.get(id)
  }

  deleteClient(id) {
    return this.deleteClientQ.run(id)
  }

  countClients() {
    return this.countClientsQ.get().count
  }

  /* Client Labels */
  createClientLabel(client_id, product, instructions, warning) {
    return this.addClientLabel.run(client_id, product, instructions, warning)
  }

  createClientLabels(client_labels) {
    return this.addClientLabels(client_labels)
  }

  fetchClientLabels(client_id) {
    return this.getClientLabelsQ.all(client_id)
  }

  updateClientLabel(id, product, instructions, warning) {
    return this.updateClientLabelQ.run(product, instructions, warning, id)
  }

  deleteClientLabel(id) {
    return this.deleteClientLabelQ.run(id)
  }

  /* Queue */
  pushToQueue(item) {
    return this.addToQueueQ.run(item.product, item.instructions, item.warning, item.client)
  }

  fetchQueue() {
    return this.getQueueQ.all()
  }

  popFromQueue(id) {
    return this.removeFromQueueQ.run(id)
  }

  clearQueue() {
    return this.clearQueueQ.run()
  }

  countQueue() {
    return this.countQueueQ.get().count
  }

  dbEncryptionKey(role = 'admin') {
    if (role !== 'admin') {
      throw new Error('Unauthorized access to encryption key.')
    }
    return this.encryptionKey
  }
}
