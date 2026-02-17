// export class LabelGenerator {
//   // Fixed constants
//   static PAPER_WIDTH = 48
//   static PAPER_HEIGHT = 54
//   static CONTAINER_X = 1
//   static CONTAINER_Y = 1
//   static CONTAINER_WIDTH = 46
//   static CONTAINER_HEIGHT = 52
//   static CONTAINER_LINE_WIDTH = 0.5

//   constructor(options = {}) {
//     /**
//      * Initialize label generator with fixed dimensions.
//      * All dimensions are constants and cannot be changed.
//      */
//     this.margin = 2

//     // Granular font size controls for header
//     this.facilityNameFontSize = options.facilityNameFontSize || 3.2
//     this.facilityAddressFontSize = options.facilityAddressFontSize || 1.5
//     this.facilityPhoneFontSize = options.facilityPhoneFontSize || 1.5

//     // Product name emphasis control
//     // 'normal' - standard outline box
//     // 'bold' - double border for emphasis
//     // 'inverse' - black background with white text (requires image generation)
//     this.productNameStyle = options.productNameStyle || 'normal'

//     // Instruction font size constraints
//     this.instructionMaxFontSize = options.instructionMaxFontSize || 4.0
//     this.instructionMinFontSize = options.instructionMinFontSize || 2.0
//   }

//   _createContainer() {
//     return {
//       type: 'rectangle',
//       x: LabelGenerator.CONTAINER_X,
//       y: LabelGenerator.CONTAINER_Y,
//       width: LabelGenerator.CONTAINER_WIDTH,
//       height: LabelGenerator.CONTAINER_HEIGHT,
//       lineWidth: LabelGenerator.CONTAINER_LINE_WIDTH,
//       fillColor: null
//     }
//   }

//   /**
//    * Calculate optimal font size with proper word wrapping
//    * @param {string} text - Text to fit
//    * @param {number} availableWidth - Available width in mm
//    * @param {number} availableHeight - Available height in mm
//    * @param {number} minFont - Minimum font size in mm
//    * @param {number} maxFont - Maximum font size in mm
//    * @param {number} lineSpacing - Line spacing multiplier (default 1.3)
//    * @returns {number} Optimal font size
//    */
//   _calculateOptimalFontSize(
//     text,
//     availableWidth,
//     availableHeight,
//     minFont,
//     maxFont,
//     lineSpacing = 1.3
//   ) {
//     // Try font sizes from max to min
//     for (let fontSize = maxFont; fontSize >= minFont; fontSize -= 0.1) {
//       const lines = this._wrapTextByWords(text, availableWidth, fontSize)
//       const textHeight = fontSize * lines.length * lineSpacing

//       if (textHeight <= availableHeight) {
//         return Math.round(fontSize * 10) / 10 // Round to 1 decimal
//       }
//     }

//     return minFont
//   }

//   /**
//    * Wrap text by words (break on spaces only)
//    * @param {string} text - Text to wrap
//    * @param {number} maxWidth - Maximum width in mm
//    * @param {number} fontSize - Font size in mm
//    * @param {number} charWidthRatio - Character width ratio (default 0.6)
//    * @returns {Array<string>} Array of text lines
//    */
//   _wrapTextByWords(text, maxWidth, fontSize, charWidthRatio = 0.6) {
//     const charWidth = fontSize * charWidthRatio
//     const maxCharsPerLine = Math.floor(maxWidth / charWidth)

//     if (maxCharsPerLine <= 0) return [text]

//     const words = text.split(' ')
//     const lines = []
//     let currentLine = ''

//     for (const word of words) {
//       const testLine = currentLine ? `${currentLine} ${word}` : word

//       if (testLine.length <= maxCharsPerLine) {
//         currentLine = testLine
//       } else {
//         // If current line has content, push it
//         if (currentLine) {
//           lines.push(currentLine)
//           currentLine = word
//         } else {
//           // Word is too long, force it on its own line
//           lines.push(word)
//           currentLine = ''
//         }
//       }
//     }

//     if (currentLine) {
//       lines.push(currentLine)
//     }

//     return lines
//   }

//   /**
//    * Calculate text height based on font size and number of lines
//    */
//   _calculateTextHeight(fontSize, maxLines, lineSpacing = 1.3) {
//     return fontSize * maxLines * lineSpacing
//   }

//   /**
//    * Calculate font size for text that needs to fit in specific number of lines
//    */
//   _calculateFontSizeForLines(text, maxCharsPerLine, maxFont, minFont, maxLines = 1) {
//     const textLength = text.length
//     const totalCapacity = maxCharsPerLine * maxLines

//     if (textLength <= maxCharsPerLine) {
//       return maxFont
//     } else if (textLength <= totalCapacity) {
//       const ratio = maxCharsPerLine / (textLength / maxLines)
//       const fontSize = maxFont * ratio
//       return Math.max(minFont, Math.min(maxFont, fontSize))
//     } else {
//       return minFont
//     }
//   }

//   /**
//    * Truncate text to fit within constraints when minimum font size is reached
//    * @param {string} text - Text to truncate
//    * @param {number} maxWidth - Maximum width in mm
//    * @param {number} maxHeight - Maximum height in mm
//    * @param {number} fontSize - Font size in mm
//    * @param {number} lineSpacing - Line spacing multiplier
//    * @returns {string} Truncated text
//    */
//   _truncateTextToFit(text, maxWidth, maxHeight, fontSize, lineSpacing = 1.3) {
//     const charWidth = fontSize * 0.6
//     const maxCharsPerLine = Math.floor(maxWidth / charWidth)
//     const maxLines = Math.floor(maxHeight / (fontSize * lineSpacing))
//     const maxChars = maxCharsPerLine * maxLines

//     if (text.length <= maxChars) {
//       return text
//     }

//     // Truncate and add ellipsis
//     const words = text.split(' ')
//     let truncated = ''

//     for (const word of words) {
//       const testText = truncated ? `${truncated} ${word}` : word
//       if (testText.length + 3 <= maxChars) {
//         // +3 for "..."
//         truncated = testText
//       } else {
//         break
//       }
//     }

//     return truncated + '...'
//   }

//   generateLabel({
//     facilityName,
//     facilityAddress,
//     facilityPhone,
//     drugName,
//     instruction,
//     patientName,
//     dispensedBy,
//     timestamp,
//     warning,
//     printerName = 'DP27P Label Printer'
//   }) {
//     const contentWidth = LabelGenerator.PAPER_WIDTH - 2 * this.margin
//     const elements = []

