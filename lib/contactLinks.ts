export function normalizeTel(phone: string) {
  return phone.replace(/\s+/g, "");
}

export function toTelHref(phone: string) {
  return `tel:${normalizeTel(phone)}`;
}

export function toMailtoHref(email: string) {
  return `mailto:${email}`;
}

export function toWhatsAppHref(phone: string, message: string) {
  const cleanPhone = phone.replace(/[^\d+]/g, "").replace("+", "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
