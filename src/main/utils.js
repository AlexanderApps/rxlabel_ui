import XLSX from 'xlsx'
import { writeFileSync } from 'node:fs'
import log from './logger'
import { LabelGenerator } from './label_gen'

function cleanPrinterData(data, settings, currentUser) {
  log.debug('Cleaning printer data', {
    dataType: Array.isArray(data) ? 'array' : typeof data,
    dataLength: Array.isArray(data) ? data.length : 'n/a',
    hasSettings: !!settings,
    hasUser: !!currentUser
  })

  try {
    if (!settings || !currentUser) {
      log.error('cleanPrinterData failed - missing required parameters', {
        hasSettings: !!settings,
        hasUser: !!currentUser
      })
      throw new Error('Missing settings or currentUser')
    }

    const facilityFields = {
      facility_name: settings.facility_name ?? '',
      facility_contact: settings.facility_contact ?? '',
      facility_address: settings.facility_address ?? '',
      user: currentUser?.name ?? 'Unknown'
    }

    log.debug('Facility fields prepared', {
      facility_name: facilityFields.facility_name,
      user: facilityFields.user
    })

    if (Array.isArray(data)) {
      if (data.length === 0) {
        log.warn('cleanPrinterData received empty array')
        return []
      }

      const result = data.map((d) => ({
        ...d,
        ...facilityFields
      }))

      log.info('Printer data cleaned successfully', {
        inputCount: data.length,
        outputCount: result.length
      })

      return result
    }

    if (typeof data === 'object' && data !== null) {
      log.info('Printer data cleaned successfully (single object)')
      return {
        ...data,
        ...facilityFields
      }
    }

    log.error('cleanPrinterData failed - invalid data format', {
      dataType: typeof data,
      isNull: data === null
    })
    throw new Error('Invalid data format: expected array or object')
  } catch (err) {
    log.error('cleanPrinterData error', {
      error: err.message,
      stack: err.stack
    })

    // decide on fallback — here returning null is clear
    return null
  }
}

/**
 * Generate printer-ready label data from prescription data
 * @param {Object|Array} data - Prescription data (single object or array)
 * @param {Object} settings - Facility settings
 * @param {Object} currentUser - Current user information
 * @param {Object} options - Label generation options
 * @returns {Object|Array|null} Printer-ready label data
 */
function generateLabel(data, settings, currentUser, options = {}) {
  log.debug('Generating printer labels', {
    dataType: Array.isArray(data) ? 'array' : typeof data,
    dataLength: Array.isArray(data) ? data.length : 'n/a',
    hasSettings: !!settings,
    hasUser: !!currentUser
  })

  try {
    // Validate required parameters
    if (!settings || !currentUser) {
      log.error('generateLabel failed - missing required parameters', {
        hasSettings: !!settings,
        hasUser: !!currentUser
      })
      throw new Error('Missing settings or currentUser')
    }

    // Prepare facility fields
    const facilityFields = {
      facilityName: settings.facility_name ?? '',
      facilityPhone: settings.facility_contact ?? '',
      facilityAddress: settings.facility_address ?? '',
      dispensedBy: currentUser?.name ?? 'Unknown'
    }

    log.debug('Facility fields prepared', {
      facility_name: facilityFields.facilityName,
      user: facilityFields.dispensedBy
    })

    // Initialize label generator with options
    const generator = new LabelGenerator({
      facilityNameFontSize: options.facilityNameFontSize || 3.2,
      facilityAddressFontSize: options.facilityAddressFontSize || 1.8,
      facilityPhoneFontSize: options.facilityPhoneFontSize || 1.8,
      // productNameStyle: options.productNameStyle || 'normal',
      instructionMaxFontSize: options.instructionMaxFontSize || 14.0,
      instructionMinFontSize: options.instructionMinFontSize || 3.0,
      globalFontFamily: 'Arial Black'

      // Bold product box style
      // productNameStyle: 'bold'
    })

    // Helper function to generate label for a single prescription
    const generateSingleLabel = (prescription) => {
      // Validate prescription data
      if (!prescription || typeof prescription !== 'object') {
        log.warn('Invalid prescription data', { prescription })
        return null
      }

      // Extract prescription fields with comprehensive field name mapping
      const labelData = {
        ...facilityFields,
        // Drug/Product name - supports multiple field variations
        drugName:
          prescription.product ||
          prescription.drug_name ||
          prescription.drugName ||
          prescription.medication ||
          'Unknown Medication',

        // Instructions/Directions
        instruction:
          prescription.instructions ||
          prescription.instruction ||
          prescription.directions ||
          prescription.dosage ||
          'Take as directed',

        // Patient name - supports multiple field variations
        patientName:
          prescription.client ||
          prescription.patient_name ||
          prescription.patientName ||
          prescription.patient ||
          prescription.name ||
          'Walk-in Patient',

        // Timestamp - supports multiple field variations
        timestamp:
          prescription.timestamp ||
          prescription.dispensed_at ||
          prescription.created_at ||
          prescription.date ||
          new Date().toISOString().slice(0, 16).replace('T', ' '),

        // Warning/Precautions
        warning:
          prescription.warning ||
          prescription.warnings ||
          prescription.precautions ||
          prescription.caution ||
          'Consult your pharmacist',

        // Printer name
        printerName: options.printerName || settings.printer_name || 'DP27P Label Printer'
      }

      log.debug('Generating label for prescription', {
        drugName: labelData.drugName,
        patientName: labelData.patientName,
        instruction: labelData.instruction?.substring(0, 50) + '...'
      })

      // Generate the label
      return generator.generateLabel(labelData)
    }

    // Handle array of prescriptions
    if (Array.isArray(data)) {
      if (data.length === 0) {
        log.warn('generateLabel received empty array')
        return []
      }

      const labels = data.map(generateSingleLabel).filter((label) => label !== null) // Remove any failed labels

      log.info('Labels generated successfully', {
        inputCount: data.length,
        outputCount: labels.length,
        failedCount: data.length - labels.length
      })

      return labels
    }

    // Handle single prescription object
    if (typeof data === 'object' && data !== null) {
      const label = generateSingleLabel(data)

      if (label) {
        log.info('Label generated successfully (single prescription)')
      } else {
        log.warn('Failed to generate label for prescription')
      }

      return label
    }

    // Invalid data format
    log.error('generateLabel failed - invalid data format', {
      dataType: typeof data,
      isNull: data === null
    })
    throw new Error('Invalid data format: expected array or object')
  } catch (err) {
    log.error('generateLabel error', {
      error: err.message,
      stack: err.stack
    })

    // Return null to indicate failure
    return null
  }
}

