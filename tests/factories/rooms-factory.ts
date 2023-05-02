import faker from '@faker-js/faker';
import { Room } from '@prisma/client';
import { prisma } from '@/config';

export function createRoom(hotelId: number): Promise<Room> {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId,
    },
  });
}

export function createRoomWithOneAvailableSpot(hotelId: number): Promise<Room> {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 1,
      hotelId,
    },
  });
}
