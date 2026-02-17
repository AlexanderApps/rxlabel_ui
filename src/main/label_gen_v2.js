/**
 * LabelGeneratorV2 v4.0 - Theme-Based Architecture
 *
 * Redesigned with:
 * - Theme-based configuration system
 * - Automatic layout calculation
 * - Flexible element positioning
 * - Predefined themes + custom themes
 */

export class LabelGeneratorV2 {
  // Fixed paper dimensions
  static PAPER_WIDTH = 48
  static PAPER_HEIGHT = 54

  constructor() {
    this.margin = 2
    this.contentWidth = LabelGeneratorV2.PAPER_WIDTH - 2 * this.margin
    this.contentHeight = LabelGeneratorV2.PAPER_HEIGHT - 2 * this.margin
  }

  /**
   * Predefined themes
   */
  static THEMES = {
    // Default theme - balanced, professional
    default: {
      font: {
        family: 'Arial',
        defaultStyle: 1 // Bold
      },
      facilityName: {
        fontSize: 3.2,
        fontStyle: 1, // Bold
        align: 'center'
      },
      facilityAddress: {
        fontSize: 1.8,
        fontStyle: 0, // Regular
        align: 'center'
      },
      facilityPhone: {
        fontSize: 1.8,
        fontStyle: 0, // Regular
        align: 'center'
      },
      productName: {
        fontSize: { min: 2.5, max: 3.5 },
        fontStyle: 1, // Bold
        style: 'normal', // 'normal' | 'bold' | 'inverse'
        align: 'center'
      },
      instruction: {
        fontSize: { min: 2.0, max: 10.0 },
        fontStyle: 1, // Bold
        align: 'left',
        lineSpacing: 1.3
      },
      patient: {
        labelFontSize: 2.5,
        valueFontSize: 2.5,
        fontStyle: 1 // Bold for value
      },
      dispensedBy: {
        labelFontSize: 2.2,
        valueFontSize: 2.2,
        fontStyle: 1 // Bold for value
      },
      timestamp: {
        fontSize: 2.0,
        fontStyle: 0 // Regular
      },
      warning: {
        fontSize: 2.3,
        fontStyle: 0, // Regular
        maxLines: 2,
        iconSize: 4.0
      },
      spacing: {
        headerGap: 0.5,
        sectionGap: 1.0,
        footerGap: 1.0
      }
    },

    // Bold theme - maximum impact
    bold: {
      font: {
        family: 'Arial Black',
        defaultStyle: 1
      },
      facilityName: {
        fontSize: 3.8,
        fontStyle: 1,
        align: 'center'
      },
      facilityAddress: {
        fontSize: 2.0,
        fontStyle: 1,
        align: 'center'
      },
      facilityPhone: {
        fontSize: 2.0,
        fontStyle: 1,
        align: 'center'
      },
      productName: {
        fontSize: { min: 3.0, max: 4.0 },
        fontStyle: 1,
        style: 'bold', // Double border
        align: 'center'
      },
      instruction: {
        fontSize: { min: 2.5, max: 12.0 },
        fontStyle: 1,
        align: 'left',
        lineSpacing: 1.3
      },
      patient: {
        labelFontSize: 2.7,
        valueFontSize: 2.7,
        fontStyle: 1
      },
      dispensedBy: {
        labelFontSize: 2.4,
        valueFontSize: 2.4,
        fontStyle: 1
      },
      timestamp: {
        fontSize: 2.2,
        fontStyle: 1
      },
      warning: {
        fontSize: 2.5,
        fontStyle: 1,
        maxLines: 2,
        iconSize: 4.5
      },
      spacing: {
        headerGap: 0.5,
        sectionGap: 1.0,
        footerGap: 1.0
      }
    },

    // Compact theme - fit more text
    compact: {
      font: {
        family: 'Arial',
        defaultStyle: 0 // Regular for compactness
      },
      facilityName: {
        fontSize: 2.8,
        fontStyle: 1,
        align: 'center'
      },
      facilityAddress: {
        fontSize: 1.6,
        fontStyle: 0,
        align: 'center'
      },
      facilityPhone: {
        fontSize: 1.6,
        fontStyle: 0,
        align: 'center'
      },
      productName: {
        fontSize: { min: 2.2, max: 3.0 },
        fontStyle: 1,
        style: 'normal',
        align: 'center'
      },
      instruction: {
        fontSize: { min: 1.8, max: 8.0 },
        fontStyle: 0, // Regular to save space
        align: 'left',
        lineSpacing: 1.2 // Tighter spacing
      },
      patient: {
        labelFontSize: 2.2,
        valueFontSize: 2.2,
        fontStyle: 1
      },
      dispensedBy: {
        labelFontSize: 2.0,
        valueFontSize: 2.0,
        fontStyle: 1
      },
      timestamp: {
        fontSize: 1.8,
        fontStyle: 0
      },
      warning: {
        fontSize: 2.0,
        fontStyle: 0,
        maxLines: 2,
        iconSize: 3.5
      },
      spacing: {
        headerGap: 0.3,
        sectionGap: 0.8,
        footerGap: 0.8
      }
    },

    // Large print theme - maximum readability
    largePrint: {
      font: {
        family: 'Verdana',
        defaultStyle: 1
      },
      facilityName: {
        fontSize: 4.0,
        fontStyle: 1,
        align: 'center'
      },
      facilityAddress: {
        fontSize: 2.2,
        fontStyle: 0,
        align: 'center'
      },
      facilityPhone: {
        fontSize: 2.2,
        fontStyle: 0,
        align: 'center'
      },
      productName: {
        fontSize: { min: 3.5, max: 4.5 },
        fontStyle: 1,
        style: 'bold',
        align: 'center'
      },
      instruction: {
        fontSize: { min: 3.0, max: 14.0 },
        fontStyle: 1,
        align: 'left',
        lineSpacing: 1.4
      },
      patient: {
        labelFontSize: 3.0,
        valueFontSize: 3.0,
        fontStyle: 1
      },
      dispensedBy: {
        labelFontSize: 2.5,
        valueFontSize: 2.5,
        fontStyle: 1
      },
      timestamp: {
        fontSize: 2.5,
        fontStyle: 0
      },
      warning: {
        fontSize: 2.8,
        fontStyle: 1,
        maxLines: 2,
        iconSize: 5.0
      },
      spacing: {
        headerGap: 0.6,
        sectionGap: 1.2,
        footerGap: 1.2
      }
    },

    // Professional theme - clean and elegant
    professional: {
      font: {
        family: 'Times New Roman',
        defaultStyle: 0
      },
      facilityName: {
        fontSize: 3.5,
        fontStyle: 1,
        align: 'center'
      },
      facilityAddress: {
        fontSize: 1.9,
        fontStyle: 0,
        align: 'center'
      },
      facilityPhone: {
        fontSize: 1.9,
        fontStyle: 0,
        align: 'center'
      },
      productName: {
        fontSize: { min: 2.8, max: 3.8 },
        fontStyle: 3, // Bold Italic
        style: 'normal',
        align: 'center'
      },
      instruction: {
        fontSize: { min: 2.2, max: 10.0 },
        fontStyle: 0, // Regular for elegance
        align: 'left',
        lineSpacing: 1.4
      },
      patient: {
        labelFontSize: 2.5,
        valueFontSize: 2.5,
        fontStyle: 2 // Italic
      },
      dispensedBy: {
        labelFontSize: 2.2,
        valueFontSize: 2.2,
        fontStyle: 2 // Italic
      },
      timestamp: {
        fontSize: 2.0,
        fontStyle: 0
      },
      warning: {
        fontSize: 2.3,
        fontStyle: 2, // Italic
        maxLines: 2,
        iconSize: 4.0
      },
      spacing: {
        headerGap: 0.5,
        sectionGap: 1.0,
        footerGap: 1.0
      }
    }
  }

