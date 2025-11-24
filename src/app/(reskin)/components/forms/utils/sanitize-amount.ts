export function sanitizeAmountInput(rawValue: string) {
  const sanitizedValue = rawValue.replace(/[^0-9.]/g, "");

  if (sanitizedValue === "") {
    return "";
  }

  const parts = sanitizedValue.split(".");
  const integerPart = String(Number(parts[0]) || 0);
  const decimalPart = parts.length > 1 ? parts[1] : "";

  return parts.length > 1 ? `${integerPart}.${decimalPart}` : integerPart;
}
