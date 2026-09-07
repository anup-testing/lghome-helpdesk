import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

export async function list(query = {}) {
  return prisma.payment.findMany({
    where: query.invoiceId ? { invoiceId: query.invoiceId } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getById(id) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw notFoundError('Payment not found');
  return payment;
}

export async function create(data) {
  const { invoiceId, amount, method, status } = data;
  if (!invoiceId || amount === undefined || !method) {
    throw badRequestError('invoiceId, amount and method are required');
  }

  return prisma.payment.create({ data: { invoiceId, amount, method, status } });
}

export async function update(id, data) {
  await getById(id);
  const { status, paidAt } = data;
  return prisma.payment.update({
    where: { id },
    data: { status, paidAt: paidAt ? new Date(paidAt) : undefined },
  });
}

export async function remove(id) {
  await getById(id);
  await prisma.payment.delete({ where: { id } });
}
