// export function themeText(data) {
//   return {
//     printerInfo: {
//       printerName: 'DP27P Label Printer'
//     },
//     jobInfo: {
//       jobWidth: 48,
//       jobHeight: 54,
//       orientation: 0
//     },
//     jobPages: [
//       [
//         {
//           type: 'rectangle',
//           x: 1,
//           y: 1,
//           width: 46,
//           height: 52,
//           lineWidth: 0.5,
//           fillColor: null
//         },
//         {
//           type: 'text',
//           text: data.facility_name,
//           x: 2,
//           y: 2,
//           width: 44,
//           height: 3,
//           fontHeight: 3.2,
//           fontName: 'Arial',
//           fontStyle: 1,
//           horizontalAlignment: 1,
//           verticalAlignment: 1
//         },
//         {
//           type: 'text',
//           text: data.facility_address,
//           x: 2,
//           y: 5,
//           width: 44,
//           height: 2,
//           fontHeight: 1.8,
//           fontName: 'Arial',
//           horizontalAlignment: 1,
//           verticalAlignment: 1
//         },
//         {
//           type: 'text',
//           text: data.facility_contact,
//           x: 2,
//           y: 7,
//           width: 44,
//           height: 2,
//           fontHeight: 1.8,
//           fontName: 'Arial',
//           horizontalAlignment: 1,
//           verticalAlignment: 1
//         },
//         {
//           type: 'rectangle',
//           x: 2,
//           y: 9.5,
//           width: 44,
//           height: 7.700000000000001,
//           lineWidth: 0.5,
//           fillColor: null
//         },
//         {
//           type: 'text',
//           text: data.product,
//           x: 2,
//           y: 9.5,
//           width: 44,
//           height: 7.700000000000001,
//           fontHeight: 3.5,
//           fontName: 'Arial',
//           fontStyle: 1,
//           horizontalAlignment: 1,
//           verticalAlignment: 1
//         },
//         {
//           type: 'text',
//           text: data.instructions,
//           x: 2,
//           y: 18.200000000000003,
//           width: 44,
//           height: 16.519999999999996,
//           fontHeight: 4.0,
//           fontName: 'Arial',
//           fontStyle: 1,
//           lineSpacing: 1.3,
//           horizontalAlignment: 0,
//           verticalAlignment: 0
//         },
//         {
//           type: 'text',
//           text: 'Patient:',
//           x: 2,
//           y: 35.72,
//           width: 7,
//           height: 3,
//           fontHeight: 2.5,
//           fontName: 'Arial',
//           horizontalAlignment: 0,
//           verticalAlignment: 1
//         },
//         {
//           type: 'text',
//           text: data.client_name,
//           x: 9,
//           y: 35.72,
//           width: 37,
//           height: 3,
//           fontHeight: 2.5,
//           fontName: 'Arial',
//           fontStyle: 1,
//           horizontalAlignment: 0,
//           verticalAlignment: 1
//         },
//         {
//           type: 'text',
//           text: data.datetime || '',
//           x: 2,
//           y: 39.72,
//           width: 22,
//           height: 3,
//           fontHeight: 2.0,
//           fontName: 'Arial',
//           horizontalAlignment: 0,
//           verticalAlignment: 1
//         },
//         {
//           type: 'text',
//           text: 'Disp by:',
//           x: 25,
//           y: 39.72,
//           width: 7,
//           height: 3,
//           fontHeight: 2.2,
//           fontName: 'Arial',
//           horizontalAlignment: 0,
//           verticalAlignment: 1
//         },
//         {
//           type: 'rectangle',
//           x: 32,
//           y: 39.72,
//           width: 14,
//           height: 3,
//           lineWidth: 0.2,
//           fillColor: null
//         },
//         {
//           type: 'text',
//           text: data.user,
//           x: 32.5,
//           y: 39.72,
//           width: 13,
//           height: 3,
//           fontHeight: 2.2,
//           fontName: 'Arial',
//           horizontalAlignment: 0,
//           verticalAlignment: 1
//         },
//         {
//           type: 'line',
//           x1: 2,
//           y1: 43.72,
//           x2: 47,
//           y2: 43.72,
//           lineWidth: 0.2
//         },
//         {
//           type: 'text',
//           text: '⚠',
//           x: 2,
//           y: 44.72,
//           width: 4,
//           height: 8.28,
//           fontHeight: 4,
//           fontName: 'Arial',
//           horizontalAlignment: 1,
//           verticalAlignment: 1
//         },
//         {
//           type: 'text',
//           text: data.warning,
//           x: 6.5,
//           y: 44.72,
//           width: 39.5,
//           height: 8.28,
//           fontHeight: 2.3,
//           fontName: 'Arial',
//           lineSpacing: 1.2,
//           horizontalAlignment: 0,
//           verticalAlignment: 1
//         }
//       ]
//     ]
//   }
// }