/**
 * Generate labels with custom configuration
 * @param {Object|Array} data - Prescription data
 * @param {Object} settings - Facility settings
 * @param {Object} currentUser - Current user
 * @param {Object} customConfig - Custom label configuration
 * @returns {Object|Array|null} Printer-ready label data
 */
function generateCustomLabel(data, settings, currentUser, customConfig = {}) {
  const defaultConfig = {
    facilityNameFontSize: 3.2,
    facilityAddressFontSize: 1.8,
    facilityPhoneFontSize: 1.8,
    productNameStyle: 'normal',
    instructionMaxFontSize: 4.0,
    instructionMinFontSize: 2.0,
    printerName: 'DP27P Label Printer'
  }

  const options = { ...defaultConfig, ...customConfig }

  return generateLabel(data, settings, currentUser, options)
}

/**
 * Generate labels with bold product name style
 * @param {Object|Array} data - Prescription data
 * @param {Object} settings - Facility settings
 * @param {Object} currentUser - Current user
 * @returns {Object|Array|null} Printer-ready label data
 */
function generateBoldLabel(data, settings, currentUser) {
  return generateLabel(data, settings, currentUser, {
    productNameStyle: 'bold',
    facilityNameFontSize: 3.5
  })
}

/**
 * Batch print labels
 * @param {Array} prescriptions - Array of prescriptions
 * @param {Object} settings - Facility settings
 * @param {Object} currentUser - Current user
 * @param {Object} api - dtpweb API instance
 * @returns {Promise<Object>} Print result
 */
