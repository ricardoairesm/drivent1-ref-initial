import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getUserBookings } from '@/controllers/bookings-controller';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getUserBookings);

export { bookingsRouter };
