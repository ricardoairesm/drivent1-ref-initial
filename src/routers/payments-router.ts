import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getUserPayments, validatePayment } from '@/controllers/payments-controller';
import { createPaymentSchema } from '@/schemas/payment-schema';

const paymentsRouter = Router();

paymentsRouter
  .get('/', authenticateToken, getUserPayments)
  .all('/*', authenticateToken)
  .post('/process', validatePayment);

export { paymentsRouter };
