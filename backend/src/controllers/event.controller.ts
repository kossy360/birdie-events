import express from 'express';
import { validate } from '../middleware/validation.middleware';
import {
  getEventCareGivers,
  getEventCareRecipients,
  getEventDailyRate,
  getEvents,
  getEventTypes,
} from '../services/event.service';
import {
  getCaregiversValidationSchema,
  getCareRecipientsValidationSchema,
  getDailyRatesValidationSchema,
  getEventsQueryValidationSchema,
  getEventTypesQueryValidationSchema,
} from '../validation-schema/event.validation-schema';

export const eventController = express.Router();

eventController.get(
  '/types',
  validate('query', getEventTypesQueryValidationSchema),
  async (req, res, next) => {
    try {
      const events = await getEventTypes(req.query);

      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
);

eventController.get(
  '/caregivers',
  validate('query', getCaregiversValidationSchema),
  async (req, res, next) => {
    try {
      const events = await getEventCareGivers(req.query);

      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
);

eventController.get(
  '/care-recipients',
  validate('query', getCareRecipientsValidationSchema),
  async (req, res, next) => {
    try {
      const events = await getEventCareRecipients(req.query);

      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
);

eventController.get(
  '/',
  validate('query', getEventsQueryValidationSchema),
  async (req, res, next) => {
    try {
      const events = await getEvents(req.query);

      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
);

eventController.get(
  '/daily-rate',
  validate('query', getDailyRatesValidationSchema),
  async (req, res, next) => {
    try {
      const events = await getEventDailyRate(req.query);

      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  }
);
