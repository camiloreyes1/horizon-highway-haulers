import { Router, Request, Response } from 'express';
import { sendQuoteEmail } from '../email';
import { QuoteRequest } from '../types';

const router = Router();

const REQUIRED_FIELDS: (keyof QuoteRequest)[] = [
  'firstName', 'lastName', 'email', 'phone',
  'vehicleMake', 'vehicleModel', 'vehicleYear',
  'pickupLocation', 'dropOffLocation', 'shipDate', 'trailerType',
];

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as QuoteRequest;

  const missing = REQUIRED_FIELDS.filter((f) => body[f] === undefined || body[f] === '');
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  try {
    await sendQuoteEmail(body);
    return res.status(200).json({ message: 'Quote request sent successfully.' });
  } catch (err) {
    console.error('Failed to send quote email:', err);
    return res.status(500).json({ error: 'Failed to send quote request. Please try again.' });
  }
});

export default router;
