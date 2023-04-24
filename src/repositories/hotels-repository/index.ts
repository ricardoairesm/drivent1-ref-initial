import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findHotelById(id: number) {
  return prisma.hotel.findFirst({
    where: {
      id: id,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelsRepository = {
  findHotels,
  findHotelById,
};

export default hotelsRepository;
