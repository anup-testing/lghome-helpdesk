import { prisma } from '../config/prisma.js';
import { badRequestError, notFoundError } from '../utils/errors.js';
import { getOrCreateByEmail, serializeUser } from '../users/users.service.js';

function serializeTechnician(technician) {
  if (!technician) return technician;
  return { ...technician, user: technician.user ? serializeUser(technician.user) : technician.user };
}

export async function list() {
  const technicians = await prisma.technician.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return technicians.map(serializeTechnician);
}

export async function getById(id) {
  const technician = await prisma.technician.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!technician) throw notFoundError('Technician not found');
  return serializeTechnician(technician);
}

export async function create(data) {
  const { userId, email, name, phone, skills = [] } = data;

  let resolvedUserId = userId;
  if (!resolvedUserId) {
    if (!email || !name) throw badRequestError('email and name are required to create a technician');
    const user = await getOrCreateByEmail({ email, name, phone, role: 'TECHNICIAN' });
    resolvedUserId = user.id;
  }

  const technician = await prisma.technician.create({
    data: { userId: resolvedUserId, skills },
    include: { user: true },
  });
  return serializeTechnician(technician);
}

export async function update(id, data) {
  await getById(id);
  const technician = await prisma.technician.update({
    where: { id },
    data: { skills: data.skills },
    include: { user: true },
  });
  return serializeTechnician(technician);
}

export async function remove(id) {
  await getById(id);
  await prisma.technician.delete({ where: { id } });
}
