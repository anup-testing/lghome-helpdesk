import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

const INCLUDE = { payments: true, ticket: true, customer: { include: { user: true } } };

function serializeInvoice(invoice) {
  if (!invoice?.customer?.user) return invoice;
  const { passwordHash, ...user } = invoice.customer.user;
  return { ...invoice, customer: { ...invoice.customer, user } };
}

export async function list(query = {}) {
  const where = {};
  if (query.customerId) where.customerId = query.customerId;
  if (query.status) where.status = query.status;

  const invoices = await prisma.invoice.findMany({ where, include: INCLUDE, orderBy: { createdAt: 'desc' } });
  return invoices.map(serializeInvoice);
}

export async function getById(id) {
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: INCLUDE });
  if (!invoice) throw notFoundError('Invoice not found');
  return serializeInvoice(invoice);
}

export async function create(data) {
  const { ticketId, customerId, amount, dueDate } = data;
  if (!ticketId || !customerId || amount === undefined) {
    throw badRequestError('ticketId, customerId and amount are required');
  }

  const invoice = await prisma.invoice.create({
    data: {
      ticketId,
      customerId,
      amount,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
    include: INCLUDE,
  });
  return serializeInvoice(invoice);
}

export async function update(id, data) {
  await getById(id);
  const { status, amount, dueDate } = data;
  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status, amount, dueDate: dueDate ? new Date(dueDate) : undefined },
    include: INCLUDE,
  });
  return serializeInvoice(invoice);
}

export async function remove(id) {
  await getById(id);
  await prisma.invoice.delete({ where: { id } });
}
