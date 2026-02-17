import { app } from 'electron'
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

/**
 * Ensure templates directory and default templates exist.
 * Will NOT overwrite existing files.
 */
export function ensureDefaultTemplates() {
  const templatesDir = join(app.getPath('userData'), 'templates')

  // 1. create directory if missing
  if (!existsSync(templatesDir)) {
    mkdirSync(templatesDir, { recursive: true })
  }

  // 2. define default templates you want to ship
  const defaults = {
    'base.json': {
      jobPages: [
        [
          {
            type: 'rectangle',
            x: 1,
            y: 1,
            width: 46,
            height: 52,
            lineWidth: 0.5,
            comment: 'Outer border'
          },
          {
            type: 'text',
            text: 'Apex Health Limited',
            x: 2,
            y: 2,
            width: 44,
            height: 3.5,
            fontHeight: 3.4,
            fontName: 'Arial',
            fontStyle: 'bold',
            horizontalAlignment: 'center',
            verticalAlignment: 'center',
            name: 'businessName'
          },
          {
            type: 'text',
            text: 'Madina-Accra North Legon',
            x: 2,
            y: 6,
            width: 44,
            height: 2.4,
            fontHeight: 2.3,
            fontName: 'Arial',
            horizontalAlignment: 'center',
            verticalAlignment: 'center',
            name: 'businessAddress'
          },
          {
            type: 'text',
            text: '+233240000000 / +233200000000',
            x: 2,
            y: 9,
            width: 44,
            height: 2.4,
            fontHeight: 2.3,
            fontName: 'Arial',
            horizontalAlignment: 'center',
            verticalAlignment: 'center',
            name: 'businessPhone'
          },
          {
            type: 'rectangle',
            x: 2,
            y: 12,
            width: 44,
            height: 7.9,
            lineWidth: 0.5,
            comment: 'Product name box'
          },
          {
            type: 'text',
            text: 'ABC Paracetamol 500mg tablet',
            x: 2,
            y: 12,
            width: 44,
            height: 7.9,
            fontHeight: 3.2,
            fontName: 'Arial',
            fontStyle: 'bold',
            horizontalAlignment: 'center',
            verticalAlignment: 'center',
            autoReturn: 'word',
            comment: 'Fixed: matched box dimensions exactly, reduced font from 3.5 to 3.2',
            name: 'medicationName'
          },
          {
            type: 'text',
            text: 'Take one',
            x: 2,
            y: 20,
            width: 44,
            height: 15,
            fontHeight: 8,
            fontName: 'Arial',
            fontStyle: 'bold',
            horizontalAlignment: 'start',
            verticalAlignment: 'start',
            autoReturn: 'word',
            lineSpace: '1_2',
            comment: 'Fixed: changed fontHeight from 15 to 3.2mm, added line spacing',
            name: 'instructions'
          },
          {
            type: 'text',
            text: 'Client:',
            x: 2,
            y: 35.72,
            width: 7,
            height: 3,
            fontHeight: 2.5,
            fontName: 'Arial',
            horizontalAlignment: 'start',
            verticalAlignment: 'center'
          },
          {
            type: 'text',
            text: 'John Doe',
            x: 9,
            y: 35.72,
            width: 37,
            height: 3,
            fontHeight: 2.5,
            fontName: 'Arial',
            fontStyle: 'bold',
            horizontalAlignment: 'start',
            verticalAlignment: 'center',
            comment: "Fixed: changed fontStyle from 1 to 'bold'",
            name: 'patientName'
          },
          {
            type: 'text',
            text: '20/12/2025 10:30:00',
            x: 2,
            y: 39.72,
            width: 22,
            height: 3,
            fontHeight: 2,
            fontName: 'Arial',
            horizontalAlignment: 'start',
            verticalAlignment: 'center',
            name: 'dispensingDate'
          },
          {
            type: 'text',
            text: 'Disp by:',
            x: 25,
            y: 39.72,
            width: 7,
            height: 3,
            fontHeight: 2.2,
            fontName: 'Arial',
            horizontalAlignment: 'start',
            verticalAlignment: 'center'
          },
          {
            type: 'rectangle',
            x: 32,
            y: 39.72,
            width: 14,
            height: 3,
            lineWidth: 0.2
          },
          {
            type: 'text',
            text: 'MARY',
            x: 32.5,
            y: 39.72,
            width: 13,
            height: 3,
            fontHeight: 2.2,
            fontName: 'Arial',
            fontStyle: 'bold',
            horizontalAlignment: 'start',
            verticalAlignment: 'center',
            name: 'dispensedBy'
          },
          {
            type: 'line',
            x1: 2,
            y1: 43.72,
            x2: 47,
            y2: 43.72,
            lineWidth: 0.2
          },
          {
            type: 'text',
            text: '⚠',
            x: 2,
            y: 44.72,
            width: 4,
            height: 8.28,
            fontHeight: 4,
            fontName: 'Arial',
            horizontalAlignment: 'center',
            verticalAlignment: 'center'
          },
          {
            type: 'text',
            text: 'Do not exceed 8 tablets in 24 hours',
            x: 6.5,
            y: 44.72,
            width: 39.5,
            height: 8.28,
            fontHeight: 2.3,
            fontName: 'Arial',
            fontStyle: 'bold',
            horizontalAlignment: 'start',
            verticalAlignment: 'center',
            autoReturn: 'word',
            comment: 'Fixed: added autoReturn which was missing',
            name: 'warningText'
          }
        ]
      ]
    },
    'base2.json': {
      name: 'Base Template 2',
      page: { width: 48, height: 54 },
      elements: []
    }
  }

  // 3. create files only if they don't exist
  for (const [fileName, content] of Object.entries(defaults)) {
    const filePath = join(templatesDir, fileName)

    if (!existsSync(filePath)) {
      writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8')
    }
  }

  return templatesDir
}