  /**
   * Merge custom theme with base theme
   */
  _mergeTheme(baseThemeName, customTheme) {
    const baseTheme = LabelGeneratorV2.THEMES[baseThemeName] || LabelGeneratorV2.THEMES.default

    if (!customTheme) return baseTheme

    // Deep merge
    const merged = JSON.parse(JSON.stringify(baseTheme))

    for (const key in customTheme) {
      if (typeof customTheme[key] === 'object' && !Array.isArray(customTheme[key])) {
        merged[key] = { ...merged[key], ...customTheme[key] }
      } else {
        merged[key] = customTheme[key]
      }
    }

    return merged
  }

  /**
   * Calculate text height
   */
  _calculateTextHeight(fontSize, lines, lineSpacing = 1.3) {
    return fontSize * lines * lineSpacing
  }

  /**
   * Wrap text by words
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
        if (currentLine) {
          lines.push(currentLine)
          currentLine = word
        } else {
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
   * Calculate maximum font size that fits
   */
  _calculateMaxFontSize(text, width, height, minFont, maxFont, lineSpacing = 1.3) {
    for (let fontSize = maxFont; fontSize >= minFont; fontSize -= 0.05) {
      const lines = this._wrapTextByWords(text, width, fontSize)
      const textHeight = fontSize * lines.length * lineSpacing

      if (textHeight <= height) {
        return Math.round(fontSize * 10) / 10
      }
    }

    return minFont
  }

