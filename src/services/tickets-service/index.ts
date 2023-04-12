import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findTicketTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

const ticketsService = {
  getTicketTypes,
};

export default ticketsService;
