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

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const bookingsRepository = {
  findUserBookings,
  createBooking,
};

export default bookingsRepository;
