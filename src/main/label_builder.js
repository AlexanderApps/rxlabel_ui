/**
 * Medication Label Template Builder (Enhanced with Name-Based Interpolation)
 *
 * This improved version uses the 'name' field in template elements for
 * clean, reliable data interpolation.
 */
import { app } from 'electron'
import { readFileSync, mkdirSync, dirname, existsSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { buildJobPages } from './label_gen_v3'
import { LabelGeneratorV2 } from './label_gen_v2'
// ============================================================================
// TEMPLATE LOADER
// ============================================================================

/**
 * Load a template from a JSON file
 * @param {string} templatePath - Path to the template JSON file
 * @returns {Object} The loaded template object
 */
function loadTemplate(templatePath) {
  try {
    const fullPath = resolve(templatePath)
    const templateData = readFileSync(fullPath, 'utf8')
    return JSON.parse(templateData)
  } catch (error) {
    throw new Error(`Failed to load template: ${error.message}`)
  }
}

// ============================================================================
// NAME-BASED TEMPLATE BUILDER
// ============================================================================

/**
 * Build a medication label using name-based field mapping
 *
 * @param {string|Object} template - Template path or loaded template object
 * @param {Object} data - Label data mapped to element names
 * @param {string} data.businessName - Business/pharmacy name
 * @param {string} data.businessAddress - Business address
 * @param {string} data.businessPhone - Contact phone number(s)
 * @param {string} data.medicationName - Medication name and strength
 * @param {string} data.instructions - Dosage instructions
 * @param {string} data.patientName - Patient name
 * @param {string} data.dispensingDate - Dispensing date/time
 * @param {string} data.dispensedBy - Pharmacist/dispenser name
 * @param {string} data.warningText - Warning message
 * @returns {Object} Populated template ready for printing
 *
 * @example
 * const label = buildMedicationLabel('./template.json', {
 *   businessName: 'Apex Health Limited',
 *   businessAddress: 'Madina-Accra North Legon',
 *   businessPhone: '+233240000000',
 *   medicationName: 'Amoxicillin 500mg capsule',
 *   instructions: 'Take one capsule three times daily',
 *   patientName: 'Jane Smith',
 *   dispensingDate: '10/02/2026 14:30:00',
 *   dispensedBy: 'JOHN',
 *   warningText: 'Complete full course'
 * });
 */
function buildMedicationLabel(template, data) {
  // Load template if it's a path
  const templateObj =
    typeof template === 'string' ? loadTemplate(template) : JSON.parse(JSON.stringify(template)) // Deep clone

  // Validate template structure
  if (!templateObj.jobPages || !Array.isArray(templateObj.jobPages)) {
    throw new Error('Invalid template: missing or invalid jobPages array')
  }

  if (templateObj.jobPages.length === 0 || !Array.isArray(templateObj.jobPages[0])) {
    throw new Error('Invalid template: jobPages must contain at least one label array')
  }

  // Get the first label's elements
  const elements = templateObj.jobPages[0]

  // Update elements by name
  elements.forEach((element, index) => {
    // Skip elements without names
    if (!element.name) {
      return
    }

    // Check if we have data for this element
    if (Object.prototype.hasOwnProperty.call(data, element.name)) {
      const value = data[element.name]

      // For text elements, update the text
      if (element.type === 'text' && value !== undefined && value !== null) {
        element.text = String(value)
      }

      // For other types, you could extend this to modify other properties
      // For example, updating image paths, etc.
    }
  })

  return templateObj
}

// ============================================================================
// ADVANCED BUILDER WITH OPTIONS
// ============================================================================

/**
 * Build a medication label with advanced options
 *
 * @param {string|Object} template - Template path or loaded template object
 * @param {Object} data - Label data
 * @param {Object} options - Build options
 * @param {boolean} options.validateData - Validate required fields (default: true)
 * @param {boolean} options.strict - Throw error if data field not found in template (default: false)
 * @param {number} options.maxInstructionLength - Max chars for instructions (default: 250)
 * @param {Object} options.customProperties - Additional properties to set on named elements
 * @returns {Object} Populated template
 */
function buildMedicationLabelAdvanced(template, data, options = {}) {
  const {
    validateData = true,
    strict = false,
    maxInstructionLength = 250,
    customProperties = {}
  } = options

  // Validate required fields
  if (validateData) {
    const required = [
      'medicationName',
      'instructions',
      'patientName',
      'dispensingDate',
      'dispensedBy'
    ]
    const missing = required.filter((field) => !data[field] || String(data[field]).trim() === '')

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }
  }

  // Truncate long instructions if needed
  if (data.instructions && data.instructions.length > maxInstructionLength) {
    console.warn(
      `Instructions truncated from ${data.instructions.length} to ${maxInstructionLength} characters`
    )
    data.instructions = data.instructions.substring(0, maxInstructionLength - 3) + '...'
  }

  // Build the label
  const label = buildMedicationLabel(template, data)

  // Apply custom properties to named elements
  if (Object.keys(customProperties).length > 0) {
    label.jobPages[0].forEach((element) => {
      if (element.name && customProperties[element.name]) {
        Object.assign(element, customProperties[element.name])
      }
    })
  }

  // Check for unused data fields in strict mode
  if (strict) {
    const templateNames = new Set(label.jobPages[0].filter((el) => el.name).map((el) => el.name))

    const unusedFields = Object.keys(data).filter((key) => !templateNames.has(key))
    if (unusedFields.length > 0) {
      console.warn(`Unused data fields (not in template): ${unusedFields.join(', ')}`)
    }
  }

  return label
}

