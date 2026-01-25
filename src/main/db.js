import Database from 'better-sqlite3'
import { join } from 'path'
import { app } from 'electron'

class AppDatabase {
  constructor() {
    const dbPath = join(app.getPath('userData'), 'rxlabel.db')
    this.db = new Database(dbPath)
    this.init()
    this.prepareStatements()
  }

  init() {
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        secret TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      CREATE TABLE IF NOT EXISTS queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product TEXT NOT NULL,
        instructions TEXT,
        warning TEXT,
        client TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS client_labels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        product TEXT NOT NULL,
        instructions TEXT,
        warning TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      );
    `
    this.db.exec(schema)
  }

  deleteClientLabelsQuery(labels) {
    const placeholders = labels.map(() => '?').join(', ')
    return this.db.prepare(
      `DELETE FROM client_labels WHERE client_id = ? AND id IN (${placeholders})`
    )
  }

  prepareStatements() {
    // --- Users ---
    this.addUser = this.db.prepare('INSERT INTO users (name, email, secret) VALUES (?, ?, ?)')
    this.getAllUsers = this.db.prepare('SELECT id, name, email FROM users ORDER BY created_at DESC')
    this.getUserLogin = this.db.prepare('SELECT * FROM users WHERE name = ?')
    this.deleteUser = this.db.prepare('DELETE FROM users WHERE id = ?')

    // --- Clients ---
    this.addClient = this.db.prepare('INSERT INTO clients (name, contact, email) VALUES (?, ?, ?)')
    this.getAllClients = this.db.prepare('SELECT * FROM clients ORDER BY created_at DESC')
    this.getClient = this.db.prepare('SELECT * FROM clients WHERE id = ?')
    this.deleteClient = this.db.prepare('DELETE FROM clients WHERE id = ?')
    this.countClientsQ = this.db.prepare('SELECT COUNT(*) as count FROM clients')
    this.getClientLabels = this.db.prepare(
      'SELECT id, product, instructions, warning, created_at FROM client_labels WHERE client_id = ?'
    )
    this.updateClientQ = this.db.prepare(
      'UPDATE clients SET name = ?, contact = ?, email = ? WHERE id = ?'
    )
    this.addClientLabel = this.db.prepare(
      'INSERT INTO client_labels (client_id, product, instructions, warning) VALUES (?, ?, ?, ?)'
    )
    this.updateClientLabelQ = this.db.prepare(
      'UPDATE client_labels SET product = ?, instructions = ?, warning = ? WHERE id = ?'
    )
    this.copyClientLabelToQueueQ = this.db.prepare(`
      INSERT INTO queue (product, instructions, warning, client)
      SELECT cl.product, cl.instructions, cl.warning, c.name
      FROM client_labels cl
      INNER JOIN clients c ON cl.client_id = c.id
      WHERE cl.client_id = ?
    `)
    this.addClientLabels = this.db.transaction((client_labels) => {
      for (const label of client_labels) {
        this.addClientLabel.run(label.client_id, label.product, label.instructions, label.warning)
      }
    })
    this.getClientLabelsWithClientNameQ = this.db.prepare(`
      SELECT
        cl.product,
        cl.instructions,
        cl.warning,
        cl.created_at,
        c.name AS client
      FROM client_labels cl
      INNER JOIN clients c ON cl.client_id = c.id
      WHERE cl.client_id = ?
    `)
    this.deleteClientLabelQ = this.db.prepare('DELETE FROM client_labels WHERE id = ?')

    // this.deleteClient

    // --- Settings (Single Record pattern) ---
    this.getSettings = this.db.prepare('SELECT * FROM settings LIMIT 1')
    // this.updateSettings = this.db.prepare(`
    //   INSERT OR REPLACE INTO settings (id, facility_name, facility_address, facility_contact, alert_sound, date_format, queue_size)
    //   VALUES (1, ?, ?, ?, ?, ?, ?)
    // `)
    this.updateSettings = this.db.prepare(`
      INSERT OR REPLACE INTO settings (
        id,
        date_format,
        facility_address,
        facility_contact,
        facility_name,
        queue_size,
        alert_sound
      ) VALUES (
        1,
        @date_format,
        @facility_address,
        @facility_contact,
        @facility_name,
        @queue_size,
        @alert_sound
      )
    `)

