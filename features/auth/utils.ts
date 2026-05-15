export function normalizePhoneNumber(phone: string) {
  return phone.replace(/\s/g, "");
}

export function maskPhoneNumber(phone: string) {
  return phone.replace(/\d(?=\d{4})/g, "X");
}
