/**
 * DTPWeb Label Printer - jobPages Builder
 *
 * This module provides a function to build and validate jobPages structures
 * for the DTPWeb label printer printing interface.
 */

// ============================================================================
// ENUMERATION MAPPINGS
// ============================================================================

const alignmentMap = {
  start: 0,
  center: 1,
  end: 2,
  stretch: 3,
  expand: 4
}

const fontStyleMap = {
  regular: 0,
  bold: 1,
  italic: 2,
  bolditalic: 3,
  underline: 4,
  strikeout: 8
}

const autoReturnMap = {
  none: 0,
  char: 1,
  word: 2
}

const barcodeTypeMap = {
  upc_a: 20,
  upc_e: 21,
  ean13: 22,
  ean8: 23,
  code39: 24,
  itf25: 25,
  codabar: 26,
  code93: 27,
  code128: 28,
  isbn: 29,
  ecode39: 30,
  auto: 60
}

const qrEccMap = {
  l: 0,
  m: 1,
  q: 2,
  h: 3
}

const qrEncodingMap = {
  unicode: 0,
  ansi: 1,
  utf8: 2
}

const pdf417EccMap = {
  auto: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const elementSchemas = {
  text: {
    required: ['type', 'text'],
    optional: [
      'x',
      'y',
      'width',
      'height',
      'fontName',
      'fontHeight',
      'fontStyle',
      'autoReturn',
      'charSpace',
      'lineSpace',
      'leadingIndentChars',
      'leadingIndentMM',
      'leadingIndentColon',
      'horizontalAlignment',
      'verticalAlignment',
      'orientation'
    ],
    mappings: {
      autoReturn: autoReturnMap,
      fontStyle: fontStyleMap,
      horizontalAlignment: alignmentMap,
      verticalAlignment: alignmentMap
    }
  },
  barcode: {
    required: ['type', 'text'],
    optional: [
      'x',
      'y',
      'width',
      'height',
      'textHeight',
      'type',
      'fontName',
      'fontStyle',
      'textAlignment',
      'barPixels',
      'orientation',
      'horizontalAlignment',
      'verticalAlignment'
    ],
    mappings: {
      type: barcodeTypeMap,
      fontStyle: fontStyleMap,
      textAlignment: alignmentMap,
      horizontalAlignment: alignmentMap,
      verticalAlignment: alignmentMap
    }
  },
  qrcode: {
    required: ['type', 'text'],
    optional: [
      'x',
      'y',
      'width',
      'height',
      'textEncoding',
      'eccLevel',
      'qrcPixels',
      'orientation',
      'horizontalAlignment',
      'verticalAlignment'
    ],
    mappings: {
      eccLevel: qrEccMap,
      textEncoding: qrEncodingMap,
      horizontalAlignment: alignmentMap,
      verticalAlignment: alignmentMap
    }
  },
  pdf417: {
    required: ['type', 'text'],
    optional: [
      'x',
      'y',
      'width',
      'height',
      'p417Pixels',
      'eccLevel',
      'orientation',
      'horizontalAlignment',
      'verticalAlignment'
    ],
    mappings: {
      eccLevel: pdf417EccMap,
      horizontalAlignment: alignmentMap,
      verticalAlignment: alignmentMap
    }
  },
  dataMatrix: {
    required: ['type', 'text'],
    optional: [
      'x',
      'y',
      'width',
      'height',
      'orientation',
      'horizontalAlignment',
      'verticalAlignment'
    ],
    mappings: {
      horizontalAlignment: alignmentMap,
      verticalAlignment: alignmentMap
    }
  },
  image: {
    required: ['type', 'imageFile'],
    optional: ['x', 'y', 'width', 'height', 'threshold', 'orientation'],
    mappings: {}
  },
  rectangle: {
    required: ['type'],
    optional: [
      'x',
      'y',
      'width',
      'height',
      'lineWidth',
      'cornerWidth',
      'cornerHeight',
      'fill',
      'orientation'
    ],
    mappings: {}
  },
  ellipse: {
    required: ['type'],
    optional: ['x', 'y', 'width', 'height', 'lineWidth', 'fill', 'orientation'],
    mappings: {}
  },
  line: {
    required: ['type'],
    optional: ['x1', 'y1', 'x2', 'y2', 'lineWidth', 'dashLens', 'orientation'],
    mappings: {}
  }
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Builds and validates the jobPages structure for the DTPWeb print function.
 *
 * @param {Array<Array<Object>>} labels - Array of labels, where each label is an array of drawing elements
 * @param {Object} options - Optional configuration
 * @param {boolean} options.strict - If true, throws on unknown properties (default: false)
 * @param {boolean} options.validateRequired - If true, validates required fields (default: true)
 * @returns {Array<Array<Object>>} The validated and processed jobPages structure
 *
 * @throws {Error} If validation fails
 *
 * @example
 * const jobPages = buildJobPages([
 *   [  // Label 1
 *     {
 *       type: 'text',
 *       text: 'Hello World',
 *       x: 10,
 *       y: 10,
 *       fontHeight: 3.5,
 *       fontName: 'Heiti',
 *       autoReturn: 'none',
 *       fontStyle: 'bold',
 *       horizontalAlignment: 'center'
 *     },
 *     {
 *       type: 'barcode',
 *       text: '1234567890',
 *       x: 10,
 *       y: 20,
 *       width: 30,
 *       height: 10,
 *       type: 'code128'
 *     }
 *   ]
 * ]);
 */
function buildJobPages(labels, options = {}) {
  const { strict = false, validateRequired = true } = options

  if (!Array.isArray(labels)) {
    throw new Error('labels must be an array')
  }

  if (labels.length === 0) {
    throw new Error('labels array cannot be empty')
  }

  const supportedTypes = new Set(Object.keys(elementSchemas))

  labels.forEach((label, labelIdx) => {
    if (!Array.isArray(label)) {
      throw new Error(`Each label must be an array of elements. Invalid at label index ${labelIdx}`)
    }

    if (label.length === 0) {
      throw new Error(
        `Label at index ${labelIdx} is empty. Each label must have at least one element.`
      )
    }

    label.forEach((element, elemIdx) => {
      if (typeof element !== 'object' || element === null) {
        throw new Error(
          `Each drawing element must be an object. Invalid at label ${labelIdx}, element ${elemIdx}`
        )
      }

      if (!('type' in element)) {
        throw new Error(
          `Each element must have a 'type' key. Missing at label ${labelIdx}, element ${elemIdx}`
        )
      }

      const elemType = element.type.toLowerCase()

      if (!supportedTypes.has(elemType)) {
        throw new Error(
          `Unsupported type '${elemType}' at label ${labelIdx}, element ${elemIdx}. ` +
            `Supported types: ${Array.from(supportedTypes).join(', ')}`
        )
      }

      const schema = elementSchemas[elemType]

      // Validate required fields
      if (validateRequired) {
        for (const requiredField of schema.required) {
          if (requiredField === 'type') continue // Already checked
          if (!(requiredField in element)) {
            throw new Error(
              `Missing required field '${requiredField}' for ${elemType} ` +
                `at label ${labelIdx}, element ${elemIdx}`
            )
          }
        }
      }

      // Validate unknown properties in strict mode
      if (strict) {
        const allowedFields = new Set([...schema.required, ...schema.optional])
        for (const key of Object.keys(element)) {
          if (!allowedFields.has(key)) {
            throw new Error(
              `Unknown property '${key}' for ${elemType} at label ${labelIdx}, element ${elemIdx}. ` +
                `Allowed properties: ${Array.from(allowedFields).join(', ')}`
            )
          }
        }
      }

      // Apply mappings for string enum values
      for (const [field, mapping] of Object.entries(schema.mappings)) {
        if (field in element) {
          const value = element[field]

          if (typeof value === 'string') {
            const lowerValue = value.toLowerCase()

            if (lowerValue in mapping) {
              element[field] = mapping[lowerValue]
            } else {
              throw new Error(
                `Invalid ${field} value '${value}' at label ${labelIdx}, element ${elemIdx}. ` +
                  `Supported values: ${Object.keys(mapping).join(', ')}`
              )
            }
          } else if (typeof value === 'number') {
            // Validate numeric values are in the mapping
            const validValues = Object.values(mapping)
            if (!validValues.includes(value)) {
              throw new Error(
                `Invalid numeric ${field} value '${value}' at label ${labelIdx}, element ${elemIdx}. ` +
                  `Valid numeric values: ${validValues.join(', ')}`
              )
            }
          }
        }
      }

      // Type-specific validations
      validateElementSpecifics(element, elemType, labelIdx, elemIdx)
    })
  })

  return labels
}

/**
 * Performs type-specific validation for drawing elements
 * @private
 */
function validateElementSpecifics(element, elemType, labelIdx, elemIdx) {
  switch (elemType) {
    case 'text':
      if ('fontHeight' in element && element.fontHeight <= 0) {
        throw new Error(`fontHeight must be positive at label ${labelIdx}, element ${elemIdx}`)
      }
      if ('charSpace' in element && element.charSpace < 0) {
        throw new Error(`charSpace cannot be negative at label ${labelIdx}, element ${elemIdx}`)
      }
      break

    case 'barcode':
      if ('textHeight' in element && element.textHeight < 0) {
        throw new Error(`textHeight cannot be negative at label ${labelIdx}, element ${elemIdx}`)
      }
      if ('barPixels' in element && (element.barPixels < 1 || element.barPixels > 7)) {
        throw new Error(
          `barPixels must be between 1 and 7 at label ${labelIdx}, element ${elemIdx}`
        )
      }
      break

    case 'image':
      if ('threshold' in element) {
        const t = element.threshold
        if ((t < 0 || t > 255) && t !== 256 && t !== 257) {
          throw new Error(
            `threshold must be 0-255, 256 (halftone), or 257 (color) ` +
              `at label ${labelIdx}, element ${elemIdx}`
          )
        }
      }
      break

    case 'rectangle':
    case 'ellipse':
      if ('lineWidth' in element && element.lineWidth < 0) {
        throw new Error(`lineWidth cannot be negative at label ${labelIdx}, element ${elemIdx}`)
      }
      break

    case 'line':
      if ('lineWidth' in element && element.lineWidth < 0) {
        throw new Error(`lineWidth cannot be negative at label ${labelIdx}, element ${elemIdx}`)
      }
      if ('dashLens' in element && !Array.isArray(element.dashLens)) {
        throw new Error(`dashLens must be an array at label ${labelIdx}, element ${elemIdx}`)
      }
      break
  }

  // Common orientation validation
  if ('orientation' in element) {
    const validOrientations = [0, 90, 180, 270]
    if (!validOrientations.includes(element.orientation)) {
      throw new Error(
        `orientation must be 0, 90, 180, or 270 at label ${labelIdx}, element ${elemIdx}`
      )
    }
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts points to millimeters (for font sizes)
 * @param {number} points - Font size in points
 * @returns {number} Size in millimeters
 */
function pointsToMM(points) {
  return (points * 25.4) / 72
}

/**
 * Converts millimeters to points (for font sizes)
 * @param {number} mm - Size in millimeters
 * @returns {number} Font size in points
 */
function mmToPoints(mm) {
  return (mm * 72) / 25.4
}

/**
 * Creates a text element
 * @param {string} text - Text content
 * @param {Object} properties - Element properties
 * @returns {Object} Text element
 */
function createTextElement(text, properties = {}) {
  return {
    type: 'text',
    text,
    ...properties
  }
}

/**
 * Creates a barcode element
 * @param {string} text - Barcode content
 * @param {Object} properties - Element properties
 * @returns {Object} Barcode element
 */
function createBarcodeElement(text, properties = {}) {
  return {
    type: 'barcode',
    text,
    ...properties
  }
}

/**
 * Creates a QR code element
 * @param {string} text - QR code content
 * @param {Object} properties - Element properties
 * @returns {Object} QR code element
 */
function createQRCodeElement(text, properties = {}) {
  return {
    type: 'qrcode',
    text,
    ...properties
  }
}

/**
 * Creates a PDF417 element
 * @param {string} text - PDF417 content
 * @param {Object} properties - Element properties
 * @returns {Object} PDF417 element
 */
function createPDF417Element(text, properties = {}) {
  return {
    type: 'pdf417',
    text,
    ...properties
  }
}

/**
 * Creates an image element
 * @param {string} imageFile - Image file path
 * @param {Object} properties - Element properties
 * @returns {Object} Image element
 */
function createImageElement(imageFile, properties = {}) {
  return {
    type: 'image',
    imageFile,
    ...properties
  }
}

/**
 * Creates a rectangle element
 * @param {Object} properties - Element properties
 * @returns {Object} Rectangle element
 */
function createRectangleElement(properties = {}) {
  return {
    type: 'rectangle',
    ...properties
  }
}

/**
 * Creates an ellipse element
 * @param {Object} properties - Element properties
 * @returns {Object} Ellipse element
 */
function createEllipseElement(properties = {}) {
  return {
    type: 'ellipse',
    ...properties
  }
}

/**
 * Creates a line element
 * @param {Object} properties - Element properties
 * @returns {Object} Line element
 */
function createLineElement(properties = {}) {
  return {
    type: 'line',
    ...properties
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  buildJobPages,
  pointsToMM,
  mmToPoints,
  createTextElement,
  createBarcodeElement,
  createQRCodeElement,
  createPDF417Element,
  createImageElement,
  createRectangleElement,
  createEllipseElement,
  createLineElement
}
// Export enums for reference
export const enums = {
  alignment: alignmentMap,
  fontStyle: fontStyleMap,
  autoReturn: autoReturnMap,
  barcodeType: barcodeTypeMap,
  qrEcc: qrEccMap,
  qrEncoding: qrEncodingMap,
  pdf417Ecc: pdf417EccMap
}
