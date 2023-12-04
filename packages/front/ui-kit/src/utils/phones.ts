import { parsePhoneNumberWithError, formatNumber } from "libphonenumber-js";

export function prepareNumberToLibPhoneNumber(phone: string) {
  if (phone === "" || phone.startsWith("+")) return phone;
  return `+${phone}`;
}

export function formatPhoneNumberWithLibPhoneNumber(phone: string) {
  try {
    const parsed = parsePhoneNumberWithError(prepareNumberToLibPhoneNumber(phone));
    if (!parsed.country) return phone;
    return formatNumber(parsed.nationalNumber, parsed.country, "INTERNATIONAL");
  } catch (e) {
    return phone;
  }
}
