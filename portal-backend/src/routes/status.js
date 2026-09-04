import { Router } from 'express';
import { getTicketStatus } from '../services/frappe.js';

const router = Router();

router.post('/lookup', async (req, res) => {
  const { ticketId, mobile, invoiceNo } = req.body;
  if (!ticketId && !(mobile && invoiceNo)) {
    return res.status(400).json({ error: 'ticketId, or mobile + invoiceNo, is required' });
  }

  try {
    const ticket = await getTicketStatus({ ticketId, mobile, invoiceNo });
    if (!ticket) return res.status(404).json({ error: 'ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
