import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBooking, getUserBookings } from '@/controllers/bookings-controller';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getUserBookings).post('/', createBooking);

export { bookingsRouter };