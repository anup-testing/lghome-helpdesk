import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError, unauthorizedError } from '../utils/errors.js';
import { findByEmail, hashPassword, serializeUser } from '../users/users.service.js';

const TOKEN_TTL = '2h';

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

export async function register(data) {
  const { email, password, name, phone, role = 'CUSTOMER' } = data;
  if (!email || !password || !name) throw badRequestError('email, password and name are required');

  const existing = await findByEmail(email);
  if (existing) throw badRequestError('A user with that email already exists');

  const user = await prisma.user.create({
    data: { email, name, phone, role, passwordHash: await hashPassword(password) },
  });

  if (role === 'CUSTOMER') {
    await prisma.customer.create({ data: { userId: user.id } });
  } else if (role === 'TECHNICIAN') {
    await prisma.technician.create({ data: { userId: user.id, skills: [] } });
  }

  return { user: serializeUser(user), token: signToken(user) };
}

export async function login(credentials) {
  const { email, password } = credentials;
  if (!email || !password) throw badRequestError('email and password are required');

  const user = await findByEmail(email);
  if (!user || !user.passwordHash) throw unauthorizedError('Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw unauthorizedError('Invalid email or password');

  return { user: serializeUser(user), token: signToken(user) };
}

export async function refresh(data) {
  const { token } = data;
  if (!token) throw badRequestError('token is required');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw unauthorizedError('Invalid or expired token');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw notFoundError('User not found');

  return { token: signToken(user) };
}

export async function logout() {
  return { ok: true };
}

export async function me(user) {
  if (!user) throw unauthorizedError('Not authenticated');

  const record = await prisma.user.findUnique({ where: { id: user.sub } });
  if (!record) throw notFoundError('User not found');

  return serializeUser(record);
}
