import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();
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
