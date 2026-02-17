# DTPWeb Label Printer - jobPages Builder Documentation

## Table of Contents
1. [Overview](#overview)
2. [Installation & Usage](#installation--usage)
3. [Element Types](#element-types)
4. [Property Reference](#property-reference)
5. [Enumerations](#enumerations)
6. [Examples](#examples)
7. [Best Practices](#best-practices)

---

## Overview

The `buildJobPages` function validates and processes label printing data for the DTPWeb label printer interface. It supports multiple element types including text, barcodes, QR codes, images, and vector graphics.

### Key Features
- ✅ Validates element structure and required properties
- ✅ Converts string enum values to numeric equivalents
- ✅ Type-specific validation rules
- ✅ Helpful error messages with precise location information
- ✅ Optional strict mode for catching typos
- ✅ Helper functions for common operations

---

## Installation & Usage

### Basic Usage

```javascript
const { buildJobPages } = require('./buildJobPages');

const jobPages = buildJobPages([
  [  // Label 1
    {
      type: 'text',
      text: 'Hello World',
      x: 10,
      y: 10,
      fontHeight: 3.5
    }
  ],
  [  // Label 2
    {
      type: 'barcode',
      text: '1234567890',
      x: 5,
      y: 5,
      type: 'code128'
    }
  ]
]);

// Pass to the print API
api.print(action, printerInfo, jobInfo, jobPages);
```

### Options

```javascript
buildJobPages(labels, {
  strict: false,          // Throw error on unknown properties
  validateRequired: true  // Validate required fields
});
```

---

## Element Types

All drawing elements support the following types:

| Type | Description | Primary Use |
|------|-------------|-------------|
| `text` | Text strings with formatting | Labels, descriptions, headers |
| `barcode` | 1D barcodes (UPC, Code128, etc.) | Product codes, SKUs |
| `qrcode` | QR codes | URLs, contact info, large data |
| `pdf417` | PDF417 2D barcodes | Government IDs, boarding passes |
| `dataMatrix` | Data Matrix codes | Small item tracking |
| `image` | Images from file or base64 | Logos, photos |
| `rectangle` | Rectangle/rounded rectangle | Borders, boxes |
| `ellipse` | Ellipse or circle | Decorations, highlights |
| `line` | Straight or dashed lines | Separators, underlines |

---

## Property Reference

### Common Properties

These properties are available for most element types:

#### Position & Size

| Property | Type | Description | Default | Applies To |
|----------|------|-------------|---------|------------|
| `x` | number | Horizontal position from top-left (mm) | 0 | All except line |
| `y` | number | Vertical position from top-left (mm) | 0 | All except line |
| `width` | number | Width in millimeters | Auto | Most types |
| `height` | number | Height in millimeters | Auto | Most types |

#### Orientation

| Property | Type | Description | Default | Applies To |
|----------|------|-------------|---------|------------|
| `orientation` | number/string | Rotation angle: 0, 90, 180, 270 degrees | 0 | All types |

---

### Text Element Properties

**Required:** `type`, `text`

#### Basic Properties

| Property | Type | Description | Default | Example |
|----------|------|-------------|---------|---------|
| `text` | string | Text content to display | *required* | `"Hello World"` |
| `fontName` | string | Font name | `"Heiti"` | `"Arial"`, `"Heiti"` |
| `fontHeight` | number | Font size in millimeters | - | `3.5` (≈12pt), `4.233` (≈12pt) |
| `fontStyle` | number/string | Font style | `0` (regular) | See [Font Styles](#font-styles) |

**Font Size Conversion:**
- 9pt ≈ 3.175mm
- 12pt ≈ 4.233mm
- Formula: `points × 25.4 / 72 = mm`

#### Text Layout

| Property | Type | Description | Default | Values |
|----------|------|-------------|---------|--------|
| `autoReturn` | number/string | Text wrapping mode | `0` (none) | `'none'` (0), `'char'` (1), `'word'` (2) |
| `charSpace` | number | Character spacing in mm | 0 | Any positive number |
| `lineSpace` | string/number | Line spacing | `"1_0"` | `"1_0"`, `"1_2"`, `"1_5"`, `"2_0"` or number |
| `horizontalAlignment` | number/string | Horizontal alignment | `0` (start) | See [Alignment](#alignment) |
| `verticalAlignment` | number/string | Vertical alignment | `0` (start) | See [Alignment](#alignment) |

#### Advanced Text Formatting

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `leadingIndentChars` | number | Indent by character count (Chinese chars) | `1.5` = 1.5 Chinese chars |
| `leadingIndentMM` | number | Indent in millimeters | `5` = 5mm left, `-5` = 5mm right |
| `leadingIndentColon` | boolean | Align to colon position | `true` |

**Example:**
```javascript
{
  type: 'text',
  text: 'Product Name:\nWidget 3000',
  x: 10,
  y: 10,
  width: 50,
  height: 20,
  fontHeight: 3.5,
  fontName: 'Heiti',
  fontStyle: 'bold',
  autoReturn: 'word',
  charSpace: 0.5,
  lineSpace: '1_5',
  horizontalAlignment: 'center',
  verticalAlignment: 'start'
}
```

---

### Barcode Element Properties

**Required:** `type`, `text`

#### Basic Properties

| Property | Type | Description | Default | Example |
|----------|------|-------------|---------|---------|
| `text` | string | Barcode content | *required* | `"1234567890"` |
| `type` | number/string | Barcode type | `60` (auto) | See [Barcode Types](#barcode-types) |
| `width` | number | Barcode width (mm) | - | `30` |
| `height` | number | Total height including text (mm) | - | `15` |
| `textHeight` | number | Human-readable text height (mm) | `0` (hidden) | `2.5` |

#### Barcode Appearance

| Property | Type | Description | Default | Values |
|----------|------|-------------|---------|--------|
| `barPixels` | number | Dot size when width unspecified | `2` | 1-7 pixels |
| `fontName` | string | Font for human-readable text | `"Heiti"` | Any font name |
| `fontStyle` | number/string | Font style for text | `0` (regular) | See [Font Styles](#font-styles) |
| `textAlignment` | number/string | Text alignment | `1` (center) | See [Alignment](#alignment) |
| `horizontalAlignment` | number/string | Barcode horizontal alignment | `0` (start) | See [Alignment](#alignment) |
| `verticalAlignment` | number/string | Barcode vertical alignment | `0` (start) | See [Alignment](#alignment) |

**Example:**
```javascript
{
  type: 'barcode',
  text: '123456789012',
  x: 10,
  y: 20,
  width: 40,
  height: 15,
  type: 'code128',
  textHeight: 3,
  fontStyle: 'regular',
  textAlignment: 'center',
  barPixels: 2
}
```

---

### QR Code Element Properties

**Required:** `type`, `text`

| Property | Type | Description | Default | Values |
|----------|------|-------------|---------|--------|
| `text` | string | QR code content | *required* | Any string, URL |
| `width` | number | QR code width (mm) | - | `20`, `30` |
| `height` | number | QR code height (mm) | `width` | Usually same as width |
| `eccLevel` | number/string | Error correction level | `0` (L) | `'l'` (0), `'m'` (1), `'q'` (2), `'h'` (3) |
| `textEncoding` | number/string | Text encoding | `2` (UTF8) | `'unicode'` (0), `'ansi'` (1), `'utf8'` (2) |
| `qrcPixels` | number | Pixel size per module | 0 (auto) | Positive integer |
| `horizontalAlignment` | number/string | Horizontal alignment | `0` (start) | See [Alignment](#alignment) |
| `verticalAlignment` | number/string | Vertical alignment | `0` (start) | See [Alignment](#alignment) |

**Error Correction Levels:**
- `L` (0): ~7% recovery
- `M` (1): ~15% recovery
- `Q` (2): ~25% recovery
- `H` (3): ~30% recovery

**Example:**
```javascript
{
  type: 'qrcode',
  text: 'https://example.com',
  x: 5,
  y: 5,
  width: 25,
  eccLevel: 'h',
  textEncoding: 'utf8',
  horizontalAlignment: 'center'
}
```

---

### PDF417 Element Properties

**Required:** `type`, `text`

| Property | Type | Description | Default | Values |
|----------|------|-------------|---------|--------|
| `text` | string | PDF417 content | *required* | Any string |
| `width` | number | Width (mm) | - | `40` |
| `height` | number | Height (mm) | - | `15` |
| `eccLevel` | number/string | Error correction level | `0` (auto) | `'auto'` (0), `'1'`-`'8'` (1-8) |
| `p417Pixels` | number | Pixel size per module | 0 (auto) | Positive integer |
| `horizontalAlignment` | number/string | Horizontal alignment | `0` (start) | See [Alignment](#alignment) |
| `verticalAlignment` | number/string | Vertical alignment | `0` (start) | See [Alignment](#alignment) |

**Example:**
```javascript
{
  type: 'pdf417',
  text: 'DRIVER LICENSE DATA',
  x: 10,
  y: 10,
  width: 50,
  height: 20,
  eccLevel: '5',
  orientation: 0
}
```

---

### Data Matrix Element Properties

**Required:** `type`, `text`

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `text` | string | Data Matrix content | *required* |
| `width` | number | Width (mm) | - |
| `height` | number | Height (mm) | - |
| `horizontalAlignment` | number/string | Horizontal alignment | `0` (start) |
| `verticalAlignment` | number/string | Vertical alignment | `0` (start) |
| `orientation` | number | Rotation angle | 0 |

**Example:**
```javascript
{
  type: 'dataMatrix',
  text: 'ITEM-SKU-12345',
  x: 5,
  y: 5,
  width: 15,
  height: 15
}
```

---

### Image Element Properties

**Required:** `type`, `imageFile`

| Property | Type | Description | Default | Values |
|----------|------|-------------|---------|--------|
| `imageFile` | string | Image file path | *required* | File path or base64 |
| `width` | number | Width (mm), 0 = auto | 0 | Positive number |
| `height` | number | Height (mm), 0 = auto | 0 | Positive number |
| `threshold` | number | Grayscale conversion | 192 | See below |

**Threshold Values:**
- `0-255`: Black & white (>threshold = white, ≤threshold = black)
- `256`: Halftone image
- `257`: Original color image

**Example:**
```javascript
{
  type: 'image',
  imageFile: '/path/to/logo.png',
  x: 10,
  y: 5,
  width: 20,
  height: 10,
  threshold: 192,
  orientation: 0
}
```

---

### Rectangle Element Properties

**Required:** `type`

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `x` | number | X position (mm) | 0 |
| `y` | number | Y position (mm) | 0 |
| `width` | number | Width (mm) | - |
| `height` | number | Height (mm) | - |
| `lineWidth` | number | Border width (mm), extends inward | 0.5 |
| `cornerWidth` | number | Corner width for rounded rectangles (mm) | 0 |
| `cornerHeight` | number | Corner height for rounded rectangles (mm) | `cornerWidth` |
| `fill` | boolean | Fill the rectangle | false |
| `orientation` | number | Rotation angle | 0 |

**Example:**
```javascript
// Rounded rectangle border
{
  type: 'rectangle',
  x: 5,
  y: 5,
  width: 60,
  height: 40,
  lineWidth: 1,
  cornerWidth: 3,
  cornerHeight: 3,
  fill: false
}

// Filled rectangle
{
  type: 'rectangle',
  x: 10,
  y: 10,
  width: 20,
  height: 15,
  fill: true
}
```

---

### Ellipse Element Properties

**Required:** `type`

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `x` | number | X position of top-left corner (mm) | 0 |
| `y` | number | Y position of top-left corner (mm) | 0 |
| `width` | number | Width (mm) | - |
| `height` | number | Height (mm), defaults to width for circle | `width` |
| `lineWidth` | number | Border width (mm), extends inward | 0.5 |
| `fill` | boolean | Fill the ellipse | false |
| `orientation` | number | Rotation angle | 0 |

**Example:**
```javascript
// Circle
{
  type: 'ellipse',
  x: 20,
  y: 20,
  width: 15,
  height: 15,  // Same as width = circle
  lineWidth: 1,
  fill: false
}

// Ellipse
{
  type: 'ellipse',
  x: 10,
  y: 10,
  width: 30,
  height: 20,
  fill: true
}
```

---

### Line Element Properties

**Required:** `type`

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `x1` | number | Start point X position (mm) | 0 |
| `y1` | number | Start point Y position (mm) | 0 |
| `x2` | number | End point X position (mm) | `x1` |
| `y2` | number | End point Y position (mm) | `y1` |
| `lineWidth` | number | Line width (mm) | 0.5 |
| `dashLens` | number[] | Dash pattern (mm), empty = solid line | `[]` |
| `orientation` | number | Rotation angle | 0 |

**Example:**
```javascript
// Horizontal line
{
  type: 'line',
  x1: 5,
  y1: 20,
  x2: 55,
  y2: 20,
  lineWidth: 1
}

// Dashed line
{
  type: 'line',
  x1: 5,
  y1: 25,
  x2: 55,
  y2: 25,
  lineWidth: 0.5,
  dashLens: [2, 1, 2, 1]  // 2mm dash, 1mm space, repeat
}

// Diagonal line
{
  type: 'line',
  x1: 10,
  y1: 10,
  x2: 40,
  y2: 30,
  lineWidth: 1
}
```

---

## Enumerations

### Alignment

Used for: `horizontalAlignment`, `verticalAlignment`, `textAlignment`

| String Value | Numeric Value | Description |
|--------------|---------------|-------------|
| `'start'` | 0 | Left-aligned (horizontal) / Top-aligned (vertical) |
| `'center'` | 1 | Centered |
| `'end'` | 2 | Right-aligned (horizontal) / Bottom-aligned (vertical) |
| `'stretch'` | 3 | Stretch to fill space |
| `'expand'` | 4 | Scale to fill space |

### Font Styles

Used for: `fontStyle` (text and barcode)

| String Value | Numeric Value | Description |
|--------------|---------------|-------------|
| `'regular'` | 0 | Normal text |
| `'bold'` | 1 | Bold text |
| `'italic'` | 2 | Italic text |
| `'bolditalic'` | 3 | Bold and italic |
| `'underline'` | 4 | Underlined text |
| `'strikeout'` | 8 | Strikethrough text |

### Auto Return Modes

Used for: `autoReturn` (text)

| String Value | Numeric Value | Description |
|--------------|---------------|-------------|
| `'none'` | 0 | Single line, no wrapping |
| `'char'` | 1 | Wrap at character boundaries |
| `'word'` | 2 | Wrap at word boundaries |

### Barcode Types

Used for: `type` (barcode element)

| String Value | Numeric Value | Description |
|--------------|---------------|-------------|
| `'upc_a'` | 20 | UPC-A (12 digits) |
| `'upc_e'` | 21 | UPC-E (6-8 digits) |
| `'ean13'` | 22 | EAN-13 (13 digits) |
| `'ean8'` | 23 | EAN-8 (8 digits) |
| `'code39'` | 24 | Code 39 |
| `'itf25'` | 25 | Interleaved 2 of 5 |
| `'codabar'` | 26 | Codabar |
| `'code93'` | 27 | Code 93 |
| `'code128'` | 28 | Code 128 (recommended) |
| `'isbn'` | 29 | ISBN |
| `'ecode39'` | 30 | Extended Code 39 |
| `'auto'` | 60 | Auto-detect (default) |

### QR Error Correction Levels

Used for: `eccLevel` (qrcode)

| String Value | Numeric Value | Recovery Capability |
|--------------|---------------|---------------------|
| `'l'` | 0 | Low (~7%) |
| `'m'` | 1 | Medium (~15%) |
| `'q'` | 2 | Quartile (~25%) |
| `'h'` | 3 | High (~30%) |

### QR Text Encoding

Used for: `textEncoding` (qrcode)

| String Value | Numeric Value | Description |
|--------------|---------------|-------------|
| `'unicode'` | 0 | Unicode encoding |
| `'ansi'` | 1 | ANSI encoding |
| `'utf8'` | 2 | UTF-8 encoding (recommended) |

### PDF417 Error Correction Levels

Used for: `eccLevel` (pdf417)

| String Value | Numeric Value | Description |
|--------------|---------------|-------------|
| `'auto'` | 0 | Automatic (recommended) |
| `'1'` | 1 | Level 1 |
| `'2'` | 2 | Level 2 |
| `'3'` | 3 | Level 3 |
| `'4'` | 4 | Level 4 |
| `'5'` | 5 | Level 5 |
| `'6'` | 6 | Level 6 |
| `'7'` | 7 | Level 7 |
| `'8'` | 8 | Level 8 (highest) |

---

## Examples

### Complete Product Label

```javascript
const productLabel = buildJobPages([
  [
    // Title
    {
      type: 'text',
      text: 'PRODUCT LABEL',
      x: 0,
      y: 2,
      width: 50,
      height: 8,
      fontHeight: 5,
      fontStyle: 'bold',
      horizontalAlignment: 'center'
    },

    // Product name
    {
      type: 'text',
      text: 'Premium Widget XL',
      x: 5,
      y: 12,
      width: 40,
      fontHeight: 3.5,
      fontStyle: 'regular'
    },

    // Product barcode
    {
      type: 'barcode',
      text: '123456789012',
      x: 5,
      y: 18,
      width: 35,
      height: 12,
      type: 'code128',
      textHeight: 2.5,
      textAlignment: 'center'
    },

    // QR code for more info
    {
      type: 'qrcode',
      text: 'https://example.com/product/widget-xl',
      x: 42,
      y: 18,
      width: 12,
      eccLevel: 'h'
    },

    // Border
    {
      type: 'rectangle',
      x: 1,
      y: 1,
      width: 48,
      height: 33,
      lineWidth: 0.5,
      cornerWidth: 2
    }
  ]
]);
```

### Shipping Label

```javascript
const shippingLabel = buildJobPages([
  [
    // FROM section
    {
      type: 'text',
      text: 'FROM:',
      x: 5,
      y: 5,
      fontHeight: 3,
      fontStyle: 'bold'
    },
    {
      type: 'text',
      text: 'Acme Corp\n123 Main St\nSpringfield, ST 12345',
      x: 5,
      y: 10,
      width: 35,
      fontHeight: 2.5,
      autoReturn: 'word'
    },

    // TO section
    {
      type: 'text',
      text: 'TO:',
      x: 5,
      y: 25,
      fontHeight: 3,
      fontStyle: 'bold'
    },
    {
      type: 'text',
      text: 'John Customer\n456 Oak Ave\nMetropolis, ST 67890',
      x: 5,
      y: 30,
      width: 35,
      fontHeight: 2.5,
      autoReturn: 'word'
    },

    // Tracking barcode
    {
      type: 'barcode',
      text: '1Z999AA10123456784',
      x: 5,
      y: 50,
      width: 50,
      height: 15,
      type: 'code128',
      textHeight: 3
    },

    // Separator line
    {
      type: 'line',
      x1: 5,
      y1: 23,
      x2: 55,
      y2: 23,
      lineWidth: 0.5
    }
  ]
]);
```

### Multi-Label Badge Sheet

```javascript
const badgeSheet = buildJobPages([
  // Badge 1
  [
    {
      type: 'text',
      text: 'VISITOR',
      x: 0,
      y: 2,
      width: 50,
      fontHeight: 6,
      fontStyle: 'bold',
      horizontalAlignment: 'center'
    },
    {
      type: 'text',
      text: 'John Doe',
      x: 5,
      y: 12,
      width: 40,
      fontHeight: 4,
      horizontalAlignment: 'center'
    },
    {
      type: 'qrcode',
      text: 'VISITOR-001-20250212',
      x: 15,
      y: 20,
      width: 20,
      eccLevel: 'm'
    }
  ],

  // Badge 2
  [
    {
      type: 'text',
      text: 'VISITOR',
      x: 0,
      y: 2,
      width: 50,
      fontHeight: 6,
      fontStyle: 'bold',
      horizontalAlignment: 'center'
    },
    {
      type: 'text',
      text: 'Jane Smith',
      x: 5,
      y: 12,
      width: 40,
      fontHeight: 4,
      horizontalAlignment: 'center'
    },
    {
      type: 'qrcode',
      text: 'VISITOR-002-20250212',
      x: 15,
      y: 20,
      width: 20,
      eccLevel: 'm'
    }
  ]
]);
```

### Using Helper Functions

```javascript
const {
  buildJobPages,
  createTextElement,
  createBarcodeElement,
  createQRCodeElement,
  pointsToMM
} = require('./buildJobPages');

const jobPages = buildJobPages([
  [
    createTextElement('Product Name', {
      x: 10,
      y: 5,
      fontHeight: pointsToMM(12),  // Convert 12pt to mm
      fontStyle: 'bold'
    }),

    createBarcodeElement('1234567890', {
      x: 10,
      y: 15,
      width: 30,
      type: 'code128'
    }),

    createQRCodeElement('https://example.com', {
      x: 45,
      y: 15,
      width: 15,
      eccLevel: 'h'
    })
  ]
]);
```

---

## Best Practices

### 1. Use String Enums for Readability

```javascript
// Good ✅
{
  type: 'text',
  fontStyle: 'bold',
  horizontalAlignment: 'center'
}

// Works but less readable ❌
{
  type: 'text',
  fontStyle: 1,
  horizontalAlignment: 1
}
```

### 2. Always Specify Units

```javascript
// Good ✅
{
  type: 'text',
  x: 10,        // mm
  y: 5,         // mm
  fontHeight: 4.233  // mm (12pt)
}

// Unclear ❌
{
  type: 'text',
  x: 10,
  y: 5,
  fontHeight: 12  // Is this points or mm?
}
```

### 3. Use Helper Functions for Font Conversions

```javascript
const { pointsToMM, mmToPoints } = require('./buildJobPages');

// Convert familiar point sizes
const fontSize12pt = pointsToMM(12);  // 4.233mm
const fontSize9pt = pointsToMM(9);    // 3.175mm
```

### 4. Enable Strict Mode During Development

```javascript
// Catches typos and unknown properties
const jobPages = buildJobPages(labels, { strict: true });
```

### 5. Organize Labels Logically

```javascript
// Group related elements together
const label = [
  // Header section
  { type: 'text', text: 'TITLE', ... },
  { type: 'line', ... },

  // Body section
  { type: 'text', text: 'Content', ... },
  { type: 'barcode', ... },

  // Footer section
  { type: 'text', text: 'Footer', ... }
];
```

### 6. Use Descriptive Variable Names

```javascript
// Good ✅
const productNameElement = createTextElement('Widget 3000', {
  x: 10, y: 5, fontHeight: 3.5
});

const productBarcodeElement = createBarcodeElement('123456', {
  x: 10, y: 15, type: 'code128'
});

// Less clear ❌
const el1 = { type: 'text', text: 'Widget 3000', ... };
const el2 = { type: 'barcode', text: '123456', ... };
```

### 7. Test with Sample Data First

```javascript
// Start with minimal label
const testLabel = buildJobPages([
  [{
    type: 'text',
    text: 'TEST',
    x: 10,
    y: 10,
    fontHeight: 5
  }]
]);

// Then expand with more elements
```

### 8. Handle Errors Gracefully

```javascript
try {
  const jobPages = buildJobPages(labels);
  api.print(action, printerInfo, jobInfo, jobPages);
} catch (error) {
  console.error('Label validation failed:', error.message);
  // error.message will show exactly which label/element failed
}
```

### 9. Use Proper QR Error Correction

```javascript
// For labels that might get dirty/damaged
{
  type: 'qrcode',
  text: data,
  eccLevel: 'h'  // High error correction
}

// For clean environments (saves space)
{
  type: 'qrcode',
  text: data,
  eccLevel: 'l'  // Low error correction
}
```

### 10. Mind the Coordinate System

```javascript
// All coordinates are from TOP-LEFT corner
// X increases to the RIGHT →
// Y increases DOWNWARD ↓

{
  x: 0,   // Left edge
  y: 0,   // Top edge
  width: 50,   // Extends right
  height: 30   // Extends down
}
```

---

## Common Patterns

### Pattern: Label with Border

```javascript
const borderWidth = 1;
const labelWidth = 60;
const labelHeight = 40;

[
  // Content inside border
  {
    type: 'text',
    text: 'Content',
    x: borderWidth + 2,
    y: borderWidth + 2,
    width: labelWidth - (borderWidth * 2) - 4
  },

  // Border (drawn last so it's on top)
  {
    type: 'rectangle',
    x: borderWidth / 2,
    y: borderWidth / 2,
    width: labelWidth - borderWidth,
    height: labelHeight - borderWidth,
    lineWidth: borderWidth
  }
]
```

### Pattern: Centered Content

```javascript
const labelWidth = 60;

{
  type: 'text',
  text: 'Centered Text',
  x: 0,
  y: 10,
  width: labelWidth,
  horizontalAlignment: 'center'
}
```

### Pattern: Side-by-Side Elements

```javascript
const leftColumn = 5;
const rightColumn = 35;

[
  // Left side
  {
    type: 'text',
    text: 'Name:',
    x: leftColumn,
    y: 10
  },
  {
    type: 'barcode',
    text: '123',
    x: leftColumn,
    y: 20,
    width: 25
  },

  // Right side
  {
    type: 'qrcode',
    text: 'https://...',
    x: rightColumn,
    y: 10,
    width: 20
  }
]
```

---

## Troubleshooting

### Common Errors

**"Each element must have a 'type' key"**
- Make sure every element has `type: 'text'`, `type: 'barcode'`, etc.

**"Unsupported type 'Text'"**
- Types are case-sensitive. Use lowercase: `'text'` not `'Text'`

**"Missing required field 'text'"**
- Text, barcode, QR code elements need a `text` property
- Image elements need `imageFile` instead

**"Invalid barcode type 'Code128'"**
- Use lowercase: `'code128'` not `'Code128'`

**"fontHeight must be positive"**
- Font sizes must be > 0
- Remember: fontHeight is in millimeters, not points

**"threshold must be 0-255, 256, or 257"**
- For images, use valid threshold values
- 192 is a good default for black & white conversion

---

## API Reference Summary

```javascript
// Main function
buildJobPages(labels, options)

// Helper functions
pointsToMM(points) → mm
mmToPoints(mm) → points

// Element creators
createTextElement(text, properties)
createBarcodeElement(text, properties)
createQRCodeElement(text, properties)
createPDF417Element(text, properties)
createImageElement(imageFile, properties)
createRectangleElement(properties)
createEllipseElement(properties)
createLineElement(properties)

// Enums (exported as enums object)
enums.alignment
enums.fontStyle
enums.autoReturn
enums.barcodeType
enums.qrEcc
enums.qrEncoding
enums.pdf417Ecc
```

---

## Version History

- **v2.2.20250212** - Enhanced validation and comprehensive documentation
- **v2.1** - Added Linux compatibility
- **v2.0** - Interface upgrade with async HTTP requests
- **v1.0** - Initial release

---

## License & Support

This documentation is based on the DTPWeb (PC Python3) Printing Interface Documentation by DothanTech Thanmore.

For issues or questions, please refer to the official documentation or contact support.
