import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findTicketTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function getUserTickets(enrollmentId: number) {
  const tickets = await ticketsRepository.findUserTickets(enrollmentId);
  if (!tickets) throw notFoundError();

  return tickets;
}

async function getTicketTypeById(id: number) {
  const ticketType = await ticketsRepository.findTicketTypeById(id);
  if (!ticketType) throw notFoundError();

  return ticketType;
}

async function updateTicketById(ticketId: number) {
  const updatePayment = await ticketsRepository.updateTicketById(ticketId);

  return updatePayment;
}

async function getTicketById(id: number) {
  const ticket = await ticketsRepository.findTicketById(id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  const ticket = await ticketsRepository.createTicket(ticketTypeId, enrollmentId);
  return ticket;
}

const ticketsService = {
  getTicketTypes,
  getUserTickets,
  getTicketTypeById,
  createTicket,
  getTicketById,
  updateTicketById,
};

export default ticketsService;
