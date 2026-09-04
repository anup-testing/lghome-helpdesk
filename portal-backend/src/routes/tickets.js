import { Router } from 'express';
import { createTicket, escalateTicket, submitFeedback } from '../services/frappe.js';

const router = Router();
const REQUIRED_FIELDS = ['firstName', 'lastName', 'phone', 'email', 'serviceType', 'message'];

router.post('/', async (req, res) => {
  const missing = REQUIRED_FIELDS.filter((field) => !req.body[field]);
  if (missing.length) return res.status(400).json({ error: `missing fields: ${missing.join(', ')}` });

  try {
    const ticket = await createTicket(req.body);
    res.status(201).json({ ticketId: ticket.name });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.post('/:id/escalate', async (req, res) => {
  const { reason } = req.body;
  if (!reason) return res.status(400).json({ error: 'reason is required' });

  try {
    const ticket = await escalateTicket(req.params.id, reason);
    if (!ticket) return res.status(404).json({ error: 'ticket not found' });
    res.json({ ticketId: ticket.name, priority: ticket.priority });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.post('/:id/feedback', async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'rating must be between 1 and 5' });

  try {
    const ticket = await submitFeedback(req.params.id, { rating, comment });
    if (!ticket) return res.status(404).json({ error: 'ticket not found' });
    res.json({ ticketId: ticket.name });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
