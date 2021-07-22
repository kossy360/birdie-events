import { addDays, startOfMonth } from 'date-fns';
import { random, times } from 'lodash';
import { createServer, Factory, Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';
import { v4 as uuidV4 } from 'uuid';
import {
  EEventTypes,
  IEvent,
  IEventDailyRate,
  IEventType,
  IEventUser,
  IGetEventCareGiversResult,
  IGetEventCareRecipientsResult,
  IGetEventRateResult,
  IGetEventTypesResult,
} from '../types/event';

const recipientIds = times(3, () => uuidV4());
const caregiverIds = times(10, () => uuidV4());
const eventNames = Object.values(EEventTypes);

type Methodize<T> = {
  [K in keyof T]: ((n: number) => T[K]) | T[K];
};

export const startMirage = () => {
  return createServer({
    environment: 'test',
    models: {
      event: Model,
      rate: Model as ModelDefinition<IGetEventRateResult['rates']>,
      eventType: Model as ModelDefinition<IGetEventTypesResult['events']>,
      caregiver: Model as ModelDefinition<
        IGetEventCareGiversResult['caregivers']
      >,
      recipient: Model as ModelDefinition<
        IGetEventCareRecipientsResult['care_recipients']
      >,
    },
    factories: {
      event: Factory.extend<Methodize<IEvent>>({
        id() {
          return uuidV4();
        },
        event_type() {
          return eventNames[random(0, eventNames.length - 1, false)];
        },
        care_recipient_id() {
          return recipientIds[random(0, recipientIds.length - 1, false)];
        },
        caregiver_id() {
          return caregiverIds[random(0, caregiverIds.length - 1, false)];
        },
        timestamp() {
          return new Date().toISOString();
        },
      }),
      eventType: Factory.extend<Methodize<IEventType>>({
        name(i) {
          return eventNames[i % eventNames.length];
        },
        total_events() {
          return random(1, 20, false);
        },
      }),
      recipient: Factory.extend<Methodize<IEventUser>>({
        id() {
          return uuidV4();
        },
        total_events() {
          return random(1, 20, false);
        },
      }),
      caregiver: Factory.extend<Methodize<IEventUser>>({
        id() {
          return uuidV4();
        },
        total_events() {
          return random(1, 20, false);
        },
      }),
      rate: Factory.extend<Methodize<IEventDailyRate>>({
        timestamp(i) {
          return addDays(startOfMonth(new Date()), i + 1).toISOString();
        },
        total_events() {
          return random(0, 20, false);
        },
      }),
    },
    routes() {
      this.urlPrefix = 'http://localhost:8000';
    },
  });
};