//     // ---- Bottom section calculations ----
//     const warningMaxLines = 3
//     const warningFont = 2.3
//     let warningHeight = this._calculateTextHeight(warningFont, warningMaxLines, 1.2)
//     warningHeight = Math.max(warningHeight, 5)

//     const separatorHeight = 1
//     const dispRowHeight = 3
//     const patientRowHeight = 3

//     const warningY = LabelGenerator.CONTAINER_Y + LabelGenerator.CONTAINER_HEIGHT - warningHeight
//     const separatorY = warningY - separatorHeight
//     const dispY = separatorY - dispRowHeight - 1
//     const patientY = dispY - patientRowHeight - 1

//     // ---- Top section with configurable font sizes ----
//     let currentY = this.margin

//     // Use configurable font sizes for header
//     const facilityFont = this.facilityNameFontSize
//     const facilityHeight = facilityFont * 1.2 // Height based on font size

//     const addressFont = this.facilityAddressFontSize
//     const addressHeight = addressFont * 1.2

//     const phoneFont = this.facilityPhoneFontSize
//     const phoneHeight = phoneFont * 1.2

//     const headerHeight = facilityHeight + addressHeight + phoneHeight + 0.5

//     // Drug name section
//     const drugMaxLines = 2
//     const drugFont = this._calculateFontSizeForLines(drugName, 25, 3.5, 2.5, drugMaxLines)
//     let drugHeight = this._calculateTextHeight(drugFont, drugMaxLines, 1.1)
//     drugHeight = Math.max(drugHeight, 5)

//     const topSectionHeight = headerHeight + drugHeight + 1

//     // ---- Instruction area with minimum font size handling ----
//     const instructionStartY = this.margin + topSectionHeight
//     const instructionAvailableHeight = patientY - instructionStartY - 1

//     let instructionFont = this._calculateOptimalFontSize(
//       instruction,
//       contentWidth,
//       instructionAvailableHeight,
//       this.instructionMinFontSize,
//       this.instructionMaxFontSize,
//       1.3
//     )

//     // Truncate instruction if it doesn't fit even at minimum font size
//     let displayInstruction = instruction
//     if (instructionFont === this.instructionMinFontSize) {
//       // Check if text fits, if not, truncate
//       const lines = this._wrapTextByWords(instruction, contentWidth, instructionFont)
//       const requiredHeight = instructionFont * lines.length * 1.3

//       if (requiredHeight > instructionAvailableHeight) {
//         displayInstruction = this._truncateTextToFit(
//           instruction,
//           contentWidth,
//           instructionAvailableHeight,
//           instructionFont,
//           1.3
//         )
//       }
//     }

//     // ---- Elements ----

//     // Outer border
//     elements.push({
//       type: 'rectangle',
//       x: 1,
//       y: 1,
//       width: LabelGenerator.PAPER_WIDTH - 2,
//       height: LabelGenerator.PAPER_HEIGHT - 2,
//       lineWidth: 0.5
//     })

//     // Facility name
//     elements.push({
//       type: 'text',
//       text: facilityName,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: facilityHeight,
//       fontHeight: facilityFont,
//       fontName: 'Arial',
//       fontStyle: 1, // Bold
//       horizontalAlignment: 1, // Center
//       verticalAlignment: 1, // Center
//       autoReturn: 2 // Word wrap (LPA_AutoReturnMode.Word)
//     })
//     currentY += facilityHeight

//     // Address
//     elements.push({
//       type: 'text',
//       text: facilityAddress,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: addressHeight,
//       fontHeight: addressFont,
//       fontName: 'Arial',
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })
//     currentY += addressHeight

//     // Phone
//     elements.push({
//       type: 'text',
//       text: facilityPhone,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: phoneHeight,
//       fontHeight: phoneFont,
//       fontName: 'Arial',
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })
//     currentY += phoneHeight + 0.5

//     // Drug box - styling based on productNameStyle setting
//     if (this.productNameStyle === 'bold') {
//       // Double border for emphasis
//       elements.push({
//         type: 'rectangle',
//         x: this.margin,
//         y: currentY,
//         width: contentWidth,
//         height: drugHeight,
//         lineWidth: 1.0, // Thicker outer border
//         fill: false
//       })

//       // Inner border for "bold box" effect
//       elements.push({
//         type: 'rectangle',
//         x: this.margin + 0.5,
//         y: currentY + 0.5,
//         width: contentWidth - 1.0,
//         height: drugHeight - 1.0,
//         lineWidth: 0.3,
//         fill: false
//       })
//     } else if (this.productNameStyle === 'inverse') {
//       // Black filled background - text will be rendered as white
//       // Note: This requires printer support for inverse printing
//       elements.push({
//         type: 'rectangle',
//         x: this.margin,
//         y: currentY,
//         width: contentWidth,
//         height: drugHeight,
//         lineWidth: 0.5,
//         fill: true // Black background
//       })

//       // Add a marker to indicate this text should be inverse
//       // (Implementation depends on printer capabilities)
//     } else {
//       // Normal outlined rectangle
//       elements.push({
//         type: 'rectangle',
//         x: this.margin,
//         y: currentY,
//         width: contentWidth,
//         height: drugHeight,
//         lineWidth: 0.5,
//         fill: false
//       })
//     }

//     elements.push({
//       type: 'text',
//       text: drugName,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: drugHeight,
//       fontHeight: drugFont,
//       fontName: 'Arial',
//       fontStyle: 1, // Bold
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 2, // Word wrap
//       // Note: For 'inverse' style, you may need to handle text color
//       // differently depending on your printer's capabilities
//       inverse: this.productNameStyle === 'inverse' // Custom flag for inverse text
//     })
//     currentY += drugHeight + 1

//     // Instruction with word wrapping
//     elements.push({
//       type: 'text',
//       text: displayInstruction,
//       x: this.margin,
//       y: instructionStartY,
//       width: contentWidth,
//       height: instructionAvailableHeight,
//       fontHeight: instructionFont,
//       fontName: 'Arial',
//       fontStyle: 1, // Bold
//       lineSpacing: 1.3,
//       horizontalAlignment: 0, // Left aligned
//       verticalAlignment: 0, // Top aligned
//       autoReturn: 2 // Word wrap (LPA_AutoReturnMode.Word)
//     })

//     // Patient row
//     const patientLabelWidth = 7
//     const patientFont = 2.5

