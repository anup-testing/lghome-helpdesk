import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

export async function list(query = {}) {
  return prisma.property.findMany({
    where: query.customerId ? { customerId: query.customerId } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getById(id) {
  const property = await prisma.property.findUnique({
    where: { id },
    include: { equipment: true },
  });
  if (!property) throw notFoundError('Property not found');
  return property;
}

export async function create(data) {
  const { customerId, address, city, province, postalCode } = data;
  if (!customerId || !address || !city) throw badRequestError('customerId, address and city are required');

  return prisma.property.create({ data: { customerId, address, city, province, postalCode } });
}

export async function update(id, data) {
  await getById(id);
  const { address, city, province, postalCode } = data;
  return prisma.property.update({ where: { id }, data: { address, city, province, postalCode } });
}

export async function remove(id) {
  await getById(id);
  await prisma.property.delete({ where: { id } });
}
