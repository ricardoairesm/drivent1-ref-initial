import Joi from 'joi';
import { Payment } from '@/protocols';

export const createPaymentSchema = Joi.object<Payment>({
  ticketId: Joi.number().required(),
  cardData: {
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required(),
  },
});