    // --- Labels ---
    this.addLabel = this.db.prepare(
      'INSERT INTO labels (product, instructions, warning) VALUES (?, ?, ?)'
    )
    this.getLabels = this.db.prepare('SELECT * FROM labels ORDER BY product ASC')
    this.getLabelsFiltered = this.db.prepare(`
      SELECT * FROM labels
      WHERE product LIKE ?
      ORDER BY product ASC
    `)
    this.updateLabel = this.db.prepare(
      'UPDATE labels SET product = ?, instructions = ?, warning = ? WHERE id = ?'
    )
    this.deleteLabel = this.db.prepare('DELETE FROM labels WHERE id = ?')

    // --- Queue ---
    this.addToQueue = this.db.prepare(
      'INSERT INTO queue (product, instructions, warning, client) VALUES (?, ?, ?, ?)'
    )
    this.getQueue = this.db.prepare('SELECT * FROM queue ORDER BY created_at ASC')
    this.removeFromQueue = this.db.prepare('DELETE FROM queue WHERE id = ?')
    this.clearQueue = this.db.prepare('DELETE FROM queue')
    this.countQueue = this.db.prepare('SELECT COUNT(*) as count FROM queue')
    this.countClientLabelsByIdQ = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM client_labels
      WHERE client_id = ?
    `)
  }

  // Settings
  saveSettings(data) {
    return this.updateSettings.run(data)
  }

  fetchSettings() {
    return this.getSettings.get()
  }

  // Labels
  createLabel(product, instructions, warning) {
    return this.addLabel.run(product, instructions, warning)
  }

  fetchLabels(searchTerm = '') {
    if (searchTerm) {
      // Wrap the term in % for a "contains" search
      return this.getLabelsFiltered.all(`%${searchTerm}%`)
    }
    // Return all if no search term is provided
    return this.getLabels.all()
  }

  updateLabelById(id, product, instructions, warning) {
    return this.updateLabel.run(product, instructions, warning, id)
  }

  deleteLabelById(id) {
    return this.deleteLabel.run(id)
  }

  // Queue
  pushToQueue(item) {
    return this.addToQueue.run(item.product, item.instructions, item.warning, item.client)
  }

  fetchQueue() {
    return this.getQueue.all()
  }

  popFromQueue(id) {
    return this.removeFromQueue.run(id)
  }

  countQueueItems() {
    const row = this.countQueue.get()
    return row.count
  }
  clearQueueItems() {
    return this.clearQueue.run()
  }

  createUser(username, email, password) {
    return this.addUser.run(username, email, password)
  }
  deleteUser(id) {
    return this.deleteUser.run(id)
  }
  getUserForLogin(username) {
    return this.getUserLogin.get(username)
  }

  fetchClientLabels(id) {
    return this.getClientLabels.all(id)
  }
  fetchClients() {
    return this.getAllClients.all()
  }
  getClientById(id) {
    return this.getClient.get(id)
  }
  createClient(name, contact, email) {
    return this.addClient.run(name, contact, email)
  }

  updateClient(id, name, contact, email) {
    return this.updateClientQ.run(name, contact, email, id)
  }
  countClients() {
    const row = this.countClientsQ.get()
    return row.count
  }
  copyClientLabelToQueue(id) {
    return this.copyClientLabelToQueueQ.run(id)
  }
  countClientLabels(id) {
    const row = this.countClientLabelsByIdQ.get(id)
    return row ? row.count : 0
  }
  deleteClientById(id) {
    return this.deleteClient.run(id)
  }
  deleteClientLabels(id, labels) {
    return this.deleteClientLabelsQuery(labels).run(id, ...labels)
  }
  createClientLabel(client_id, product, instructions, warning) {
    return this.addClientLabel.run(client_id, product, instructions, warning)
  }
  createClientLabels(client_labels) {
    return this.addClientLabels(client_labels)
  }

  deleteClientLabel(id) {
    return this.deleteClientLabelQ.run(id)
  }

  updateClientLabel(id, product, instructions, warning) {
    return this.updateClientLabelQ.run(product, instructions, warning, id)
  }

  getClientLabelsWithClientName(id) {
    return this.getClientLabelsWithClientNameQ.all(id)
  }
}

export const db = new AppDatabase()