//     elements.push({
//       type: 'text',
//       text: 'Patient:',
//       x: this.margin,
//       y: patientY,
//       width: patientLabelWidth,
//       height: patientRowHeight,
//       fontHeight: patientFont,
//       fontName: 'Arial',
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     elements.push({
//       type: 'text',
//       text: patientName,
//       x: this.margin + patientLabelWidth,
//       y: patientY,
//       width: contentWidth - patientLabelWidth,
//       height: patientRowHeight,
//       fontHeight: patientFont,
//       fontName: 'Arial',
//       fontStyle: 1, // Bold
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     // Timestamp + dispensed by
//     const timestampWidth = 22
//     const dispLabelWidth = 7
//     const dispBoxWidth = 14
//     const dispFont = 2.2

//     elements.push({
//       type: 'text',
//       text: timestamp,
//       x: this.margin,
//       y: dispY,
//       width: timestampWidth,
//       height: dispRowHeight,
//       fontHeight: 2.0,
//       fontName: 'Arial',
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     const dispX = this.margin + timestampWidth + 1

//     elements.push({
//       type: 'text',
//       text: 'Disp by:',
//       x: dispX,
//       y: dispY,
//       width: dispLabelWidth,
//       height: dispRowHeight,
//       fontHeight: dispFont,
//       fontName: 'Arial',
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     elements.push({
//       type: 'rectangle',
//       x: dispX + dispLabelWidth,
//       y: dispY,
//       width: dispBoxWidth,
//       height: dispRowHeight,
//       lineWidth: 0.2,
//       fillColor: null
//     })

//     elements.push({
//       type: 'text',
//       text: dispensedBy,
//       x: dispX + dispLabelWidth + 0.5,
//       y: dispY,
//       width: dispBoxWidth - 1,
//       height: dispRowHeight,
//       fontHeight: dispFont,
//       fontName: 'Arial',
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     // Separator
//     elements.push({
//       type: 'line',
//       x1: this.margin,
//       y1: separatorY,
//       x2: LabelGenerator.CONTAINER_X + LabelGenerator.CONTAINER_WIDTH,
//       y2: separatorY,
//       lineWidth: 0.2
//     })

//     // Warning
//     const warningIconWidth = 4

//     elements.push({
//       type: 'text',
//       text: '⚠',
//       x: this.margin,
//       y: warningY,
//       width: warningIconWidth,
//       height: warningHeight,
//       fontHeight: 4,
//       fontName: 'Arial',
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 0 // No wrap for icon
//     })

//     elements.push({
//       type: 'text',
//       text: warning,
//       x: this.margin + warningIconWidth + 0.5,
//       y: warningY,
//       width: contentWidth - warningIconWidth - 0.5,
//       height: warningHeight,
//       fontHeight: warningFont,
//       fontName: 'Arial',
//       lineSpacing: 1.2,
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     return {
//       printerInfo: {
//         printerName
//       },
//       jobInfo: {
//         jobWidth: LabelGenerator.PAPER_WIDTH,
//         jobHeight: LabelGenerator.PAPER_HEIGHT,
//         orientation: 0
//       },
//       jobPages: [elements]
//     }
//   }
// }

// export class LabelGenerator {
//   // Fixed constants
//   static PAPER_WIDTH = 48
//   static PAPER_HEIGHT = 54
//   static CONTAINER_X = 1
//   static CONTAINER_Y = 1
//   static CONTAINER_WIDTH = 46
//   static CONTAINER_HEIGHT = 52
//   static CONTAINER_LINE_WIDTH = 0.5

//   constructor(options = {}) {
//     /**
//      * Initialize label generator with fixed dimensions.
//      * All dimensions are constants and cannot be changed.
//      */
//     this.margin = 2

//     // Global font family configuration
//     this.globalFontFamily = options.globalFontFamily || 'Arial'

//     // Granular font size controls for header
//     this.facilityNameFontSize = options.facilityNameFontSize || 3.2
//     this.facilityAddressFontSize = options.facilityAddressFontSize || 1.8
//     this.facilityPhoneFontSize = options.facilityPhoneFontSize || 1.8

//     // Product name emphasis control
//     // 'normal' - standard outline box
//     // 'bold' - double border for emphasis
//     // 'inverse' - black background with white text (requires image generation)
//     this.productNameStyle = options.productNameStyle || 'normal'

//     // Instruction font size constraints
//     this.instructionMaxFontSize = options.instructionMaxFontSize || 10.0 // Increased default for large display
//     this.instructionMinFontSize = options.instructionMinFontSize || 2.0

//     // Warning configuration
//     this.warningMaxLines = options.warningMaxLines || 2
//     this.warningFontSize = options.warningFontSize || 2.3
//   }

//   _createContainer() {
//     return {
//       type: 'rectangle',
//       x: LabelGenerator.CONTAINER_X,
//       y: LabelGenerator.CONTAINER_Y,
//       width: LabelGenerator.CONTAINER_WIDTH,
//       height: LabelGenerator.CONTAINER_HEIGHT,
//       lineWidth: LabelGenerator.CONTAINER_LINE_WIDTH,
//       fillColor: null
//     }
//   }

//   /**
//    * Calculate optimal font size with proper word wrapping
//    * @param {string} text - Text to fit
//    * @param {number} availableWidth - Available width in mm
//    * @param {number} availableHeight - Available height in mm
//    * @param {number} minFont - Minimum font size in mm
//    * @param {number} maxFont - Maximum font size in mm
//    * @param {number} lineSpacing - Line spacing multiplier (default 1.3)
//    * @returns {number} Optimal font size
//    */
//   _calculateOptimalFontSize(
//     text,
//     availableWidth,
//     availableHeight,
//     minFont,
//     maxFont,
//     lineSpacing = 1.3
//   ) {
//     // Try font sizes from max to min
//     for (let fontSize = maxFont; fontSize >= minFont; fontSize -= 0.1) {
//       const lines = this._wrapTextByWords(text, availableWidth, fontSize)
//       const textHeight = fontSize * lines.length * lineSpacing

//       if (textHeight <= availableHeight) {
//         return Math.round(fontSize * 10) / 10 // Round to 1 decimal
//       }
//     }

//     return minFont
//   }

//   /**
//    * Calculate MAXIMUM font size to fill available space
//    * This method tries to use the largest possible font for the text
//    * Perfect for short instructions that should be displayed as large as possible
//    *
//    * @param {string} text - Text to fit
//    * @param {number} availableWidth - Available width in mm
//    * @param {number} availableHeight - Available height in mm
//    * @param {number} minFont - Minimum font size in mm
//    * @param {number} maxFont - Maximum font size in mm
//    * @param {number} lineSpacing - Line spacing multiplier (default 1.3)
//    * @returns {number} Maximum font size that fits
//    */
//   _calculateMaximumFontSize(
//     text,
//     availableWidth,
//     availableHeight,
//     minFont,
//     maxFont,
//     lineSpacing = 1.3
//   ) {
//     // For very short text (1-2 words), try to maximize font size
//     const words = text.split(' ').filter((w) => w.length > 0)

//     // Start from maximum and work down in smaller increments for better precision
//     for (let fontSize = maxFont; fontSize >= minFont; fontSize -= 0.05) {
//       const lines = this._wrapTextByWords(text, availableWidth, fontSize)
//       const textHeight = fontSize * lines.length * lineSpacing

//       if (textHeight <= availableHeight) {
//         return Math.round(fontSize * 10) / 10 // Round to 1 decimal
//       }
//     }

//     return minFont
//   }

//   /**
//    * Wrap text by words (break on spaces only)
//    * @param {string} text - Text to wrap
//    * @param {number} maxWidth - Maximum width in mm
//    * @param {number} fontSize - Font size in mm
//    * @param {number} charWidthRatio - Character width ratio (default 0.6)
//    * @returns {Array<string>} Array of text lines
//    */
//   _wrapTextByWords(text, maxWidth, fontSize, charWidthRatio = 0.6) {
//     const charWidth = fontSize * charWidthRatio
//     const maxCharsPerLine = Math.floor(maxWidth / charWidth)

//     if (maxCharsPerLine <= 0) return [text]

//     const words = text.split(' ')
//     const lines = []
//     let currentLine = ''

//     for (const word of words) {
//       const testLine = currentLine ? `${currentLine} ${word}` : word

//       if (testLine.length <= maxCharsPerLine) {
//         currentLine = testLine
//       } else {
//         // If current line has content, push it
//         if (currentLine) {
//           lines.push(currentLine)
//           currentLine = word
//         } else {
//           // Word is too long, force it on its own line
//           lines.push(word)
//           currentLine = ''
//         }
//       }
//     }

//     if (currentLine) {
//       lines.push(currentLine)
//     }

//     return lines
//   }

//   /**
//    * Calculate text height based on font size and number of lines
//    */
//   _calculateTextHeight(fontSize, maxLines, lineSpacing = 1.3) {
//     return fontSize * maxLines * lineSpacing
//   }

//   /**
//    * Calculate font size for text that needs to fit in specific number of lines
//    */
//   _calculateFontSizeForLines(text, maxCharsPerLine, maxFont, minFont, maxLines = 1) {
//     const textLength = text.length
//     const totalCapacity = maxCharsPerLine * maxLines

//     if (textLength <= maxCharsPerLine) {
//       return maxFont
//     } else if (textLength <= totalCapacity) {
//       const ratio = maxCharsPerLine / (textLength / maxLines)
//       const fontSize = maxFont * ratio
//       return Math.max(minFont, Math.min(maxFont, fontSize))
//     } else {
//       return minFont
//     }
//   }

//   /**
//    * Truncate text to fit within constraints when minimum font size is reached
//    * @param {string} text - Text to truncate
//    * @param {number} maxWidth - Maximum width in mm
//    * @param {number} maxHeight - Maximum height in mm
//    * @param {number} fontSize - Font size in mm
//    * @param {number} lineSpacing - Line spacing multiplier
//    * @returns {string} Truncated text
//    */
//   _truncateTextToFit(text, maxWidth, maxHeight, fontSize, lineSpacing = 1.3) {
//     const charWidth = fontSize * 0.6
//     const maxCharsPerLine = Math.floor(maxWidth / charWidth)
//     const maxLines = Math.floor(maxHeight / (fontSize * lineSpacing))
//     const maxChars = maxCharsPerLine * maxLines

//     if (text.length <= maxChars) {
//       return text
//     }

//     // Truncate and add ellipsis
//     const words = text.split(' ')
//     let truncated = ''

//     for (const word of words) {
//       const testText = truncated ? `${truncated} ${word}` : word
//       if (testText.length + 3 <= maxChars) {
//         // +3 for "..."
//         truncated = testText
//       } else {
//         break
//       }
//     }

//     return truncated + '...'
//   }

//   generateLabel({
//     facilityName,
//     facilityAddress,
//     facilityPhone,
//     drugName,
//     instruction,
//     patientName,
//     dispensedBy,
//     timestamp,
//     warning,
//     printerName = 'DP27P Label Printer'
//   }) {
//     const contentWidth = LabelGenerator.PAPER_WIDTH - 2 * this.margin
//     const elements = []

//     // ---- Bottom section calculations (FIXED DIMENSIONS) ----
//     const warningFont = this.warningFontSize
//     let warningHeight = this._calculateTextHeight(warningFont, this.warningMaxLines, 1.2)
//     warningHeight = Math.max(warningHeight, 5)

//     const separatorHeight = 1
//     const dispRowHeight = 3
//     const patientRowHeight = 3

//     const warningY = LabelGenerator.CONTAINER_Y + LabelGenerator.CONTAINER_HEIGHT - warningHeight
//     const separatorY = warningY - separatorHeight
//     const dispY = separatorY - dispRowHeight - 1
//     const patientY = dispY - patientRowHeight - 1

//     // ---- Top section with configurable font sizes (FIXED DIMENSIONS) ----
//     let currentY = this.margin

//     // Use configurable font sizes for header
//     const facilityFont = this.facilityNameFontSize
//     const facilityHeight = facilityFont * 1.2 // Height based on font size

//     const addressFont = this.facilityAddressFontSize
//     const addressHeight = addressFont * 1.2

//     const phoneFont = this.facilityPhoneFontSize
//     const phoneHeight = phoneFont * 1.2

//     const headerHeight = facilityHeight + addressHeight + phoneHeight + 0.5

//     // Drug name section (FIXED DIMENSIONS)
//     const drugMaxLines = 2
//     const drugFont = this._calculateFontSizeForLines(drugName, 25, 3.5, 2.5, drugMaxLines)
//     let drugHeight = this._calculateTextHeight(drugFont, drugMaxLines, 1.1)
//     drugHeight = Math.max(drugHeight, 5)

//     const topSectionHeight = headerHeight + drugHeight + 1

//     // ---- Calculate MAXIMUM available space for instruction ----
//     const instructionStartY = this.margin + topSectionHeight
//     const instructionAvailableHeight = patientY - instructionStartY - 1

//     // ---- MAXIMIZE instruction font size to fill available space ----
//     let instructionFont = this._calculateMaximumFontSize(
//       instruction,
//       contentWidth,
//       instructionAvailableHeight,
//       this.instructionMinFontSize,
//       this.instructionMaxFontSize,
//       1.3
//     )

//     // Truncate instruction if it doesn't fit even at minimum font size
//     let displayInstruction = instruction
//     if (instructionFont === this.instructionMinFontSize) {
//       // Check if text fits, if not, truncate
//       const lines = this._wrapTextByWords(instruction, contentWidth, instructionFont)
//       const requiredHeight = instructionFont * lines.length * 1.3

//       if (requiredHeight > instructionAvailableHeight) {
//         displayInstruction = this._truncateTextToFit(
//           instruction,
//           contentWidth,
//           instructionAvailableHeight,
//           instructionFont,
//           1.3
//         )
//       }
//     }

//     // ---- Elements ----

//     // Outer border
//     elements.push({
//       type: 'rectangle',
//       x: 1,
//       y: 1,
//       width: LabelGenerator.PAPER_WIDTH - 2,
//       height: LabelGenerator.PAPER_HEIGHT - 2,
//       lineWidth: 0.5
//     })

//     // Facility name
//     elements.push({
//       type: 'text',
//       text: facilityName,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: facilityHeight,
//       fontHeight: facilityFont,
//       fontName: this.globalFontFamily,
//       fontStyle: 1, // Bold
//       horizontalAlignment: 1, // Center
//       verticalAlignment: 1, // Center
//       autoReturn: 2 // Word wrap (LPA_AutoReturnMode.Word)
//     })
//     currentY += facilityHeight

//     // Address
//     elements.push({
//       type: 'text',
//       text: facilityAddress,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: addressHeight,
//       fontHeight: addressFont,
//       fontName: this.globalFontFamily,
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })
//     currentY += addressHeight

//     // Phone
//     elements.push({
//       type: 'text',
//       text: facilityPhone,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: phoneHeight,
//       fontHeight: phoneFont,
//       fontName: this.globalFontFamily,
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })
//     currentY += phoneHeight + 0.5

//     // Drug box - styling based on productNameStyle setting
//     if (this.productNameStyle === 'bold') {
//       // Double border for emphasis
//       elements.push({
//         type: 'rectangle',
//         x: this.margin,
//         y: currentY,
//         width: contentWidth,
//         height: drugHeight,
//         lineWidth: 1.0, // Thicker outer border
//         fill: false
//       })

//       // Inner border for "bold box" effect
//       elements.push({
//         type: 'rectangle',
//         x: this.margin + 0.5,
//         y: currentY + 0.5,
//         width: contentWidth - 1.0,
//         height: drugHeight - 1.0,
//         lineWidth: 0.3,
//         fill: false
//       })
//     } else if (this.productNameStyle === 'inverse') {
//       // Black filled background - text will be rendered as white
//       // Note: This requires printer support for inverse printing
//       elements.push({
//         type: 'rectangle',
//         x: this.margin,
//         y: currentY,
//         width: contentWidth,
//         height: drugHeight,
//         lineWidth: 0.5,
//         fill: true // Black background
//       })

//       // Add a marker to indicate this text should be inverse
//       // (Implementation depends on printer capabilities)
//     } else {
//       // Normal outlined rectangle
//       elements.push({
//         type: 'rectangle',
//         x: this.margin,
//         y: currentY,
//         width: contentWidth,
//         height: drugHeight,
//         lineWidth: 0.5,
//         fill: false
//       })
//     }

//     elements.push({
//       type: 'text',
//       text: drugName,
//       x: this.margin,
//       y: currentY,
//       width: contentWidth,
//       height: drugHeight,
//       fontHeight: drugFont,
//       fontName: this.globalFontFamily,
//       fontStyle: 1, // Bold
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 2, // Word wrap
//       // Note: For 'inverse' style, you may need to handle text color
//       // differently depending on your printer's capabilities
//       inverse: this.productNameStyle === 'inverse' // Custom flag for inverse text
//     })
//     currentY += drugHeight + 1

//     // Instruction with MAXIMIZED font size and word wrapping
//     elements.push({
//       type: 'text',
//       text: displayInstruction,
//       x: this.margin,
//       y: instructionStartY,
//       width: contentWidth,
//       height: instructionAvailableHeight,
//       fontHeight: instructionFont,
//       fontName: this.globalFontFamily,
//       fontStyle: 1, // Bold
//       lineSpacing: 1.3,
//       horizontalAlignment: 0, // Left aligned
//       verticalAlignment: 0, // Top aligned
//       autoReturn: 2 // Word wrap (LPA_AutoReturnMode.Word)
//     })

//     // Patient row
//     const patientLabelWidth = 7
//     const patientFont = 2.5

//     elements.push({
//       type: 'text',
//       text: 'Patient:',
//       x: this.margin,
//       y: patientY,
//       width: patientLabelWidth,
//       height: patientRowHeight,
//       fontHeight: patientFont,
//       fontName: this.globalFontFamily,
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     elements.push({
//       type: 'text',
//       text: patientName,
//       x: this.margin + patientLabelWidth,
//       y: patientY,
//       width: contentWidth - patientLabelWidth,
//       height: patientRowHeight,
//       fontHeight: patientFont,
//       fontName: this.globalFontFamily,
//       fontStyle: 1, // Bold
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     // Timestamp + dispensed by
//     const timestampWidth = 22
//     const dispLabelWidth = 7
//     const dispBoxWidth = 14
//     const dispFont = 2.2

//     elements.push({
//       type: 'text',
//       text: timestamp,
//       x: this.margin,
//       y: dispY,
//       width: timestampWidth,
//       height: dispRowHeight,
//       fontHeight: 2.0,
//       fontName: this.globalFontFamily,
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     const dispX = this.margin + timestampWidth + 1

//     elements.push({
//       type: 'text',
//       text: 'Disp by:',
//       x: dispX,
//       y: dispY,
//       width: dispLabelWidth,
//       height: dispRowHeight,
//       fontHeight: dispFont,
//       fontName: this.globalFontFamily,
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     elements.push({
//       type: 'rectangle',
//       x: dispX + dispLabelWidth,
//       y: dispY,
//       width: dispBoxWidth,
//       height: dispRowHeight,
//       lineWidth: 0.2,
//       fillColor: null
//     })

//     // Dispensed by name (BOLD)
//     elements.push({
//       type: 'text',
//       text: dispensedBy,
//       x: dispX + dispLabelWidth + 0.5,
//       y: dispY,
//       width: dispBoxWidth - 1,
//       height: dispRowHeight,
//       fontHeight: dispFont,
//       fontName: this.globalFontFamily,
//       fontStyle: 1, // Bold
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     // Separator
//     elements.push({
//       type: 'line',
//       x1: this.margin,
//       y1: separatorY,
//       x2: LabelGenerator.CONTAINER_X + LabelGenerator.CONTAINER_WIDTH,
//       y2: separatorY,
//       lineWidth: 0.2
//     })

//     // Warning
//     const warningIconWidth = 4

//     elements.push({
//       type: 'text',
//       text: '⚠',
//       x: this.margin,
//       y: warningY,
//       width: warningIconWidth,
//       height: warningHeight,
//       fontHeight: 4,
//       fontName: this.globalFontFamily,
//       horizontalAlignment: 1,
//       verticalAlignment: 1,
//       autoReturn: 0 // No wrap for icon
//     })

//     elements.push({
//       type: 'text',
//       text: warning,
//       x: this.margin + warningIconWidth + 0.5,
//       y: warningY,
//       width: contentWidth - warningIconWidth - 0.5,
//       height: warningHeight,
//       fontHeight: warningFont,
//       fontName: this.globalFontFamily,
//       lineSpacing: 1.2,
//       horizontalAlignment: 0,
//       verticalAlignment: 1,
//       autoReturn: 2 // Word wrap
//     })

//     return {
//       printerInfo: {
//         printerName
//       },
//       jobInfo: {
//         jobWidth: LabelGenerator.PAPER_WIDTH,
//         jobHeight: LabelGenerator.PAPER_HEIGHT,
//         orientation: 0
//       },
//       jobPages: [elements]
//     }
//   }
// }

export class LabelGenerator {
  // Fixed constants
  static PAPER_WIDTH = 48
  static PAPER_HEIGHT = 54
  static CONTAINER_X = 1
  static CONTAINER_Y = 1
  static CONTAINER_WIDTH = 46
  static CONTAINER_HEIGHT = 52
  static CONTAINER_LINE_WIDTH = 0.5

  constructor(options = {}) {
    /**
     * Initialize label generator with fixed dimensions.
     * All dimensions are constants and cannot be changed.
     */
    this.margin = 2

    // Global font family configuration
    this.globalFontFamily = options.globalFontFamily || 'Arial'

    // Font weight enhancements
    this.productNameFontStyle = options.productNameFontStyle || 1 // 0=Regular, 1=Bold, 3=BoldItalic
    this.instructionFontStyle = options.instructionFontStyle || 1 // 0=Regular, 1=Bold, 3=BoldItalic

    // Granular font size controls for header
    this.facilityNameFontSize = options.facilityNameFontSize || 3.2
    this.facilityAddressFontSize = options.facilityAddressFontSize || 1.8
    this.facilityPhoneFontSize = options.facilityPhoneFontSize || 1.8

    // Product name emphasis control
    // 'normal' - standard outline box
    // 'bold' - double border for emphasis
    // 'inverse' - black background with white text (requires image generation)
    this.productNameStyle = options.productNameStyle || 'normal'

    // Instruction font size constraints
    this.instructionMaxFontSize = options.instructionMaxFontSize || 10.0 // Increased default for large display
    this.instructionMinFontSize = options.instructionMinFontSize || 2.0

    // Warning configuration
    this.warningMaxLines = options.warningMaxLines || 2
    this.warningFontSize = options.warningFontSize || 2.3
  }

  _createContainer() {
    return {
      type: 'rectangle',
      x: LabelGenerator.CONTAINER_X,
      y: LabelGenerator.CONTAINER_Y,
      width: LabelGenerator.CONTAINER_WIDTH,
      height: LabelGenerator.CONTAINER_HEIGHT,
      lineWidth: LabelGenerator.CONTAINER_LINE_WIDTH,
      fillColor: null
    }
  }

  /**
   * Calculate optimal font size with proper word wrapping
   * @param {string} text - Text to fit
   * @param {number} availableWidth - Available width in mm
   * @param {number} availableHeight - Available height in mm
   * @param {number} minFont - Minimum font size in mm
   * @param {number} maxFont - Maximum font size in mm
   * @param {number} lineSpacing - Line spacing multiplier (default 1.3)
   * @returns {number} Optimal font size
   */
  _calculateOptimalFontSize(
    text,
    availableWidth,
    availableHeight,
    minFont,
    maxFont,
    lineSpacing = 1.3
  ) {
    // Try font sizes from max to min
    for (let fontSize = maxFont; fontSize >= minFont; fontSize -= 0.1) {
      const lines = this._wrapTextByWords(text, availableWidth, fontSize)
      const textHeight = fontSize * lines.length * lineSpacing

      if (textHeight <= availableHeight) {
        return Math.round(fontSize * 10) / 10 // Round to 1 decimal
      }
    }

    return minFont
  }

  /**
   * Calculate MAXIMUM font size to fill available space
   * This method tries to use the largest possible font for the text
   * Perfect for short instructions that should be displayed as large as possible
   *
   * @param {string} text - Text to fit
   * @param {number} availableWidth - Available width in mm
   * @param {number} availableHeight - Available height in mm
   * @param {number} minFont - Minimum font size in mm
   * @param {number} maxFont - Maximum font size in mm
   * @param {number} lineSpacing - Line spacing multiplier (default 1.3)
   * @returns {number} Maximum font size that fits
   */
  _calculateMaximumFontSize(
    text,
    availableWidth,
    availableHeight,
    minFont,
    maxFont,
    lineSpacing = 1.3
  ) {
    // For very short text (1-2 words), try to maximize font size
    const words = text.split(' ').filter((w) => w.length > 0)

    // Start from maximum and work down in smaller increments for better precision
    for (let fontSize = maxFont; fontSize >= minFont; fontSize -= 0.05) {
      const lines = this._wrapTextByWords(text, availableWidth, fontSize)
      const textHeight = fontSize * lines.length * lineSpacing

      if (textHeight <= availableHeight) {
        return Math.round(fontSize * 10) / 10 // Round to 1 decimal
      }
    }

    return minFont
  }

  /**
   * Wrap text by words (break on spaces only)
   * @param {string} text - Text to wrap
   * @param {number} maxWidth - Maximum width in mm
   * @param {number} fontSize - Font size in mm
   * @param {number} charWidthRatio - Character width ratio (default 0.6)
   * @returns {Array<string>} Array of text lines
   */
  _wrapTextByWords(text, maxWidth, fontSize, charWidthRatio = 0.6) {
    const charWidth = fontSize * charWidthRatio
    const maxCharsPerLine = Math.floor(maxWidth / charWidth)

    if (maxCharsPerLine <= 0) return [text]

    const words = text.split(' ')
    const lines = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word

      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine
      } else {
        // If current line has content, push it
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
          // Word is too long, force it on its own line
          lines.push(word)
          currentLine = ''
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }

  /**
   * Calculate text height based on font size and number of lines
   */
  _calculateTextHeight(fontSize, maxLines, lineSpacing = 1.3) {
    return fontSize * maxLines * lineSpacing
  }

  /**
   * Calculate font size for text that needs to fit in specific number of lines
   */
  _calculateFontSizeForLines(text, maxCharsPerLine, maxFont, minFont, maxLines = 1) {
    const textLength = text.length
    const totalCapacity = maxCharsPerLine * maxLines

    if (textLength <= maxCharsPerLine) {
      return maxFont
    } else if (textLength <= totalCapacity) {
      const ratio = maxCharsPerLine / (textLength / maxLines)
      const fontSize = maxFont * ratio
      return Math.max(minFont, Math.min(maxFont, fontSize))
    } else {
      return minFont
    }
  }

  /**
   * Truncate text to fit within constraints when minimum font size is reached
   * @param {string} text - Text to truncate
   * @param {number} maxWidth - Maximum width in mm
   * @param {number} maxHeight - Maximum height in mm
   * @param {number} fontSize - Font size in mm
   * @param {number} lineSpacing - Line spacing multiplier
   * @returns {string} Truncated text
   */
  _truncateTextToFit(text, maxWidth, maxHeight, fontSize, lineSpacing = 1.3) {
    const charWidth = fontSize * 0.6
    const maxCharsPerLine = Math.floor(maxWidth / charWidth)
    const maxLines = Math.floor(maxHeight / (fontSize * lineSpacing))
    const maxChars = maxCharsPerLine * maxLines

    if (text.length <= maxChars) {
      return text
    }

    // Truncate and add ellipsis
    const words = text.split(' ')
    let truncated = ''

    for (const word of words) {
      const testText = truncated ? `${truncated} ${word}` : word
      if (testText.length + 3 <= maxChars) {
        // +3 for "..."
        truncated = testText
      } else {
        break
      }
    }

    return truncated + '...'
  }

  generateLabel({
    facilityName,
    facilityAddress,
    facilityPhone,
    drugName,
    instruction,
    patientName,
    dispensedBy,
    timestamp,
    warning,
    printerName = 'DP27P Label Printer'
  }) {
    const contentWidth = LabelGenerator.PAPER_WIDTH - 2 * this.margin
    const elements = []

    // ---- Bottom section calculations (FIXED DIMENSIONS) ----
    const warningFont = this.warningFontSize
    let warningHeight = this._calculateTextHeight(warningFont, this.warningMaxLines, 1.2)
    warningHeight = Math.max(warningHeight, 5)

    const separatorHeight = 1
    const dispRowHeight = 3
    const patientRowHeight = 3

    const warningY = LabelGenerator.CONTAINER_Y + LabelGenerator.CONTAINER_HEIGHT - warningHeight
    const separatorY = warningY - separatorHeight
    const dispY = separatorY - dispRowHeight - 1
    const patientY = dispY - patientRowHeight - 1

    // ---- Top section with configurable font sizes (FIXED DIMENSIONS) ----
    let currentY = this.margin

    // Use configurable font sizes for header
    const facilityFont = this.facilityNameFontSize
    const facilityHeight = facilityFont * 1.2 // Height based on font size

    const addressFont = this.facilityAddressFontSize
    const addressHeight = addressFont * 1.2

    const phoneFont = this.facilityPhoneFontSize
    const phoneHeight = phoneFont * 1.2

    const headerHeight = facilityHeight + addressHeight + phoneHeight + 0.5

    // Drug name section (FIXED DIMENSIONS)
    const drugMaxLines = 2
    const drugFont = this._calculateFontSizeForLines(drugName, 25, 3.5, 2.5, drugMaxLines)
    let drugHeight = this._calculateTextHeight(drugFont, drugMaxLines, 1.1)
    drugHeight = Math.max(drugHeight, 5)

    const topSectionHeight = headerHeight + drugHeight + 1

    // ---- Calculate MAXIMUM available space for instruction ----
    const instructionStartY = this.margin + topSectionHeight
    const instructionAvailableHeight = patientY - instructionStartY - 1

    // ---- MAXIMIZE instruction font size to fill available space ----
    let instructionFont = this._calculateMaximumFontSize(
      instruction,
      contentWidth,
      instructionAvailableHeight,
      this.instructionMinFontSize,
      this.instructionMaxFontSize,
      1.3
    )

    // Truncate instruction if it doesn't fit even at minimum font size
    let displayInstruction = instruction
    if (instructionFont === this.instructionMinFontSize) {
      // Check if text fits, if not, truncate
      const lines = this._wrapTextByWords(instruction, contentWidth, instructionFont)
      const requiredHeight = instructionFont * lines.length * 1.3

      if (requiredHeight > instructionAvailableHeight) {
        displayInstruction = this._truncateTextToFit(
          instruction,
          contentWidth,
          instructionAvailableHeight,
          instructionFont,
          1.3
        )
      }
    }

    // ---- Elements ----

    // Outer border
    elements.push({
      type: 'rectangle',
      x: 1,
      y: 1,
      width: LabelGenerator.PAPER_WIDTH - 2,
      height: LabelGenerator.PAPER_HEIGHT - 2,
      lineWidth: 0.5
    })

    // Facility name
    elements.push({
      type: 'text',
      text: facilityName,
      x: this.margin,
      y: currentY,
      width: contentWidth,
      height: facilityHeight,
      fontHeight: facilityFont,
      fontName: this.globalFontFamily,
      fontStyle: 1, // Bold
      horizontalAlignment: 1, // Center
      verticalAlignment: 1, // Center
      autoReturn: 2 // Word wrap (LPA_AutoReturnMode.Word)
    })
    currentY += facilityHeight

    // Address
    elements.push({
      type: 'text',
      text: facilityAddress,
      x: this.margin,
      y: currentY,
      width: contentWidth,
      height: addressHeight,
      fontHeight: addressFont,
      fontName: this.globalFontFamily,
      horizontalAlignment: 1,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })
    currentY += addressHeight

    // Phone
    elements.push({
      type: 'text',
      text: facilityPhone,
      x: this.margin,
      y: currentY,
      width: contentWidth,
      height: phoneHeight,
      fontHeight: phoneFont,
      fontName: this.globalFontFamily,
      horizontalAlignment: 1,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })
    currentY += phoneHeight + 0.5

    // Drug box - styling based on productNameStyle setting
    if (this.productNameStyle === 'bold') {
      // Double border for emphasis
      elements.push({
        type: 'rectangle',
        x: this.margin,
        y: currentY,
        width: contentWidth,
        height: drugHeight,
        lineWidth: 1.0, // Thicker outer border
        fill: false
      })

      // Inner border for "bold box" effect
      elements.push({
        type: 'rectangle',
        x: this.margin + 0.5,
        y: currentY + 0.5,
        width: contentWidth - 1.0,
        height: drugHeight - 1.0,
        lineWidth: 0.3,
        fill: false
      })
    } else if (this.productNameStyle === 'inverse') {
      // Black filled background - text will be rendered as white
      // Note: This requires printer support for inverse printing
      elements.push({
        type: 'rectangle',
        x: this.margin,
        y: currentY,
        width: contentWidth,
        height: drugHeight,
        lineWidth: 0.5,
        fill: true // Black background
      })

      // Add a marker to indicate this text should be inverse
      // (Implementation depends on printer capabilities)
    } else {
      // Normal outlined rectangle
      elements.push({
        type: 'rectangle',
        x: this.margin,
        y: currentY,
        width: contentWidth,
        height: drugHeight,
        lineWidth: 0.5,
        fill: false
      })
    }

    elements.push({
      type: 'text',
      text: drugName,
      x: this.margin,
      y: currentY,
      width: contentWidth,
      height: drugHeight,
      fontHeight: drugFont,
      fontName: this.globalFontFamily,
      fontStyle: this.productNameFontStyle, // Configurable font weight
      horizontalAlignment: 1,
      verticalAlignment: 1,
      autoReturn: 2, // Word wrap
      // Note: For 'inverse' style, you may need to handle text color
      // differently depending on your printer's capabilities
      inverse: this.productNameStyle === 'inverse' // Custom flag for inverse text
    })
    currentY += drugHeight + 1

    // Instruction with MAXIMIZED font size and word wrapping
    elements.push({
      type: 'text',
      text: displayInstruction,
      x: this.margin,
      y: instructionStartY,
      width: contentWidth,
      height: instructionAvailableHeight,
      fontHeight: instructionFont,
      fontName: this.globalFontFamily,
      fontStyle: this.instructionFontStyle, // Configurable font weight
      lineSpacing: 1.3,
      horizontalAlignment: 0, // Left aligned
      verticalAlignment: 0, // Top aligned
      autoReturn: 2 // Word wrap (LPA_AutoReturnMode.Word)
    })

    // Patient row
    const patientLabelWidth = 7
    const patientFont = 2.5

    elements.push({
      type: 'text',
      text: 'Patient:',
      x: this.margin,
      y: patientY,
      width: patientLabelWidth,
      height: patientRowHeight,
      fontHeight: patientFont,
      fontName: this.globalFontFamily,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })

    elements.push({
      type: 'text',
      text: patientName,
      x: this.margin + patientLabelWidth,
      y: patientY,
      width: contentWidth - patientLabelWidth,
      height: patientRowHeight,
      fontHeight: patientFont,
      fontName: this.globalFontFamily,
      fontStyle: 1, // Bold
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })

    // Timestamp + dispensed by
    const timestampWidth = 22
    const dispLabelWidth = 7
    const dispBoxWidth = 14
    const dispFont = 2.2

    elements.push({
      type: 'text',
      text: timestamp,
      x: this.margin,
      y: dispY,
      width: timestampWidth,
      height: dispRowHeight,
      fontHeight: 2.0,
      fontName: this.globalFontFamily,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })

    const dispX = this.margin + timestampWidth + 1

    elements.push({
      type: 'text',
      text: 'Disp by:',
      x: dispX,
      y: dispY,
      width: dispLabelWidth,
      height: dispRowHeight,
      fontHeight: dispFont,
      fontName: this.globalFontFamily,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })

    elements.push({
      type: 'rectangle',
      x: dispX + dispLabelWidth,
      y: dispY,
      width: dispBoxWidth,
      height: dispRowHeight,
      lineWidth: 0.2,
      fillColor: null
    })

    // Dispensed by name (BOLD)
    elements.push({
      type: 'text',
      text: dispensedBy,
      x: dispX + dispLabelWidth + 0.5,
      y: dispY,
      width: dispBoxWidth - 1,
      height: dispRowHeight,
      fontHeight: dispFont,
      fontName: this.globalFontFamily,
      fontStyle: 1, // Bold
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })

    // Separator
    elements.push({
      type: 'line',
      x1: this.margin,
      y1: separatorY,
      x2: LabelGenerator.CONTAINER_X + LabelGenerator.CONTAINER_WIDTH,
      y2: separatorY,
      lineWidth: 0.2
    })

    // Warning
    const warningIconWidth = 4

    elements.push({
      type: 'text',
      text: '⚠',
      x: this.margin,
      y: warningY,
      width: warningIconWidth,
      height: warningHeight,
      fontHeight: 4,
      fontName: this.globalFontFamily,
      horizontalAlignment: 1,
      verticalAlignment: 1,
      autoReturn: 0 // No wrap for icon
    })

    elements.push({
      type: 'text',
      text: warning,
      x: this.margin + warningIconWidth + 0.5,
      y: warningY,
      width: contentWidth - warningIconWidth - 0.5,
      height: warningHeight,
      fontHeight: warningFont,
      fontName: this.globalFontFamily,
      lineSpacing: 1.2,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2 // Word wrap
    })

    return {
      printerInfo: {
        printerName
      },
      jobInfo: {
        jobWidth: LabelGenerator.PAPER_WIDTH,
        jobHeight: LabelGenerator.PAPER_HEIGHT,
        orientation: 0
      },
      jobPages: [elements]
    }
  }
}
