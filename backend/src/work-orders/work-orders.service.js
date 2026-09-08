import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

const INCLUDE = {
  ticket: true,
  technician: { include: { user: true } },
  partsUsed: { include: { part: true } },
};

function serialize(order) {
  if (!order) return order;
  const { technician, ...rest } = order;
  if (!technician) return rest;
  const { passwordHash, ...user } = technician.user ?? {};
  return { ...rest, technician: { ...technician, user } };
}

export async function list(query = {}) {
  const where = {};
  if (query.technicianId) where.technicianId = query.technicianId;
  if (query.ticketId) where.ticketId = query.ticketId;

  const orders = await prisma.workOrder.findMany({ where, include: INCLUDE, orderBy: { createdAt: 'desc' } });
  return orders.map(serialize);
}

export async function getById(id) {
  const order = await prisma.workOrder.findUnique({ where: { id }, include: INCLUDE });
  if (!order) throw notFoundError('Work order not found');
  return serialize(order);
}

export async function create(data) {
  const { ticketId, technicianId, notes, status, parts = [] } = data;
  if (!ticketId || !technicianId) throw badRequestError('ticketId and technicianId are required');

  const order = await prisma.workOrder.create({
    data: {
      ticketId,
      technicianId,
      notes,
      status,
      partsUsed: parts.length
        ? { create: parts.map((p) => ({ partId: p.partId, quantity: p.quantity })) }
        : undefined,
    },
    include: INCLUDE,
  });
  return serialize(order);
}

export async function update(id, data) {
  await getById(id);
  const { notes, status, completedAt } = data;
  const order = await prisma.workOrder.update({
    where: { id },
    data: {
      notes,
      status,
      completedAt: completedAt ? new Date(completedAt) : undefined,
    },
    include: INCLUDE,
  });
  return serialize(order);
}

export async function remove(id) {
  await getById(id);
  await prisma.workOrder.delete({ where: { id } });
}
