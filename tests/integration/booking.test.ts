import faker from '@faker-js/faker';
import { Booking, TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createRemoteTicketType,
  createTicketTypeWithOutHotel,
  createTicketTypeWithHotel,
  createHotel,
  createRoom,
  createBooking,
  createRoomWithOneAvailableSpot,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  describe('when token is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should respond with status 200 and with booking info', async () => {
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const booking = await createBooking(room.id, user.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          capacity: room.capacity,
          createdAt: room.createdAt.toISOString(),
          hotelId: room.hotelId,
          id: room.id,
          name: room.name,
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
    it('should respond with status 404 when user has no bookings', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe('POST /booking', () => {
  describe('when token is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should respond with status 403 when ticketType = RESERVED', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(403);
    });
    it('should respond with status 403 when isRemote = true', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createRemoteTicketType();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(403);
    });
    it('should respond with status 403 when includesHotel = false', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOutHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(403);
    });
    it('should respond with status 404 when roomId is wrong', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOutHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.status).toEqual(404);
    });
    it('should respond with status 403 when the room isnt available', async () => {
      const hotel = await createHotel();
      const room = await createRoomWithOneAvailableSpot(hotel.id);
      const user1 = await createUser();
      const token1 = await generateValidToken(user1);
      const enrollment = await createEnrollmentWithAddress(user1);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const booking = await createBooking(room.id, user1.id);
      const user2 = await createUser();
      const token2 = await generateValidToken(user2);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token2}`).send({ roomId: room.id });

      expect(response.status).toEqual(403);
    });
    it('should respond with status 200 and with booking info', async () => {
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});

describe('PUT /booking', () => {
  describe('when token is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.put('/booking');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });

  describe('when token is valid', () => {
    it('should respond with status 403 when the room isnt available', async () => {
      const hotel = await createHotel();
      const room = await createRoomWithOneAvailableSpot(hotel.id);
      const room2 = await createRoom(hotel.id);
      const user1 = await createUser();
      const token1 = await generateValidToken(user1);
      const enrollment = await createEnrollmentWithAddress(user1);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const booking = await createBooking(room.id, user1.id);
      const user2 = await createUser();
      const token2 = await generateValidToken(user2);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID);
      const booking2 = await createBooking(room2.id, user2.id);

      const response = await server
        .put(`/booking/:${booking2.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ roomId: room.id });

      expect(response.status).toEqual(403);
    });
    it('should respond with status 403 when user doesnt have a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOutHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.put('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toEqual(404);
    });
    it('should respond with status 404 when roomId is wrong', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithOutHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const booking = await createBooking(room.id, user.id);

      const response = await server
        .put('/booking/')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.status).toEqual(404);
    });
    it('should respond with status 200 and with booking info', async () => {
      const hotel = await createHotel();
      const user = await createUser();
      const room1 = await createRoom(hotel.id);
      const booking = await createBooking(room1.id, user.id);
      const room2 = await createRoom(hotel.id);
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const roomId = room2.id;

      const response = await server
        .put(`/booking/:${booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId });

      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});
