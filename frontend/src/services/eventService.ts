import {
  IGetAllEventFilters,
  IGetEventCareGiversResult,
  IGetEventCareRecipientsResult,
  IGetEventFilters,
  IGetEventRateResult,
  IGetEventsResult,
  IGetEventTypesResult,
} from '../types/event';
import { http } from './httpService';

export const getEventTypesService = async (query: IGetEventFilters) => {
  const response = await http.get<IGetEventTypesResult>('event/types', {
    params: query,
  });

  return response.data;
};

export const getCareGiversService = async (query: IGetEventFilters) => {
  const response = await http.get<IGetEventCareGiversResult>(
    'event/caregivers',
    { params: query }
  );

  return response.data;
};

export const getRecipientsService = async (query: IGetEventFilters) => {
  const response = await http.get<IGetEventCareRecipientsResult>(
    'event/care-recipients',
    { params: query }
  );

  return response.data;
};

export const getEventsService = async (query: IGetAllEventFilters) => {
  const response = await http.get<IGetEventsResult>('event', {
    params: query,
  });

  return response.data;
};

export const getEventRateService = async (query: IGetEventFilters) => {
  const response = await http.get<IGetEventRateResult>('event/daily-rate', {
    params: query,
  });

  return response.data;
};
