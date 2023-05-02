import { cannotListHotelsError, notFoundError } from '@/errors';
import bookingsRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import roomsRepository from '@/repositories/rooms-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getUserBookings(userId: number) {
  const booking = await bookingsRepository.findUserBookings(userId);
  if (!booking) throw notFoundError();

  return {
    id: booking.id,
    Room: booking.Room,
  };
}

async function createBooking(userId: number, roomId: number) {
  const room = await roomsRepository.findRoomWithId(roomId);
  if (!room) {
    throw notFoundError();
  }
  const ocupiedSpots = await bookingsRepository.findRoomsOcupiedSpots(roomId);
  if (room.capacity === ocupiedSpots) {
    throw cannotListHotelsError();
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotListHotelsError();
  }
  const ticket = await ticketsRepository.findUserTickets(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
  const booking = await bookingsRepository.createBooking(userId, roomId);
  if (!booking) throw cannotListHotelsError();

  return { bookingId: booking.id };
}

async function updateUsersBooking(userId: number, roomId: number) {
  const room = await roomsRepository.findRoomWithId(roomId);
  if (!room) {
    throw notFoundError();
  }
  const booking = await bookingsRepository.findUserBookings(userId);
  if (!booking) {
    throw cannotListHotelsError();
  }
  const ocupiedSpots = await bookingsRepository.findRoomsOcupiedSpots(roomId);
  if (room.capacity === ocupiedSpots) {
    throw cannotListHotelsError();
  }
  const newBooking = await bookingsRepository.updateBooking(booking.id, roomId);

  return { bookingId: booking.id };
}

const bookingsService = {
  getUserBookings,
  createBooking,
  updateUsersBooking,
};

export default bookingsService;
