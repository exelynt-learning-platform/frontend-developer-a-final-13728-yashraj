// The country API only returns country records. State/district options are local.
export const locationData: Record<string, Record<string, string[]>> = {
  India: { Maharashtra: ['Mumbai', 'Pune', 'Nagpur'], 'Madhya Pradesh': ['Bhopal', 'Indore', 'Rewa'], Delhi: ['New Delhi'] },
  Algeria: { MP: ['Rewa'] },
  Martinique: { Maharashtra: ['Pune'] },
}

export function getStates(country: string, currentState?: string) {
  const states = Object.keys(locationData[country] ?? { Other: ['Other'] })
  return currentState && !states.includes(currentState) ? [...states, currentState] : states
}

export function getDistricts(country: string, state: string, currentDistrict?: string) {
  const districts = locationData[country]?.[state] ?? (state ? ['Other'] : [])
  return currentDistrict && !districts.includes(currentDistrict) ? [...districts, currentDistrict] : districts
}
