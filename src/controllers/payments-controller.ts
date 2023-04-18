import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import ticketsService from '@/services/tickets-service';
import enrollmentsService from '@/services/enrollments-service';

export async function getUserPayments(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query as Record<string, string>;
  const { userId } = req;
  if (!ticketId) res.sendStatus(400);
  try {
    const ticket = await ticketsService.getTicketById(Number(ticketId));
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    if (ticket.enrollmentId != enrollment.id) return res.sendStatus(401);
    const payment = await paymentsService.getPaymentByTicketId(ticketId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    return res.sendStatus(404);
  }
}

export async function validatePayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body;
  const { userId } = req;
  let lastNumbers = '' + cardData.number;
  lastNumbers = lastNumbers.slice(-4);

  try {
    const ticket = await ticketsService.getTicketById(Number(ticketId));
    const ticketType = await ticketsService.getTicketTypeById(ticket.ticketTypeId);
    const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
    if (ticket.enrollmentId != enrollment.id) return res.sendStatus(401);
    await ticketsService.updateTicketById(ticketId);

    const createPayment = await paymentsService.createPayment(ticketId, ticketType.price, cardData.issuer, lastNumbers);
    return res.status(httpStatus.OK).send(createPayment);
  } catch (error) {
    return res.sendStatus(404);
  }
}
