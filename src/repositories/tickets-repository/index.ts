import { prisma } from '@/config';

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findUserTickets() {
  return prisma.ticket.findMany({
    where: {},
  });
  return;
}

const ticketsRepository = {
  findTicketTypes,
  findUserTickets,
};

export default ticketsRepository;
