// import { spawn } from 'child_process'
// import { join } from 'path'

// const exePath = join(__dirname, '../../dist/main.exe')

// let proc = null
// let buffer = ''
// let seq = 0

// let isReady = false
// let pendingQueue = [] // commands queued before ready
// let pendingCallbacks = new Map() // id -> resolve()

// function printerStart() {
//   if (proc) return

//   proc = spawn(exePath, [], {
//     stdio: ['pipe', 'pipe', 'pipe'],
//     windowsHide: true
//   })

//   console.log('[printer] spawned:', exePath)

//   proc.stdout.on('data', handleStdout)
//   proc.stderr.on('data', (d) => console.error('[printer stderr]', d.toString()))
//   proc.on('exit', handleExit)
//   proc.on('error', (err) => console.error('[printer error]', err))
// }

// // -------- HANDLE JSON FROM PYTHON --------

// function handleStdout(chunk) {
//   const chunkStr = chunk.toString()
//   console.log('[RAW CHUNK]', JSON.stringify(chunkStr)) // ADD THIS

//   buffer += chunkStr
//   let idx
//   while ((idx = buffer.indexOf('\n')) >= 0) {
//     const line = buffer.slice(0, idx).trim()
//     buffer = buffer.slice(idx + 1)
//     if (!line) continue

//     console.log('[PARSED LINE]', line) // ADD THIS

//     let msg
//     try {
//       msg = JSON.parse(line)
//       console.log('[PARSED MSG]', msg) // ADD THIS
//     } catch (err) {
//       console.error('[printer JSON parse error]', err, line)
//       continue
//     }
//     // handshake: Python says it's ready
//     if (msg.ready === true) {
//       console.log('[GOT READY SIGNAL]') // ADD THIS
//       isReady = true
//       flushQueue()
//       continue
//     }

//     // match requests by id
//     if (msg.id && pendingCallbacks.has(msg.id)) {
//       pendingCallbacks.get(msg.id)(msg)
//       pendingCallbacks.delete(msg.id)
//       continue
//     }

//     console.log('[printer]', msg)
//     // ... rest
//   }
// }
// // -------- QUEUE UNTIL READY --------

// function flushQueue() {
//   for (const item of pendingQueue) {
//     writePacket(item)
//   }
//   pendingQueue = []
// }

// // -------- SEND COMMAND --------

// function printerSend(cmd, data = {}) {
//   return new Promise((resolve) => {
//     if (!proc) printerStart()
//     const id = ++seq
//     const packet = { id, cmd, data }
//     pendingCallbacks.set(id, resolve)
//     if (!isReady) {
//       pendingQueue.push(packet)
//     } else {
//       writePacket(packet)
//     }
//   })
// }

// function writePacket(packet) {
//   try {
//     proc.stdin.write(JSON.stringify(packet) + '\n')
//   } catch (err) {
//     console.error('[printer write error]', err)
//   }
// }

// // -------- EXIT HANDLING --------

// function handleExit(code) {
//   console.log('[printer exited]', code)
//   proc = null
//   isReady = false

//   // return error for any in-flight callbacks
//   for (const [, resolve] of pendingCallbacks) {
//     resolve({ error: 'printer exited' })
//   }
//   pendingCallbacks.clear()
// }

// // -------- CLEAN SHUTDOWN --------

// function printerShutdown() {
//   if (!proc) return

//   try {
//     proc.stdin.write(JSON.stringify({ cmd: 'EXIT' }) + '\n')
//     proc.stdin.end()
//     proc.kill('SIGTERM')
//   } catch (e) {
//     console.error('[printer shutdown]', e)
//   }

//   proc = null
//   isReady = false
// }

// export { printerStart, printerSend, printerShutdown }

import { spawn } from 'child_process'
import { join } from 'path'

const exePath = join(__dirname, '../../dist/main.exe')

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
  if (proc) return

  proc = spawn(exePath, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true
  })

  console.log('[printer] spawned:', exePath)

  proc.stdout.on('data', handleStdout)
  proc.stderr.on('data', (d) => console.error('[printer stderr]', d.toString()))
  proc.on('exit', handleExit)
  proc.on('error', (err) => console.error('[printer error]', err))
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
      console.error('[printer JSON parse error]', err, line)
      continue
    }

    // READY HANDSHAKE
    if (msg.ready === true) {
      console.log('[GOT READY SIGNAL]')
      isReady = true
      flushPendingBeforeReady()
      continue
    }

    // MATCH RESPONSE TO REQUEST
    if (msg.id && pendingCallbacks.has(msg.id)) {
      pendingCallbacks.get(msg.id)(msg) // resolve()
      pendingCallbacks.delete(msg.id)
      continue
    }

    // OTHER UNSOLICITED MESSAGES
    console.log('[printer unsolicited]', msg)
  }
}

// ---------------- QUEUED IPC BEFORE READY ----------------

function flushPendingBeforeReady() {
  for (const packet of pendingBeforeReady) {
    writePacket(packet)
  }
  pendingBeforeReady = []
}

// ---------------- SEND COMMAND (IPC) ----------------

function printerSend(cmd, data = {}) {
  return new Promise((resolve) => {
    if (!proc) printerStart()

    const id = ++seq
    const packet = { id, cmd, data }
    pendingCallbacks.set(id, resolve)

    if (!isReady) {
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
  } catch (err) {
    console.error('[printer write error]', err)
  }
}

// ---------------- USER-LEVEL PRINT QUEUE ----------------

function enqueuePrint(jobOrList) {
  if (Array.isArray(jobOrList) && jobOrList.length === 0) return
  if (Array.isArray(jobOrList)) {
    for (const job of jobOrList) {
      printQueue.push(job)
    }
  } else {
    printQueue.push(jobOrList)
  }

  processQueue()
}

async function processQueue() {
  if (printing) return
  printing = true

  while (printQueue.length > 0) {
    const job = printQueue.shift()
    try {
      const res = await printerSend('PRINT', job)
      console.log('[Printed]', res)
    } catch (err) {
      console.error('[Print failed]', err)
      // OPTIONAL: break, retry, or skip
      break
    }
  }

  printing = false
}

// ---------------- PROCESS EXIT HANDLING ----------------

function handleExit(code) {
  console.error('[printer exited]', code)
  proc = null
  isReady = false

  for (const [, resolve] of pendingCallbacks) {
    resolve({ error: 'printer exited' })
  }
  pendingCallbacks.clear()
}

// ---------------- CLEAN SHUTDOWN ----------------

function printerShutdown() {
  if (!proc) return

  try {
    proc.stdin.write(JSON.stringify({ cmd: 'EXIT' }) + '\n')
    proc.stdin.end()
    proc.kill('SIGTERM')
  } catch (e) {
    console.error('[printer shutdown]', e)
  }

  proc = null
  isReady = false
}

export { printerStart, enqueuePrint, printerShutdown }
