import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

export async function list(query = {}) {
  return prisma.notification.findMany({
    where: query.userId ? { userId: query.userId } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getById(id) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) throw notFoundError('Notification not found');
  return notification;
}

export async function create(data) {
  const { userId, type, message } = data;
  if (!userId || !type || !message) throw badRequestError('userId, type and message are required');

  return prisma.notification.create({ data: { userId, type, message } });
}

export async function update(id, data) {
  await getById(id);
  return prisma.notification.update({ where: { id }, data: { read: data.read } });
}

export async function remove(id) {
  await getById(id);
  await prisma.notification.delete({ where: { id } });
}
