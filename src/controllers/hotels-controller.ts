import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import enrollmentsService from '@/services/enrollments-service';
import ticketsService from '@/services/tickets-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getHotels();
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const { createdAt, enrollmentId, id, status, ticketTypeId, updatedAt } = await ticketsService.getUserTickets(
      enrollment.id,
    );
    if (!enrollment) return res.sendStatus(404);
    if (!id) return res.sendStatus(404);
    if (status != 'PAID') return res.sendStatus(402);
    if (!hotels) return res.sendStatus(404);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

//export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
//const { userId } = req;
//try {
//const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
//const { createdAt, enrollmentId, id, status, ticketTypeId, updatedAt } = await ticketsService.getUserTickets(
// enrollment.id,
//);
//const ticketType = await ticketsService.getTicketTypeById(ticketTypeId);
//return res.status(httpStatus.OK).send({
//createdAt,
//enrollmentId,
//id,
//status,
//ticketTypeId,
//updatedAt,
///TicketType: ticketType,
//});
//} catch (error) {
//return res.sendStatus(404);
//}
//}
