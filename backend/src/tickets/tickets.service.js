import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';
import { findOrCreateGuestCustomer } from '../customers/customers.service.js';

const SERVICE_TYPE_LABELS = {
  HEATING: 'Heating',
  COOLING: 'Cooling',
  WATER_SOLUTIONS: 'Water Solutions',
  AIR_QUALITY: 'Air Quality',
  GENERATORS: 'Generators',
  SECURITY: 'Security',
  OTHER: 'Other',
};

function toServiceTypeEnum(label) {
  if (!label) return null;
  const key = label
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return key in SERVICE_TYPE_LABELS ? key : null;
}

const TICKET_INCLUDE = {
  customer: { include: { user: true } },
  technician: { include: { user: true } },
  property: true,
  equipment: true,
};

function resolveTicketWhere(idOrNumber) {
  return /^\d+$/.test(String(idOrNumber)) ? { ticketNumber: Number(idOrNumber) } : { id: idOrNumber };
}

function stripPassword(user) {
  if (!user) return user;
  const { passwordHash, ...rest } = user;
  return rest;
}

function serializeTicket(ticket) {
  if (!ticket) return ticket;
  const { customer, technician, ...rest } = ticket;
  return {
    ...rest,
    customer: customer ? { ...customer, user: stripPassword(customer.user) } : customer,
    technician: technician ? { ...technician, user: stripPassword(technician.user) } : technician,
  };
}

export async function list(query = {}) {
  const where = {};
  if (query.customerId) where.customerId = query.customerId;
  if (query.technicianId) where.technicianId = query.technicianId;
  if (query.status) where.status = query.status;

  const tickets = await prisma.ticket.findMany({
    where,
    include: TICKET_INCLUDE,
    orderBy: { createdAt: 'desc' },
  });
  return tickets.map(serializeTicket);
}

export async function getById(idOrNumber) {
  const ticket = await prisma.ticket.findUnique({
    where: resolveTicketWhere(idOrNumber),
    include: {
      ...TICKET_INCLUDE,
      appointments: true,
      workOrders: true,
      invoices: true,
      files: true,
    },
  });
  if (!ticket) throw notFoundError('Ticket not found');
  return serializeTicket(ticket);
}

export async function create(data) {
  let { customerId, propertyId, equipmentId, title, description, serviceType, priority } = data;

  if (!customerId) {
    const { firstName, lastName, email, phone, message } = data;
    if (!email || !message) throw badRequestError('email and message are required');

    const customer = await findOrCreateGuestCustomer({ firstName, lastName, email, phone });
    customerId = customer.id;
    description = description ?? message;
    title =
      title ??
      `${serviceType ?? 'Service'} request from ${[firstName, lastName].filter(Boolean).join(' ') || email}`;
  }

  const serviceTypeEnum = toServiceTypeEnum(serviceType);
  if (!serviceTypeEnum) throw badRequestError('serviceType is required and must be a valid service type');
  if (!description) throw badRequestError('description is required');

  const ticket = await prisma.ticket.create({
    data: {
      customerId,
      propertyId: propertyId ?? undefined,
      equipmentId: equipmentId ?? undefined,
      title: title ?? `${SERVICE_TYPE_LABELS[serviceTypeEnum]} request`,
      description,
      serviceType: serviceTypeEnum,
      priority: priority ?? undefined,
    },
    include: TICKET_INCLUDE,
  });
  return serializeTicket(ticket);
}

export async function update(idOrNumber, data) {
  await getById(idOrNumber);

  const {
    title,
    description,
    status,
    priority,
    technicianId,
    propertyId,
    equipmentId,
    feedbackRating,
    feedbackComment,
  } = data;

  const ticket = await prisma.ticket.update({
    where: resolveTicketWhere(idOrNumber),
    data: {
      title,
      description,
      status,
      priority,
      technicianId,
      propertyId,
      equipmentId,
      feedbackRating,
      feedbackComment,
    },
    include: TICKET_INCLUDE,
  });
  return serializeTicket(ticket);
}

export async function remove(idOrNumber) {
  await getById(idOrNumber);
  await prisma.ticket.delete({ where: resolveTicketWhere(idOrNumber) });
}
