import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

export async function list() {
  return prisma.part.findMany({ orderBy: { name: 'asc' } });
}

export async function getById(id) {
  const part = await prisma.part.findUnique({ where: { id } });
  if (!part) throw notFoundError('Part not found');
  return part;
}

export async function create(data) {
  const { name, sku, quantity, unitCost } = data;
  if (!name || !sku || unitCost === undefined) throw badRequestError('name, sku and unitCost are required');

  return prisma.part.create({ data: { name, sku, quantity: quantity ?? 0, unitCost } });
}

export async function update(id, data) {
  await getById(id);
  const { name, quantity, unitCost } = data;
  return prisma.part.update({ where: { id }, data: { name, quantity, unitCost } });
}

export async function remove(id) {
  await getById(id);
  await prisma.part.delete({ where: { id } });
}