// ============================================================================
// BATCH LABEL BUILDER
// ============================================================================

/**
 * Build multiple medication labels from an array of data
 *
 * @param {string|Object} template - Template path or loaded template object
 * @param {Array<Object>} dataArray - Array of label data objects
 * @returns {Object} Template with multiple labels in jobPages
 */
function buildBatchLabels(template, dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    throw new Error('dataArray must be a non-empty array')
  }

  // Load template once
  const templateObj = typeof template === 'string' ? loadTemplate(template) : template

  // Build all labels
  const allLabels = dataArray.map((data, index) => {
    try {
      const label = buildMedicationLabel(templateObj, data)
      return label.jobPages[0]
    } catch (error) {
      console.error(`Error building label ${index + 1}:`, error.message)
      throw error
    }
  })

  // Return template with all labels
  return {
    jobPages: allLabels
  }
}

// ============================================================================
// ELEMENT FINDER HELPERS
// ============================================================================

/**
 * Find an element by name in a template
 *
 * @param {Object} template - Template object
 * @param {string} name - Element name to find
 * @returns {Object|null} The element or null if not found
 */
function findElementByName(template, name) {
  if (!template.jobPages || !template.jobPages[0]) {
    return null
  }

  return template.jobPages[0].find((el) => el.name === name) || null
}

/**
 * Update a specific element by name
 *
 * @param {Object} template - Template object
 * @param {string} name - Element name
 * @param {Object} updates - Properties to update
 * @returns {boolean} True if element was found and updated
 */
function updateElementByName(template, name, updates) {
  const element = findElementByName(template, name)

  if (!element) {
    return false
  }

  Object.assign(element, updates)
  return true
}

/**
 * Get all element names from a template
 *
 * @param {Object} template - Template object
 * @returns {string[]} Array of element names
 */
function getTemplateElementNames(template) {
  if (!template.jobPages || !template.jobPages[0]) {
    return []
  }

  return template.jobPages[0].filter((el) => el.name).map((el) => el.name)
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date for label
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: 'DD/MM/YYYY HH:mm:ss')
 * @returns {string} Formatted date
 */
function formatDate(date, format = 'DD/MM/YYYY HH:mm:ss') {
  const d = date instanceof Date ? date : new Date(date)

  const pad = (n) => n.toString().padStart(2, '0')

  return format
    .replace('DD', pad(d.getDate()))
    .replace('MM', pad(d.getMonth() + 1))
    .replace('YYYY', d.getFullYear().toString())
    .replace('HH', pad(d.getHours()))
    .replace('mm', pad(d.getMinutes()))
    .replace('ss', pad(d.getSeconds()))
}

