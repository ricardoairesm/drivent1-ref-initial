import { prisma } from '@/config';

async function findPaymentByTicketId(ticketId: string) {
  return prisma.payment.findFirst({
    where: {
      ticketId: Number(ticketId),
    },
  });
}

async function createPayment(ticketId: number, value: number, cardIssuer: string, cardLastDigits: string) {
  return prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: value,
      cardIssuer: cardIssuer,
      cardLastDigits: cardLastDigits,
    },
  });
}

const paymentsRepository = {
  findPaymentByTicketId,
  createPayment,
};

export default paymentsRepository;
