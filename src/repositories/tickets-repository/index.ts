import { prisma } from '@/config';

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findUserTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
  });
}
async function findTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: {
      id: id,
    },
  });
}
async function findTicketTypeById(id: number) {
  return prisma.ticketType.findFirst({
    where: {
      id: id,
    },
  });
}

async function updateTicketById(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: 'RESERVED',
    },
  });
}

const ticketsRepository = {
  findTicketTypes,
  findUserTickets,
  findTicketTypeById,
  createTicket,
  findTicketById,
  updateTicketById,
};

export default ticketsRepository;
