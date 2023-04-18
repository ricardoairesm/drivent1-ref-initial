import Joi from 'joi';
import { Payment } from '@/protocols';

export const createPaymentSchema = Joi.object<Payment>({
  ticketId: Joi.number().required(),
  cardData: {
    issuer: Joi.string().required(),
    number: Joi.string().required(),
    name: Joi.string().required(),
    expirationDate: Joi.string().required(),
    cvv: Joi.string().required(),
  },
});