/**
 * Validate medication label data
 * @param {Object} data - Label data to validate
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
function validateLabelData(data) {
  const errors = []
  const required = [
    'medicationName',
    'instructions',
    'patientName',
    'dispensingDate',
    'dispensedBy'
  ]

  // Check required fields
  required.forEach((field) => {
    if (!data[field] || String(data[field]).trim() === '') {
      errors.push(`Missing or empty required field: ${field}`)
    }
  })

  // Validate medication name length
  if (data.medicationName && data.medicationName.length > 100) {
    errors.push('Medication name too long (max 100 characters)')
  }

  // Validate instructions length
  if (data.instructions && data.instructions.length > 250) {
    errors.push('Instructions too long (max 250 characters, will be truncated)')
  }

  // Validate patient name length
  if (data.patientName && data.patientName.length > 50) {
    errors.push('Patient name too long (max 50 characters)')
  }

  // // Validate date format
  // if (data.dispensingDate) {
  //   const datePattern = /^\d{2}\/\d{2}\/\d{4}/
  //   if (!datePattern.test(data.dispensingDate)) {
  //     errors.push('Date must be in format DD/MM/YYYY HH:mm:ss or similar')
  //   }
  // }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Get default label data (for testing)
 * @returns {Object} Default label data
 */
function getDefaultData() {
  return {
    businessName: 'Apex Health Limited',
    businessAddress: 'Madina-Accra North Legon',
    businessPhone: '+233240000000 / +233200000000',
    medicationName: 'Paracetamol 500mg tablet',
    instructions: 'Take one tablet once(1) daily(24-hourly) at night 30 days',
    patientName: 'John Doe',
    dispensingDate: formatDate(new Date()),
    dispensedBy: 'MARY',
    warningText: 'Do not exceed 8 tablets in 24 hours'
  }
}

/**
 * Save label to JSON file
 * @param {Object} label - Label object to save
 * @param {string} outputPath - Output file path
 */
function saveLabel(label, outputPath) {
  try {
    const fullPath = resolve(outputPath)
    const dir = dirname(fullPath)

    // Create directory if it doesn't exist
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    writeFileSync(fullPath, JSON.stringify(label, null, 2), 'utf8')
    console.log(`Label saved to: ${fullPath}`)
  } catch (error) {
    throw new Error(`Failed to save label: ${error.message}`)
  }
}

/**
 * Create a data object from minimal input
 * Useful for quick label creation with sensible defaults
 *
 * @param {Object} essentials - Minimal required data
 * @param {string} essentials.medicationName - Medication name
 * @param {string} essentials.instructions - Instructions
 * @param {string} essentials.patientName - Patient name
 * @param {string} essentials.dispensedBy - Dispenser name
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Complete label data
 */
function createLabelData(essentials, overrides = {}) {
  const defaults = {
    businessName: 'Apex Health Limited',
    businessAddress: 'Madina-Accra North Legon',
    businessPhone: '+233240000000 / +233200000000',
    dispensingDate: formatDate(new Date()),
    warningText: 'Take as directed'
  }

  return {
    ...defaults,
    ...essentials,
    ...overrides
  }
}

function normalizeDataForPrinting(data, settings, currentUser) {
  return {
    businessName: settings.facility_name,
    businessAddress: settings.facility_address,
    businessPhone: settings.facility_contact,
    medicationName: data.product,
    instructions: data.instructions,
    patientName: data.client,
    warningText: data.warning,
    dispensingDate: data.timestamp,
    dispensedBy: currentUser.name
  }
}

function buildPrinterJobs(job, settings, currentUser) {
  let jobData = null

  if (Array.isArray(job)) {
    jobData = job
  } else {
    jobData = [job]
  }
  console.log(jobData)
  return jobData.map((j) => {
    const d = normalizeDataForPrinting(j, settings, currentUser)
    const templatePath = join(app.getPath('userData'), 'templates')
    const b = buildMedicationLabel(join(templatePath, 'base.json'), d)
    const jobPages = buildJobPages(b.jobPages)
    return {
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
  })
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Main functions
  loadTemplate,
  buildMedicationLabel,
  buildMedicationLabelAdvanced,
  buildBatchLabels,

  // Element helpers
  findElementByName,
  updateElementByName,
  getTemplateElementNames,

  // Utility functions
  formatDate,
  validateLabelData,
  getDefaultData,
  saveLabel,
  createLabelData,
  buildPrinterJobs
}
