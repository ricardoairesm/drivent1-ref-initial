import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import enrollmentsService from '@/services/enrollments-service';

export async function getAllTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const { createdAt, enrollmentId, id, status, ticketTypeId, updatedAt } = await ticketsService.getUserTickets(
      enrollment.id,
    );
    const ticketType = await ticketsService.getTicketTypeById(ticketTypeId);
    return res.status(httpStatus.OK).send({
      createdAt,
      enrollmentId,
      id,
      status,
      ticketTypeId,
      updatedAt,
      TicketType: ticketType,
    });
  } catch (error) {
    return res.sendStatus(404);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const incomingTicketTypeId = req.body.ticketTypeId;
  if (!incomingTicketTypeId) {
    return res.sendStatus(400);
  }
  try {
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    const ticketType = await ticketsService.getTicketTypeById(incomingTicketTypeId);
    const { createdAt, enrollmentId, id, status, ticketTypeId, updatedAt } = await ticketsService.createTicket(
      incomingTicketTypeId,
      enrollment.id,
    );
    return res.status(201).send({
      createdAt,
      enrollmentId,
      id,
      status,
      ticketTypeId,
      updatedAt,
      TicketType: ticketType,
    });
  } catch (error) {
    return res.sendStatus(404);
  }
}
