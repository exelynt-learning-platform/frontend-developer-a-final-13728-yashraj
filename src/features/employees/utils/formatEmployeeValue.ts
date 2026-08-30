export const NOT_AVAILABLE = "Not available";

export const normalizeWords = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/(^|[\s'-])\p{L}/gu, (character) => character.toLocaleUpperCase())
    .replace(/\s+/g, " ");

export const normalizeEmail = (value: string) =>
  value.trim().toLocaleLowerCase();

export const formatNameOrCountry = (value: string) => {
  const normalizedValue = value.trim().replace(/\s+/g, " ");
  return normalizedValue && /^\p{L}[\p{L}\s'-]*$/u.test(normalizedValue)
    ? normalizeWords(normalizedValue)
    : NOT_AVAILABLE;
};

export const formatEmail = (value: string) => {
  const normalizedValue = normalizeEmail(value);
  return normalizedValue && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)
    ? normalizedValue
    : NOT_AVAILABLE;
};