export function themeText(data) {
  const safe = {
    facility_name: data.facility_name ?? '',
    facility_contact: data.facility_contact ?? '',
    facility_address: data.facility_address ?? '',
    product: data.product ?? '',
    instructions: data.instructions ?? '',
    warning: data.warning ?? '',
    client_name: data.client_name ?? '',
    datetime: data.datetime ?? '',
    user: data.user ?? ''
  }

  return {
    printerInfo: {
      printerName: 'DP27P Label Printer'
    },
    jobInfo: {
      jobWidth: 48,
      jobHeight: 54,
      orientation: 0
    },
    jobPages: [
      [
        // rectangle + other shapes untouched
        {
          type: 'rectangle',
          x: 1,
          y: 1,
          width: 46,
          height: 52,
          lineWidth: 0.5,
          fillColor: null
        },
        {
          type: 'text',
          text: safe.facility_name,
          x: 2,
          y: 2,
          width: 44,
          height: 3,
          fontHeight: 3.2,
          fontName: 'Arial',
          fontStyle: 1,
          horizontalAlignment: 1,
          verticalAlignment: 1
        },
        {
          type: 'text',
          text: safe.facility_address,
          x: 2,
          y: 5,
          width: 44,
          height: 2,
          fontHeight: 1.8,
          fontName: 'Arial',
          horizontalAlignment: 1,
          verticalAlignment: 1
        },
        {
          type: 'text',
          text: safe.facility_contact,
          x: 2,
          y: 7,
          width: 44,
          height: 2,
          fontHeight: 1.8,
          fontName: 'Arial',
          horizontalAlignment: 1,
          verticalAlignment: 1
        },
        {
          type: 'rectangle',
          x: 2,
          y: 9.5,
          width: 44,
          height: 7.7,
          lineWidth: 0.5,
          fillColor: null
        },
        {
          type: 'text',
          text: safe.product,
          x: 2,
          y: 9.5,
          width: 44,
          height: 7.7,
          fontHeight: 3.5,
          fontName: 'Arial',
          fontStyle: 1,
          horizontalAlignment: 1,
          verticalAlignment: 1
        },
        {
          type: 'text',
          text: safe.instructions,
          x: 2,
          y: 18.2,
          width: 44,
          height: 16.52,
          fontHeight: 4.0,
          fontName: 'Arial',
          fontStyle: 1,
          lineSpacing: 1.3,
          horizontalAlignment: 0,
          verticalAlignment: 0
        },
        {
          type: 'text',
          text: 'Patient:',
          x: 2,
          y: 35.72,
          width: 7,
          height: 3,
          fontHeight: 2.5,
          fontName: 'Arial',
          horizontalAlignment: 0,
          verticalAlignment: 1
        },
        {
          type: 'text',
          text: safe.client_name,
          x: 9,
          y: 35.72,
          width: 37,
          height: 3,
          fontHeight: 2.5,
          fontName: 'Arial',
          fontStyle: 1,
          horizontalAlignment: 0,
          verticalAlignment: 1
        },
        {
          type: 'text',
          text: safe.datetime,
          x: 2,
          y: 39.72,
          width: 22,
          height: 3,
          fontHeight: 2.0,
          fontName: 'Arial',
          horizontalAlignment: 0,
          verticalAlignment: 1
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
          horizontalAlignment: 0,
          verticalAlignment: 1
        },
        {
          type: 'text',
          text: safe.user,
          x: 32.5,
          y: 39.72,
          width: 13,
          height: 3,
          fontHeight: 2.2,
          fontName: 'Arial',
          horizontalAlignment: 0,
          verticalAlignment: 1
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
          horizontalAlignment: 1,
          verticalAlignment: 1
        },
        {
          type: 'text',
          text: safe.warning,
          x: 6.5,
          y: 44.72,
          width: 39.5,
          height: 8.28,
          fontHeight: 2.3,
          fontName: 'Arial',
          lineSpacing: 1.2,
          horizontalAlignment: 0,
          verticalAlignment: 1
        }
      ]
    ]
  }
}
