import { cannotListHotelsError, notFoundError } from '@/errors';
import bookingsRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomsRepository from '@/repositories/rooms-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getUserBookings(userId: number) {
  const bookings = await bookingsRepository.findUserBookings(userId);
  if (!bookings) throw notFoundError();

  return bookings;
}

async function createBooking(userId: number, roomId: number) {
  const room = await roomsRepository.findRoomWithId(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.capacity === 0) throw notFoundError();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findUserTickets(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
  const booking = await bookingsRepository.createBooking(userId, roomId);
  if (!booking) throw notFoundError();

  return { bookingId: booking.id };
}

const bookingsService = {
  getUserBookings,
  createBooking,
};

export default bookingsService;
