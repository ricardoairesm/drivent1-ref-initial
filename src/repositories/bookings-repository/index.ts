import { Hotel } from '@prisma/client';
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

async function findHotelById(id: number): Promise<Hotel> {
  return prisma.hotel.findFirst({
    where: {
      id: id,
    },
    include: {
      Rooms: true,
    },
  });
}

const bookingsRepository = {
  findUserBookings,
  findHotelById,
};

export default bookingsRepository;
