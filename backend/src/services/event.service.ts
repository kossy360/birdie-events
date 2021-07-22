import { addDays, differenceInDays, startOfDay } from 'date-fns';
import { db } from '../models';
import {
  IEventRate as IDailyEventTotal,
  IGetEventCareGiversResult,
  IGetEventCareRecipientsResult,
  IGetEventRateResult,
  IGetEventsQuery,
  IGetEventsResult,
  IGetEventTypesResult,
} from '../types.ts/event.type';

const eventModel = () => db('events');

export const getEventTypes = async (
  query: IGetEventsQuery
): Promise<IGetEventTypesResult> => {
  const builder = eventModel()
    .select({ name: 'event_type' }, 'payload')
    .count('event_type', { as: 'total_events' })
    .groupBy('event_type')
    .orderBy('total_events', 'desc');

  if (query.care_recipient_id) {
    builder.where({ care_recipient_id: query.care_recipient_id });
  }
  if (query.caregiver_id || query.caregiver_id === null) {
    builder.where({ caregiver_id: query.caregiver_id });
  }

  const events = await builder;

  return { events } as IGetEventTypesResult;
};

export const getEventCareGivers = async (
  query: IGetEventsQuery
): Promise<IGetEventCareGiversResult> => {
  const builder = eventModel()
    .select({ id: 'caregiver_id' })
    .count('event_type', { as: 'total_events' })
    .groupBy('caregiver_id')
    .orderBy('total_events', 'desc');

  if (query.event_type) {
    builder.where({ event_type: query.event_type });
  }
  if (query.care_recipient_id) {
    builder.where({ care_recipient_id: query.care_recipient_id });
  }

  const events = await builder;

  return { caregivers: events } as IGetEventCareGiversResult;
};

export const getEventCareRecipients = async (
  query: IGetEventsQuery
): Promise<IGetEventCareRecipientsResult> => {
  const builder = eventModel()
    .select({ id: 'care_recipient_id' })
    .count('event_type', { as: 'total_events' })
    .groupBy('care_recipient_id')
    .orderBy('total_events', 'desc');

  if (query.event_type) {
    builder.where({ event_type: query.event_type });
  }
  if (query.caregiver_id || query.caregiver_id === null) {
    builder.where({ caregiver_id: query.caregiver_id });
  }

  const events = await builder;

  return { care_recipients: events } as IGetEventCareRecipientsResult;
};

export const getEvents = async (
  query: IGetEventsQuery
): Promise<IGetEventsResult> => {
  const { page = 1, limit = 10 } = query;
  const builder = eventModel().orderBy('timestamp', 'desc');

  if (query.caregiver_id || query.caregiver_id === null) {
    builder.where({ caregiver_id: query.caregiver_id });
  }
  if (query.care_recipient_id) {
    builder.where({ care_recipient_id: query.care_recipient_id });
  }
  if (query.event_type) {
    builder.where({ event_type: query.event_type });
  }

  const [{ total = 0 }] = await builder.clone().count({ total: '*' });
  const events = await builder.offset((page - 1) * limit).limit(limit);

  return { meta: { pageInfo: { page, limit, total: Number(total) } }, events };
};

export const ensureDailyRates = (rates: IDailyEventTotal[]) => {
  if (rates.length <= 1) return rates;
  // return rates.concat(rates).map((r) => ({ ...r }));

  // array to store transformed rates and fillers
  const paddedRates: IGetEventRateResult['rates'] = [];

  rates.forEach((rate, index) => {
    // date of current rate
    const currDate = startOfDay(new Date(rate.timestamp));
    // date of previous rate. if index is 0, use currDate temporarily
    const prevDate =
      index === 0
        ? currDate
        : startOfDay(new Date(rates[index - 1]?.timestamp));
    const diffInDays = differenceInDays(currDate, prevDate);

    // if difference is greater than 0
    if (diffInDays > 0) {
      // for each day, create and push a new filler rate
      for (let i = 1; i < diffInDays; i += 1) {
        paddedRates.push({
          total_events: 0,
          timestamp: addDays(prevDate, i),
        });
      }
    }

    // push the current rate
    paddedRates.push({ ...rate, timestamp: currDate });
  });

  return paddedRates;
};

export const getEventDailyRate = async (
  query: IGetEventsQuery
): Promise<IGetEventRateResult> => {
  const builder = eventModel().orderBy('timestamp', 'asc');

  if (query.caregiver_id || query.caregiver_id === null) {
    builder.where({ caregiver_id: query.caregiver_id });
  }
  if (query.care_recipient_id) {
    builder.where({ care_recipient_id: query.care_recipient_id });
  }
  if (query.event_type) {
    builder.where({ event_type: query.event_type });
  }

  const rates = await builder
    .select('timestamp')
    .count('event_type', { as: 'total_events' })
    .groupByRaw('DATEDIFF(?, ??)', [new Date('2019'), 'timestamp'])
    .orderBy('timestamp', 'asc');

  return {
    total: rates.reduce((acc, curr) => acc + (curr.total_events as number), 0),
    rates: ensureDailyRates(rates as IDailyEventTotal[]),
  };
};
