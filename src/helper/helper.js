 export async function convertAndValidateDate(dateStr) {
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(datePattern);

  if (!match) {
    return { valid: false, message: "Invalid format. Use DD/MM/YYYY." };
  }

  const [_, dayStr, monthStr, yearStr] = match;
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (month < 1 || month > 12) {
    return { valid: false, message: "Month must be between 01 and 12." };
  }
  if (day < 1 || day > 31) {
    return { valid: false, message: "Day must be between 01 and 31." };
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return { valid: false, message: "Invalid date (e.g. 30/02/2025 doesn't exist)." };
  }

  return { valid: true, date };
}
