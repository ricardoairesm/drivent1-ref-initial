import { notFoundError } from '@/errors';
import bookingsRepository from '@/repositories/bookings-repository';

async function getUserBookings(userId: number) {
  const bookings = await bookingsRepository.findUserBookings(userId);
  if (!bookings) throw notFoundError();

  return bookings;
}

// async function getHotelById(id: number) {
//     const hotel = await hotelsRepository.findHotelById(id);
//     if (!hotel) throw notFoundError();

//     return hotel;
// }

const bookingsService = {
  getUserBookings,
  // getHotelById,
};

export default bookingsService;
