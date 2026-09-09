import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

const AUTHOR_SELECT = { id: true, name: true, email: true, role: true };

export async function list(ticketId) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId }, select: { id: true } });
  if (!ticket) throw notFoundError('Ticket not found');

  return prisma.ticketMessage.findMany({
    where: { ticketId },
    include: { author: { select: AUTHOR_SELECT } },
    orderBy: { createdAt: 'asc' },
  });
}

export async function create(ticketId, authorId, data) {
  const message = data.message?.trim();
  if (!message) throw badRequestError('message is required');

  const [ticket, author] = await Promise.all([
    prisma.ticket.findUnique({ where: { id: ticketId }, select: { id: true } }),
    prisma.user.findUnique({ where: { id: authorId }, select: { id: true } }),
  ]);
  if (!ticket) throw notFoundError('Ticket not found');
  if (!author) throw notFoundError('Message author not found');

  return prisma.ticketMessage.create({
    data: { ticketId, authorId, message },
    include: { author: { select: AUTHOR_SELECT } },
  });
}
