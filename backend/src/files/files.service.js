import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

export async function list(query = {}) {
  const where = {};
  if (query.ticketId) where.ticketId = query.ticketId;
  if (query.workOrderId) where.workOrderId = query.workOrderId;

  return prisma.file.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export async function getById(id) {
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) throw notFoundError('File not found');
  return file;
}

export async function create(data) {
  const { ticketId, workOrderId, uploadedById, filename, url, mimeType } = data;
  if (!uploadedById || !filename || !url) throw badRequestError('uploadedById, filename and url are required');

  return prisma.file.create({
    data: { ticketId, workOrderId, uploadedById, filename, url, mimeType },
  });
}

export async function update(id, data) {
  await getById(id);
  const { filename, url, mimeType } = data;
  return prisma.file.update({ where: { id }, data: { filename, url, mimeType } });
}

export async function remove(id) {
  await getById(id);
  await prisma.file.delete({ where: { id } });
}
