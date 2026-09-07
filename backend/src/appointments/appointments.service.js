import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

const INCLUDE = { ticket: true, technician: { include: { user: true } } };

function serialize(appointment) {
  if (!appointment) return appointment;
  const { technician, ...rest } = appointment;
  if (!technician) return rest;
  const { passwordHash, ...user } = technician.user ?? {};
  return { ...rest, technician: { ...technician, user } };
}

export async function list(query = {}) {
  const where = {};
  if (query.technicianId) where.technicianId = query.technicianId;
  if (query.ticketId) where.ticketId = query.ticketId;

  const appointments = await prisma.appointment.findMany({
    where,
    include: INCLUDE,
    orderBy: { scheduledStart: 'asc' },
  });
  return appointments.map(serialize);
}

export async function getById(id) {
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: INCLUDE });
  if (!appointment) throw notFoundError('Appointment not found');
  return serialize(appointment);
}

export async function create(data) {
  const { ticketId, technicianId, scheduledStart, scheduledEnd, status } = data;
  if (!ticketId || !technicianId || !scheduledStart || !scheduledEnd) {
    throw badRequestError('ticketId, technicianId, scheduledStart and scheduledEnd are required');
  }

  const appointment = await prisma.appointment.create({
    data: {
      ticketId,
      technicianId,
      scheduledStart: new Date(scheduledStart),
      scheduledEnd: new Date(scheduledEnd),
      status,
    },
    include: INCLUDE,
  });
  return serialize(appointment);
}

export async function update(id, data) {
  await getById(id);
  const { scheduledStart, scheduledEnd, status, technicianId } = data;
  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      scheduledStart: scheduledStart ? new Date(scheduledStart) : undefined,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : undefined,
      status,
      technicianId,
    },
    include: INCLUDE,
  });
  return serialize(appointment);
}

export async function remove(id) {
  await getById(id);
  await prisma.appointment.delete({ where: { id } });
}
