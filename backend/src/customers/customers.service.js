import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';
import { getOrCreateByEmail, serializeUser } from '../users/users.service.js';

function serializeCustomer(customer) {
  if (!customer) return customer;
  return { ...customer, user: customer.user ? serializeUser(customer.user) : customer.user };
}

export async function list() {
  const customers = await prisma.customer.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return customers.map(serializeCustomer);
}

export async function getById(id) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { user: true, properties: true },
  });
  if (!customer) throw notFoundError('Customer not found');
  return serializeCustomer(customer);
}

export async function create(data) {
  const { userId, email, name, phone, company } = data;

  let resolvedUserId = userId;
  if (!resolvedUserId) {
    if (!email || !name) throw badRequestError('email and name are required to create a customer');
    const user = await getOrCreateByEmail({ email, name, phone, role: 'CUSTOMER' });
    resolvedUserId = user.id;
  }

  const customer = await prisma.customer.create({
    data: { userId: resolvedUserId, company },
    include: { user: true },
  });
  return serializeCustomer(customer);
}

export async function update(id, data) {
  await getById(id);
  const customer = await prisma.customer.update({
    where: { id },
    data: { company: data.company },
    include: { user: true },
  });
  return serializeCustomer(customer);
}

export async function remove(id) {
  await getById(id);
  await prisma.customer.delete({ where: { id } });
}

export async function findOrCreateGuestCustomer({ firstName, lastName, email, phone }) {
  if (!email) throw badRequestError('email is required');

  const name = [firstName, lastName].filter(Boolean).join(' ').trim() || email;
  const user = await getOrCreateByEmail({ email, name, phone, role: 'CUSTOMER' });

  let customer = await prisma.customer.findUnique({ where: { userId: user.id } });
  if (!customer) {
    customer = await prisma.customer.create({ data: { userId: user.id } });
  }
  return customer;
}
