import Joi from 'joi';
import { EEventTypes } from '../types.ts/event.type';

const eventTypeSchema = Joi.string()
  .valid(...Object.values(EEventTypes))
  .messages({
    'any.only': 'Invalid event_type',
  });
const uuidSchema = Joi.string().uuid();
const caregiverIdSchema = Joi.alternatives(
  uuidSchema,
  Joi.string().valid('none').empty('none').default(null)
);

export const getEventTypesQueryValidationSchema = Joi.object({
  care_recipient_id: uuidSchema,
  caregiver_id: caregiverIdSchema,
});

export const getCaregiversValidationSchema = Joi.object({
  event_type: eventTypeSchema,
  care_recipient_id: uuidSchema,
});

export const getCareRecipientsValidationSchema = Joi.object({
  event_type: eventTypeSchema,
  caregiver_id: caregiverIdSchema,
});

export const getEventsQueryValidationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  event_type: eventTypeSchema,
  care_recipient_id: uuidSchema,
  caregiver_id: caregiverIdSchema,
});

export const getDailyRatesValidationSchema = Joi.object({
  event_type: eventTypeSchema,
  care_recipient_id: uuidSchema,
  caregiver_id: caregiverIdSchema,
});
