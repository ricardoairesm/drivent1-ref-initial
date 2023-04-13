import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createTicket, getAllTicketTypes, getUserTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter
  .get('/types', getAllTicketTypes)
  .all('/*', authenticateToken)
  .get('/', getUserTickets)
  .post('/', createTicket);

export { ticketsRouter };
