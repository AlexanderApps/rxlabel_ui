function cleanPrinterData(data, settings, currentUser) {
  try {
    if (!settings || !currentUser) {
      throw new Error('Missing settings or currentUser')
    }

    const facilityFields = {
      facility_name: settings.facility_name ?? '',
      facility_contact: settings.facility_contact ?? '',
      facility_address: settings.facility_address ?? '',
      user: currentUser?.name ?? 'Unknown'
    }

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return []
      }

      return data.map((d) => ({
        ...d,
        ...facilityFields
      }))
    }

    if (typeof data === 'object' && data !== null) {
      return {
        ...data,
        ...facilityFields
      }
    }

    throw new Error('Invalid data format: expected array or object')
  } catch (err) {
    console.error('[cleanPrinterData error]', err)

    // decide on fallback — here returning null is clear
    return null
  }
}

export { cleanPrinterData }
