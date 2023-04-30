import { Booking, Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function findRoomWithId(id: number) {
  return prisma.room.findFirst({
    where: {
      id,
    },
  });
}

const roomsRepository = {
  findRoomWithId,
};

export default roomsRepository;
