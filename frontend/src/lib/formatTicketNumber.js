export function formatTicketNumber(ticketNumber) {
  return String(ticketNumber).padStart(4, '0');
}
