import { prisma } from '../config/prisma.js';
import { methodNotAllowedError, notFoundError } from '../utils/errors.js';

async function ticketsByStatus() {
  const grouped = await prisma.ticket.groupBy({ by: ['status'], _count: { _all: true } });
  return grouped.map((row) => ({ status: row.status, count: row._count._all }));
}

async function ticketsByServiceType() {
  const grouped = await prisma.ticket.groupBy({ by: ['serviceType'], _count: { _all: true } });
  return grouped.map((row) => ({ serviceType: row.serviceType, count: row._count._all }));
}

async function revenueSummary() {
  const [paid, outstanding] = await Promise.all([
    prisma.invoice.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
    prisma.invoice.aggregate({ where: { status: { in: ['SENT', 'OVERDUE'] } }, _sum: { amount: true } }),
  ]);
  return {
    paidTotal: paid._sum.amount ?? 0,
    outstandingTotal: outstanding._sum.amount ?? 0,
  };
}

const REPORTS = {
  'tickets-by-status': ticketsByStatus,
  'tickets-by-service-type': ticketsByServiceType,
  'revenue-summary': revenueSummary,
};

export async function list() {
  const [byStatus, byServiceType, revenue] = await Promise.all([
    ticketsByStatus(),
    ticketsByServiceType(),
    revenueSummary(),
  ]);
  return { ticketsByStatus: byStatus, ticketsByServiceType: byServiceType, revenue };
}

export async function getById(id) {
  const handler = REPORTS[id];
  if (!handler) throw notFoundError(`Unknown report "${id}". Available: ${Object.keys(REPORTS).join(', ')}`);
  return handler();
}

export async function create() {
  throw methodNotAllowedError('Reports are read-only');
}

export async function update() {
  throw methodNotAllowedError('Reports are read-only');
}

export async function remove() {
  throw methodNotAllowedError('Reports are read-only');
}