  /**
   * Truncate text to fit
   */
  _truncateText(text, width, height, fontSize, lineSpacing = 1.3) {
    const charWidth = fontSize * 0.6
    const maxCharsPerLine = Math.floor(width / charWidth)
    const maxLines = Math.floor(height / (fontSize * lineSpacing))
    const maxChars = maxCharsPerLine * maxLines

    if (text.length <= maxChars) return text

    const words = text.split(' ')
    let truncated = ''

    for (const word of words) {
      const testText = truncated ? `${truncated} ${word}` : word
      if (testText.length + 3 <= maxChars) {
        truncated = testText
      } else {
        break
      }
    }

    return truncated + '...'
  }

  /**
   * Get alignment value
   */
  _getAlignment(align) {
    const alignments = {
      left: 0,
      center: 1,
      right: 2,
      stretch: 3,
      expand: 4
    }
    return alignments[align] || 0
  }

  /**
   * Generate label with theme
   */
  generateLabel(data, theme = 'default') {
    // Resolve theme
    let resolvedTheme
    if (typeof theme === 'string') {
      resolvedTheme = this._mergeTheme(theme, null)
    } else if (typeof theme === 'object') {
      const baseTheme = theme.base || 'default'
      resolvedTheme = this._mergeTheme(baseTheme, theme)
    } else {
      resolvedTheme = this._mergeTheme('default', null)
    }

    const elements = []
    let currentY = this.margin

    // Font configuration
    const fontFamily = resolvedTheme.font?.family || 'Arial'

    // ====================================================================
    // SECTION 1: HEADER (Facility Info)
    // ====================================================================

    // Facility Name
    const facilityNameHeight = resolvedTheme.facilityName.fontSize * 1.2
    elements.push({
      type: 'text',
      text: data.facilityName || data.facility_name || '',
      x: this.margin,
      y: currentY,
      width: this.contentWidth,
      height: facilityNameHeight,
      fontHeight: resolvedTheme.facilityName.fontSize,
      fontName: fontFamily,
      fontStyle: resolvedTheme.facilityName.fontStyle,
      horizontalAlignment: this._getAlignment(resolvedTheme.facilityName.align),
      verticalAlignment: 1,
      autoReturn: 2
    })
    currentY += facilityNameHeight

    // Facility Address
    const addressHeight = resolvedTheme.facilityAddress.fontSize * 1.2
    elements.push({
      type: 'text',
      text: data.facilityAddress || data.facility_address || '',
      x: this.margin,
      y: currentY,
      width: this.contentWidth,
      height: addressHeight,
      fontHeight: resolvedTheme.facilityAddress.fontSize,
      fontName: fontFamily,
      fontStyle: resolvedTheme.facilityAddress.fontStyle,
      horizontalAlignment: this._getAlignment(resolvedTheme.facilityAddress.align),
      verticalAlignment: 1,
      autoReturn: 2
    })
    currentY += addressHeight

    // Facility Phone
    const phoneHeight = resolvedTheme.facilityPhone.fontSize * 1.2
    elements.push({
      type: 'text',
      text:
        data.facilityPhone ||
        data.facility_phone ||
        data.facilityContact ||
        data.facility_contact ||
        '',
      x: this.margin,
      y: currentY,
      width: this.contentWidth,
      height: phoneHeight,
      fontHeight: resolvedTheme.facilityPhone.fontSize,
      fontName: fontFamily,
      fontStyle: resolvedTheme.facilityPhone.fontStyle,
      horizontalAlignment: this._getAlignment(resolvedTheme.facilityPhone.align),
      verticalAlignment: 1,
      autoReturn: 2
    })
    currentY += phoneHeight + resolvedTheme.spacing.headerGap

    // ====================================================================
    // SECTION 2: PRODUCT NAME
    // ====================================================================

    const productConfig = resolvedTheme.productName
    const drugName = data.drugName || data.productName || data.product || ''

    // Calculate product name font size
    const productMinFont = productConfig.fontSize.min || 2.5
    const productMaxFont = productConfig.fontSize.max || 3.5
    const tempProductHeight = 5 // Estimate
    const productFont = this._calculateMaxFontSize(
      drugName,
      this.contentWidth,
      tempProductHeight,
      productMinFont,
      productMaxFont,
      1.1
    )
    const productHeight = Math.max(productFont * 2 * 1.1, 5)

    // Product box styling
    if (productConfig.style === 'bold') {
      // Double border
      elements.push({
        type: 'rectangle',
        x: this.margin,
        y: currentY,
        width: this.contentWidth,
        height: productHeight,
        lineWidth: 1.0,
        fill: false
      })
      elements.push({
        type: 'rectangle',
        x: this.margin + 0.5,
        y: currentY + 0.5,
        width: this.contentWidth - 1.0,
        height: productHeight - 1.0,
        lineWidth: 0.3,
        fill: false
      })
    } else if (productConfig.style === 'inverse') {
      elements.push({
        type: 'rectangle',
        x: this.margin,
        y: currentY,
        width: this.contentWidth,
        height: productHeight,
        lineWidth: 0.5,
        fill: true
      })
    } else {
      elements.push({
        type: 'rectangle',
        x: this.margin,
        y: currentY,
        width: this.contentWidth,
        height: productHeight,
        lineWidth: 0.5,
        fill: false
      })
    }

    // Product name text
    elements.push({
      type: 'text',
      text: drugName,
      x: this.margin,
      y: currentY,
      width: this.contentWidth,
      height: productHeight,
      fontHeight: productFont,
      fontName: fontFamily,
      fontStyle: productConfig.fontStyle,
      horizontalAlignment: this._getAlignment(productConfig.align),
      verticalAlignment: 1,
      autoReturn: 2,
      inverse: productConfig.style === 'inverse'
    })
    currentY += productHeight + resolvedTheme.spacing.sectionGap

    // ====================================================================
    // SECTION 3: CALCULATE FOOTER DIMENSIONS (Bottom-up)
    // ====================================================================

    // Warning section
    const warningConfig = resolvedTheme.warning
    const warningHeight = this._calculateTextHeight(
      warningConfig.fontSize,
      warningConfig.maxLines,
      1.2
    )
    const safeWarningHeight = Math.max(warningHeight, 5)

    // Separator
    const separatorHeight = 1

    // Dispensed by row
    const dispConfig = resolvedTheme.dispensedBy
    const dispRowHeight = Math.max(dispConfig.valueFontSize * 1.3, 3)

    // Patient row
    const patientConfig = resolvedTheme.patient
    const patientRowHeight = Math.max(patientConfig.valueFontSize * 1.3, 3)

    // Calculate Y positions from bottom
    const footerStartY = LabelGeneratorV2.PAPER_HEIGHT - this.margin
    const warningY = footerStartY - safeWarningHeight
    const separatorY = warningY - separatorHeight
    const dispY = separatorY - dispRowHeight - resolvedTheme.spacing.footerGap
    const patientY = dispY - patientRowHeight - resolvedTheme.spacing.footerGap

    // ====================================================================
    // SECTION 4: INSTRUCTION (Fills remaining space)
    // ====================================================================

    const instructionConfig = resolvedTheme.instruction
    const instructionStartY = currentY
    const instructionAvailableHeight =
      patientY - instructionStartY - resolvedTheme.spacing.footerGap

    const instruction = data.instruction || data.instructions || ''
    let instructionFont = this._calculateMaxFontSize(
      instruction,
      this.contentWidth,
      instructionAvailableHeight,
      instructionConfig.fontSize.min,
      instructionConfig.fontSize.max,
      instructionConfig.lineSpacing
    )

    let displayInstruction = instruction
    if (instructionFont === instructionConfig.fontSize.min) {
      const lines = this._wrapTextByWords(instruction, this.contentWidth, instructionFont)
      const requiredHeight = instructionFont * lines.length * instructionConfig.lineSpacing

      if (requiredHeight > instructionAvailableHeight) {
        displayInstruction = this._truncateText(
          instruction,
          this.contentWidth,
          instructionAvailableHeight,
          instructionFont,
          instructionConfig.lineSpacing
        )
      }
    }

    elements.push({
      type: 'text',
      text: displayInstruction,
      x: this.margin,
      y: instructionStartY,
      width: this.contentWidth,
      height: instructionAvailableHeight,
      fontHeight: instructionFont,
      fontName: fontFamily,
      fontStyle: instructionConfig.fontStyle,
      lineSpacing: instructionConfig.lineSpacing,
      horizontalAlignment: this._getAlignment(instructionConfig.align),
      verticalAlignment: 0,
      autoReturn: 2
    })

    // ====================================================================
    // SECTION 5: FOOTER (Patient, Dispensed By, Warning)
    // ====================================================================

    // Patient row
    const patientLabelWidth = 7
    elements.push({
      type: 'text',
      text: 'Patient:',
      x: this.margin,
      y: patientY,
      width: patientLabelWidth,
      height: patientRowHeight,
      fontHeight: patientConfig.labelFontSize,
      fontName: fontFamily,
      fontStyle: 0,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2
    })

    elements.push({
      type: 'text',
      text: data.patientName || data.client || 'Walk-in Patient',
      x: this.margin + patientLabelWidth,
      y: patientY,
      width: this.contentWidth - patientLabelWidth,
      height: patientRowHeight,
      fontHeight: patientConfig.valueFontSize,
      fontName: fontFamily,
      fontStyle: patientConfig.fontStyle,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2
    })

    // Dispensed by row
    const timestampConfig = resolvedTheme.timestamp
    const timestampWidth = 22
    const dispLabelWidth = 7
    const dispBoxWidth = 14

    elements.push({
      type: 'text',
      text: data.timestamp || data.created_at || '',
      x: this.margin,
      y: dispY,
      width: timestampWidth,
      height: dispRowHeight,
      fontHeight: timestampConfig.fontSize,
      fontName: fontFamily,
      fontStyle: timestampConfig.fontStyle,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2
    })

    const dispX = this.margin + timestampWidth + 1

    elements.push({
      type: 'text',
      text: 'Disp by:',
      x: dispX,
      y: dispY,
      width: dispLabelWidth,
      height: dispRowHeight,
      fontHeight: dispConfig.labelFontSize,
      fontName: fontFamily,
      fontStyle: 0,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2
    })

    elements.push({
      type: 'rectangle',
      x: dispX + dispLabelWidth,
      y: dispY,
      width: dispBoxWidth,
      height: dispRowHeight,
      lineWidth: 0.2
    })

    elements.push({
      type: 'text',
      text: data.dispensedBy || '',
      x: dispX + dispLabelWidth + 0.5,
      y: dispY,
      width: dispBoxWidth - 1,
      height: dispRowHeight,
      fontHeight: dispConfig.valueFontSize,
      fontName: fontFamily,
      fontStyle: dispConfig.fontStyle,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2
    })

    // Separator line
    elements.push({
      type: 'line',
      x1: this.margin,
      y1: separatorY,
      x2: this.margin + this.contentWidth,
      y2: separatorY,
      lineWidth: 0.2
    })

    // Warning section
    const warningIconWidth = warningConfig.iconSize

    elements.push({
      type: 'text',
      text: '⚠',
      x: this.margin,
      y: warningY,
      width: warningIconWidth,
      height: safeWarningHeight,
      fontHeight: warningConfig.iconSize,
      fontName: fontFamily,
      horizontalAlignment: 1,
      verticalAlignment: 1,
      autoReturn: 0
    })

    elements.push({
      type: 'text',
      text: data.warning || '',
      x: this.margin + warningIconWidth + 0.5,
      y: warningY,
      width: this.contentWidth - warningIconWidth - 0.5,
      height: safeWarningHeight,
      fontHeight: warningConfig.fontSize,
      fontName: fontFamily,
      fontStyle: warningConfig.fontStyle,
      lineSpacing: 1.2,
      horizontalAlignment: 0,
      verticalAlignment: 1,
      autoReturn: 2
    })

    // Outer border
    elements.unshift({
      type: 'rectangle',
      x: 1,
      y: 1,
      width: LabelGeneratorV2.PAPER_WIDTH - 2,
      height: LabelGeneratorV2.PAPER_HEIGHT - 2,
      lineWidth: 0.5
    })

    return {
      printerInfo: {
        printerName: data.printerName || 'DP27P Label Printer'
      },
      jobInfo: {
        jobWidth: LabelGeneratorV2.PAPER_WIDTH,
        jobHeight: LabelGeneratorV2.PAPER_HEIGHT,
        orientation: 0
      },
      jobPages: [elements]
    }
  }

  /**
   * Get available themes
   */
  static getAvailableThemes() {
    return Object.keys(LabelGeneratorV2.THEMES)
  }

  /**
   * Get theme configuration
   */
  static getTheme(themeName) {
    return LabelGeneratorV2.THEMES[themeName]
  }
}
