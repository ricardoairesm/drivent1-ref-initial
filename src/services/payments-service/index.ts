import { Payment } from '@prisma/client';
import { notFoundError } from '@/errors';
import paymentsRepository from '@/repositories/payments-repository';

async function getPaymentByTicketId(ticketId: string): Promise<Payment> {
  const payment = await paymentsRepository.findPaymentByTicketId(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function createPayment(
  ticketId: number,
  value: number,
  cardIssuer: string,
  cardLastDigits: string,
): Promise<Payment> {
  const payment = await paymentsRepository.createPayment(ticketId, value, cardIssuer, cardLastDigits);
  return payment;
}

const paymentsService = {
  getPaymentByTicketId,
  createPayment,
};

export default paymentsService;
