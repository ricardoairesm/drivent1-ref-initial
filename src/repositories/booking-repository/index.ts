import { Booking, Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function findUserBookings(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Room: true,
    },
  });
}

async function findRoomsOcupiedSpots(roomId: number) {
  return prisma.booking.count({
    where: {
      roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

const bookingsRepository = {
  findUserBookings,
  createBooking,
  findRoomsOcupiedSpots,
  updateBooking,
};

export default bookingsRepository;
