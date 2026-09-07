import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';

export function serializeUser(user) {
  if (!user) return user;
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function hashPassword(password) {
  return password ? bcrypt.hash(password, 10) : null;
}

export async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getOrCreateByEmail({ email, name, phone, role }) {
  const existing = await findByEmail(email);
  if (existing) return existing;

  return prisma.user.create({
    data: { email, name: name || email, phone, role, passwordHash: null },
  });
}

export async function list(query = {}) {
  const users = await prisma.user.findMany({
    where: query.role ? { role: query.role } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  return users.map(serializeUser);
}

export async function getById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw notFoundError('User not found');
  return serializeUser(user);
}

export async function create(data) {
  const { email, password, name, phone, role } = data;
  if (!email || !name || !role) throw badRequestError('email, name and role are required');

  const existing = await findByEmail(email);
  if (existing) throw badRequestError('A user with that email already exists');

  const user = await prisma.user.create({
    data: { email, name, phone, role, passwordHash: await hashPassword(password) },
  });
  return serializeUser(user);
}

export async function update(id, data) {
  await getById(id);
  const { password, name, phone, role } = data;

  const user = await prisma.user.update({
    where: { id },
    data: {
      name,
      phone,
      role,
      ...(password ? { passwordHash: await hashPassword(password) } : {}),
    },
  });
  return serializeUser(user);
}

export async function remove(id) {
  await getById(id);
  await prisma.user.delete({ where: { id } });
}
