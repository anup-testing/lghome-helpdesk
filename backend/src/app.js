import express from 'express';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './auth/auth.routes.js';
import usersRoutes from './users/users.routes.js';
import customersRoutes from './customers/customers.routes.js';
import techniciansRoutes from './technicians/technicians.routes.js';
import propertiesRoutes from './properties/properties.routes.js';
import equipmentRoutes from './equipment/equipment.routes.js';
import ticketsRoutes from './tickets/tickets.routes.js';
import appointmentsRoutes from './appointments/appointments.routes.js';
import workOrdersRoutes from './work-orders/work-orders.routes.js';
import partsRoutes from './parts/parts.routes.js';
import invoicesRoutes from './invoices/invoices.routes.js';
import paymentsRoutes from './payments/payments.routes.js';
import notificationsRoutes from './notifications/notifications.routes.js';
import reportsRoutes from './reports/reports.routes.js';
import filesRoutes from './files/files.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/technicians', techniciansRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/work-orders', workOrdersRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/files', filesRoutes);

app.use(errorHandler);
