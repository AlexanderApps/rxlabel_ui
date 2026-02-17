import { app } from 'electron'
import { spawn } from 'child_process'
import { join } from 'path'
import log from './logger'
import { existsSync, mkdirSync, copyFileSync } from 'fs'

export function getPrinterExePath() {
  // where electron-builder places it
  const bundledPath = app.isPackaged
    ? join(process.resourcesPath, 'bin', 'main.exe')
    : join(app.getAppPath(), 'bin', 'main.exe')

  // where we want to run it from
  const userBinDir = join(app.getPath('userData'), 'bin')
  const userExePath = join(userBinDir, 'main.exe')

  // ensure directory exists
  if (!existsSync(userBinDir)) {
    mkdirSync(userBinDir, { recursive: true })
  }

  // copy if missing
  if (!existsSync(userExePath)) {
    copyFileSync(bundledPath, userExePath)
  }

  return userExePath
}

const exePath = getPrinterExePath()

// ---------------- PROCESS IPC STATE ----------------

let proc = null
let buffer = ''
let seq = 0

let isReady = false
let pendingBeforeReady = []
let pendingCallbacks = new Map() // request.id -> resolve

// ---------------- PRINT QUEUE (USER LEVEL) ----------------

let printQueue = []
let printing = false

// ---------------- PROCESS LAUNCH ----------------

function printerStart() {
  if (proc) {
    log.debug('Printer process already running, skipping start')
    return
  }

  log.info('Starting printer process', { exePath })

  proc = spawn(exePath, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true
  })

  log.info('Printer process spawned successfully', {
    pid: proc.pid,
    exePath
  })

  proc.stdout.on('data', handleStdout)
  proc.stderr.on('data', (d) => {
    const stderr = d.toString()
    log.error('Printer process stderr', { stderr })
  })
  proc.on('exit', handleExit)
  proc.on('error', (err) => {
    log.error('Printer process error', {
      error: err.message,
      code: err.code
    })
  })
}

// ---------------- STDOUT HANDLER (IPC) ----------------

function handleStdout(chunk) {
  const chunkStr = chunk.toString()
  buffer += chunkStr

  let idx
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim()
    buffer = buffer.slice(idx + 1)

    if (!line) continue

    let msg
    try {
      msg = JSON.parse(line)
    } catch (err) {
      log.error('Printer IPC JSON parse error', {
        error: err.message,
        line: line.substring(0, 100) // Truncate for logging
      })
      continue
    }

    // READY HANDSHAKE
    if (msg.ready === true) {
      log.info('Printer process ready signal received')
      isReady = true
      flushPendingBeforeReady()
      continue
    }

    // MATCH RESPONSE TO REQUEST
    if (msg.id && pendingCallbacks.has(msg.id)) {
      log.debug('Printer IPC response received', {
        id: msg.id,
        success: !msg.error
      })

      if (msg.error) {
        log.warn('Printer command returned error', {
          id: msg.id,
          error: msg.error
        })
      }

      pendingCallbacks.get(msg.id)(msg) // resolve()
      pendingCallbacks.delete(msg.id)
      continue
    }

    // OTHER UNSOLICITED MESSAGES
    log.debug('Printer unsolicited message', { msg })
  }
}

// ---------------- QUEUED IPC BEFORE READY ----------------

function flushPendingBeforeReady() {
  const count = pendingBeforeReady.length

  if (count === 0) {
    log.debug('No pending printer commands to flush')
    return
  }

  log.info('Flushing pending printer commands', { count })

  for (const packet of pendingBeforeReady) {
    writePacket(packet)
  }
  pendingBeforeReady = []

  log.debug('Pending printer commands flushed successfully')
}

// ---------------- SEND COMMAND (IPC) ----------------

function printerSend(cmd, data = {}) {
  return new Promise((resolve) => {
    if (!proc) {
      log.debug('Printer process not running, starting it', { cmd })
      printerStart()
    }

    const id = ++seq
    const packet = { id, cmd, data }
    pendingCallbacks.set(id, resolve)

    log.debug('Sending printer command', {
      id,
      cmd,
      queuedBeforeReady: !isReady,
      dataKeys: Object.keys(data)
    })

    if (!isReady) {
      log.debug('Printer not ready, queuing command', { id, cmd })
      pendingBeforeReady.push(packet)
    } else {
      writePacket(packet)
    }
  })
}

