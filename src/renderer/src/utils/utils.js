function soothingPrinterSound() {
  const context = new (window.AudioContext || window.webkitAudioContext)()

  // 1. Create a GainNode to control the "envelope" (fade-in/fade-out)
  const gainNode = context.createGain()
  gainNode.connect(context.destination)

  // 2. Setup frequencies (using a "Perfect Fifth" interval for a musical chime)
  const frequencies = [880, 1320] // A5 and E6 (higher is clearer/less intrusive)

  const startTime = context.currentTime
  const duration = 0.5 // Total length of the sound

  frequencies.forEach((freq) => {
    const osc = context.createOscillator()
    osc.type = 'sine' // Purest, smoothest wave
    osc.frequency.setValueAtTime(freq, startTime)
    osc.connect(gainNode)
    osc.start(startTime)
    osc.stop(startTime + duration)
  })

  // 3. Define the "Soothing" Envelope
  // Start silent
  gainNode.gain.setValueAtTime(0, startTime)
  // Attack: Quick fade in to 0.1 volume (10ms) to avoid a "pop"
  gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.02)
  // Decay/Release: Smoothly fade to silence over the rest of the duration
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
}

/**
 * Formats a date based on a specific ID.
 * @param {string} id - The format ID (e.g., 'd1', 'dt5')
 * @param {Date} [date] - Optional date to format, defaults to current time
 * @returns {string} The formatted date/time string
 */
function getFormattedDateTime(id, date = new Date()) {
  const formats = {
    // DATE ONLY FORMATS
    d1: () => new Intl.DateTimeFormat('en-US').format(date),
    d2: () => new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date),
    d3: () =>
      new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(
        date
      ),
    d4: () => date.toLocaleDateString('en-CA'),
    d5: () =>
      new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(
        date
      ),

    // DATE + TIME FORMATS
    dt1: () =>
      new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(date),
    dt2: () =>
      new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date),
    dt3: () =>
      new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
      }).format(date),
    dt4: () =>
      date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    dt5: () => date.toISOString().replace('T', ' ').substring(0, 16)
  }

  // Execute the matching format function or return an empty string/error
  return formats[id] ? formats[id]() : ''
}

export { soothingPrinterSound, getFormattedDateTime }
