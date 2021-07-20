import Joi from 'joi';

export const getEventsQueryValidationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  event_type: Joi.string(),
  care_recipient_id: Joi.string(),
  caregiver_id: Joi.string(),
});