// ---------------- WRITE LOW-LEVEL IPC ----------------

function writePacket(packet) {
  try {
    proc.stdin.write(JSON.stringify(packet) + '\n')
    log.debug('Printer IPC packet written', {
      id: packet.id,
      cmd: packet.cmd
    })
  } catch (err) {
    log.error('Printer IPC write error', {
      error: err.message,
      packet: packet.cmd
    })
  }
}

// ---------------- USER-LEVEL PRINT QUEUE ----------------

function enqueuePrint(jobOrList) {
  if (Array.isArray(jobOrList) && jobOrList.length === 0) {
    log.debug('Empty print job list, skipping')
    return
  }

  let jobCount = 0

  if (Array.isArray(jobOrList)) {
    jobCount = jobOrList.length
    for (const job of jobOrList) {
      printQueue.push(job)
    }
    log.info('Print jobs enqueued', {
      count: jobCount,
      queueLength: printQueue.length
    })
  } else {
    printQueue.push(jobOrList)
    jobCount = 1
    log.info('Print job enqueued', {
      queueLength: printQueue.length
    })
  }

  processQueue()
}

async function processQueue() {
  if (printing) {
    log.debug('Print queue already processing, skipping')
    return
  }

  if (printQueue.length === 0) {
    log.debug('Print queue empty, nothing to process')
    return
  }

  printing = true
  log.info('Processing print queue', { queueLength: printQueue.length })

  let successCount = 0
  let failCount = 0

  while (printQueue.length > 0) {
    const job = printQueue.shift()

    log.debug('Processing print job', {
      remaining: printQueue.length,
      jobKeys: Object.keys(job)
    })

    try {
      const res = await printerSend('PRINT', job)

      if (res.error) {
        log.error('Print job failed', {
          error: res.error,
          remaining: printQueue.length
        })
        failCount++
        // Break on error to prevent cascade failures
        break
      } else {
        log.info('Print job completed successfully', {
          response: res,
          remaining: printQueue.length
        })
        successCount++
      }
    } catch (err) {
      log.error('Print job exception', {
        error: err.message,
        remaining: printQueue.length
      })
      failCount++
      // Break on exception
      break
    }
  }

  printing = false

  log.info('Print queue processing finished', {
    successCount,
    failCount,
    remainingInQueue: printQueue.length
  })
}

// ---------------- PROCESS EXIT HANDLING ----------------

function handleExit(code) {
  log.error('Printer process exited', {
    code,
    wasReady: isReady,
    pendingCallbacks: pendingCallbacks.size,
    queuedCommands: pendingBeforeReady.length
  })

  proc = null
  isReady = false

  // Reject all pending callbacks
  const callbackCount = pendingCallbacks.size
  for (const [id, resolve] of pendingCallbacks) {
    log.warn('Rejecting pending printer callback due to exit', { id })
    resolve({ error: 'printer exited' })
  }
  pendingCallbacks.clear()

  if (callbackCount > 0) {
    log.warn('Cleared pending printer callbacks', { count: callbackCount })
  }
}

// ---------------- CLEAN SHUTDOWN ----------------

function printerShutdown() {
  if (!proc) {
    log.debug('Printer process not running, skipping shutdown')
    return
  }

  log.info('Shutting down printer process', {
    pid: proc.pid,
    pendingCallbacks: pendingCallbacks.size,
    queueLength: printQueue.length
  })

  try {
    proc.stdin.write(JSON.stringify({ cmd: 'EXIT' }) + '\n')
    proc.stdin.end()
    proc.kill('SIGTERM')
    log.info('Printer process shutdown command sent')
  } catch (e) {
    log.error('Printer shutdown error', {
      error: e.message
    })
  }

  proc = null
  isReady = false

  log.info('Printer process state cleared')
}

export { printerStart, enqueuePrint, printerShutdown }
