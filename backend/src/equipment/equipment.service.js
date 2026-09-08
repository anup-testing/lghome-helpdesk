import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

export async function list(query = {}) {
  return prisma.equipment.findMany({
    where: query.propertyId ? { propertyId: query.propertyId } : undefined,
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getById(id) {
  const equipment = await prisma.equipment.findUnique({ where: { id }, include: { property: true } });
  if (!equipment) throw notFoundError('Equipment not found');
  return equipment;
}

export async function create(data) {
  const { propertyId, type, model, serialNumber, installedAt } = data;
  if (!propertyId || !type) throw badRequestError('propertyId and type are required');

  return prisma.equipment.create({
    data: {
      propertyId,
      type,
      model,
      serialNumber,
      installedAt: installedAt ? new Date(installedAt) : undefined,
    },
  });
}

export async function update(id, data) {
  await getById(id);
  const { type, model, serialNumber, installedAt } = data;
  return prisma.equipment.update({
    where: { id },
    data: {
      type,
      model,
      serialNumber,
      installedAt: installedAt ? new Date(installedAt) : undefined,
    },
  });
}

export async function remove(id) {
  await getById(id);
  await prisma.equipment.delete({ where: { id } });
}
