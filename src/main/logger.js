import log from 'electron-log/main'

// 2. File Transport Configuration (The "Saved" Logs)
log.transports.file.level = 'info'
log.transports.file.maxSize = 5 * 1024 * 1024 // Limit to 5MB
log.transports.file.archiveLogFormat = '{y}-{m}-{d} {h}-{i}-{s}.log'

// 3. Console Transport Configuration (The "Live" Dev Logs)
log.transports.console.level = 'debug' // Show more detail in the terminal than in the file
log.transports.console.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}'

// 4. Catch Unhandled Errors
// This captures crashes that would otherwise be invisible
log.errorHandler.startCatching()

export default log
