import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import ticketsRouter from './routes/tickets.js';
import statusRouter from './routes/status.js';

for (const key of ['FRAPPE_URL', 'FRAPPE_API_KEY', 'FRAPPE_API_SECRET']) {
  if (!process.env[key]) console.warn(`[config] ${key} is not set - copy .env.example to .env and fill it in`);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/tickets', ticketsRouter);
app.use('/status', statusRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`portal-backend listening on :${port}`));
