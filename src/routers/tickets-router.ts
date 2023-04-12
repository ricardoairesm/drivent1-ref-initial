import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTicketTypes } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getAllTicketTypes).all('/*', authenticateToken);

export { ticketsRouter };
