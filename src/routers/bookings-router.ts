import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBooking, getUserBookings } from '@/controllers/booking-controller';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getUserBookings).post('/', createBooking).put('/:bookingId');

export { bookingsRouter };
