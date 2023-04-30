import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import enrollmentsService from '@/services/enrollments-service';
import ticketsService from '@/services/tickets-service';
import bookingsService from '@/services/bookings-service';

export async function getUserBookings(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getUserBookings(Number(userId));
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = req.params.hotelId as string;
  try {
    const hotels = await hotelsService.getHotelById(Number(hotelId));
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticket = await ticketsService.getUserTickets(enrollment.id);
    const ticketType = await ticketsService.getTicketTypeById(ticket.ticketTypeId);
    if (ticket.status != 'PAID' || ticketType.isRemote === true || ticketType.includesHotel === false)
      return res.sendStatus(402);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(404);
  }
}
