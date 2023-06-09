import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelById } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getAllHotels).get('/:hotelId', getHotelById);

export { hotelsRouter };