async function batchPrintLabels(prescriptions, settings, currentUser, api) {
  log.info('Starting batch print', { count: prescriptions.length })

  try {
    // Generate all labels
    const labels = generateLabel(prescriptions, settings, currentUser)

    if (!labels || labels.length === 0) {
      throw new Error('No labels generated')
    }

    // Print each label
    const results = []
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i]

      log.debug(`Printing label ${i + 1}/${labels.length}`)

      try {
        const success = await api.print(
          0x1000, // Standard print task
          label.printerInfo,
          label.jobInfo,
          label.jobPages
        )

        results.push({
          index: i,
          success,
          prescription: prescriptions[i]
        })

        if (!success) {
          log.warn(`Label ${i + 1} failed to print`)
        }
      } catch (printErr) {
        log.error(`Error printing label ${i + 1}`, {
          error: printErr.message
        })
        results.push({
          index: i,
          success: false,
          error: printErr.message,
          prescription: prescriptions[i]
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failCount = results.length - successCount

    log.info('Batch print completed', {
      total: results.length,
      success: successCount,
      failed: failCount
    })

    return {
      total: results.length,
      success: successCount,
      failed: failCount,
      results
    }
  } catch (err) {
    log.error('Batch print failed', {
      error: err.message,
      stack: err.stack
    })
    throw err
  }
}

/**
 * Validate prescription data before generating labels
 * @param {Object} prescription - Prescription object
 * @returns {Object} Validation result
 */
function validatePrescriptionData(prescription) {
  const errors = []
  const warnings = []

  if (!prescription) {
    errors.push('Prescription is null or undefined')
    return { valid: false, errors, warnings }
  }

  // Check required fields - support multiple field name variations
  const hasProductName =
    prescription.product ||
    prescription.drug_name ||
    prescription.drugName ||
    prescription.medication

  if (!hasProductName) {
    errors.push('Missing product/drug name')
  }

  const hasPatientName =
    prescription.client ||
    prescription.patient_name ||
    prescription.patientName ||
    prescription.patient ||
    prescription.name

  // Patient name is optional (can be walk-in), so just warn
  if (!hasPatientName) {
    warnings.push('No patient/client name provided - will use "Walk-in Patient"')
  }

  // Check recommended fields
  const hasInstructions =
    prescription.instructions ||
    prescription.instruction ||
    prescription.directions ||
    prescription.dosage

  if (!hasInstructions) {
    warnings.push('Missing dosage instructions')
  }

  const hasWarning =
    prescription.warning ||
    prescription.warnings ||
    prescription.precautions ||
    prescription.caution

  if (!hasWarning) {
    warnings.push('Missing warning information')
  }

  // Check for very long text that might not fit
  const instruction =
    prescription.instructions || prescription.instruction || prescription.directions || ''

  if (instruction.length > 500) {
    warnings.push('Instruction text is very long and may be truncated')
  }

  const productName = prescription.product || prescription.drug_name || prescription.drugName || ''

  if (productName.length > 50) {
    warnings.push('Product name is very long and may not display well')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

// Convert data to CSV format
function convertToCSV(data, includeHeaders = true) {
  log.debug('Converting data to CSV', {
    rowCount: data?.length ?? 0,
    includeHeaders
  })

  if (!data || data.length === 0) {
    log.warn('convertToCSV received empty or null data')
    return ''
  }

  try {
    const headers = Object.keys(data[0])
    const csvRows = []

    log.debug('CSV headers extracted', {
      headerCount: headers.length,
      headers: headers.join(', ')
    })

    if (includeHeaders) {
      csvRows.push(headers.join(','))
    }

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header]
        if (value === null || value === undefined) return ''
        const escaped = String(value).replace(/"/g, '""')
        return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped
      })
      csvRows.push(values.join(','))
    }

    const csvContent = csvRows.join('\n')
    log.info('CSV conversion successful', {
      rowCount: data.length,
      totalRows: csvRows.length,
      sizeBytes: csvContent.length
    })

    return csvContent
  } catch (err) {
    log.error('CSV conversion error', {
      error: err.message,
      stack: err.stack,
      dataLength: data?.length
    })
    throw err
  }
}

// Convert data to JSON format
function convertToJSON(data) {
  log.debug('Converting data to JSON', {
    dataType: Array.isArray(data) ? 'array' : typeof data,
    itemCount: Array.isArray(data) ? data.length : 'n/a'
  })

  try {
    const jsonContent = JSON.stringify(data, null, 2)

    log.info('JSON conversion successful', {
      itemCount: Array.isArray(data) ? data.length : 1,
      sizeBytes: jsonContent.length
    })

    return jsonContent
  } catch (err) {
    log.error('JSON conversion error', {
      error: err.message,
      stack: err.stack
    })
    throw err
  }
}

// Write file based on format
function writeExportFile(data, outputPath, format, options = {}) {
  const { includeHeaders = true, tableName = 'data' } = options

  log.info('Writing export file', {
    format,
    outputPath,
    rowCount: Array.isArray(data) ? data.length : 1,
    includeHeaders,
    tableName
  })

  try {
    if (format === 'csv') {
      const csvContent = convertToCSV(data, includeHeaders)
      writeFileSync(outputPath, csvContent, 'utf8')
      log.info('CSV file written successfully', {
        outputPath,
        sizeBytes: csvContent.length
      })
    } else if (format === 'json') {
      const jsonContent = convertToJSON(data)
      writeFileSync(outputPath, jsonContent, 'utf8')
      log.info('JSON file written successfully', {
        outputPath,
        sizeBytes: jsonContent.length
      })
    } else if (format === 'xlsx') {
      log.debug('Creating XLSX workbook', { tableName })
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, tableName)
      XLSX.writeFile(workbook, outputPath)
      log.info('XLSX file written successfully', {
        outputPath,
        tableName,
        rowCount: Array.isArray(data) ? data.length : 1
      })
    } else {
      log.error('Invalid export format specified', {
        format,
        supportedFormats: ['csv', 'json', 'xlsx']
      })
      throw new Error(`Unsupported export format: ${format}`)
    }

    log.info('Export file completed successfully', {
      format,
      outputPath,
      rowCount: Array.isArray(data) ? data.length : 1
    })
  } catch (err) {
    log.error('Export file write error', {
      format,
      outputPath,
      error: err.message,
      stack: err.stack
    })
    throw err
  }
}

export {
  cleanPrinterData,
  writeExportFile,
  generateLabel,
  generateCustomLabel,
  generateBoldLabel,
  batchPrintLabels,
  validatePrescriptionData
}
