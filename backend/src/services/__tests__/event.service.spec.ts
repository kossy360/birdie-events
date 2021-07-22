import mockDb from 'mock-knex';
import { db } from '../../models';
import { EEventTypes } from '../../types.ts/event.type';
import {
  getEventCareGivers,
  getEventCareRecipients,
  getEventDailyRate,
  getEvents,
  getEventTypes,
} from '../event.service';

describe('Event service test', () => {
  const tracker = mockDb.getTracker();

  beforeAll(() => {
    mockDb.mock(db);
    tracker.install();
  });

  afterEach(() => {
    tracker.removeAllListeners();
  });

  describe('Get event types', () => {
    const testEventDb = [
      {
        name: EEventTypes.ALERT_QUALIFIED,
        total_events: 45,
      },
      {
        name: EEventTypes.ALERT_RAISED,
        total_events: 20,
      },
      {
        name: EEventTypes.CHECK_IN,
        total_events: 30,
      },
      {
        name: EEventTypes.CHECK_OUT,
        total_events: 5,
      },
    ];

    it('should get all event types', async () => {
      tracker.once('query', (query) => {
        expect(query.method).toEqual('select');
        expect(query.bindings).toEqual([]);

        query.response(testEventDb);
      });

      const result = await getEventTypes({});

      expect(result).toEqual({ events: testEventDb });
    });

    it('should get all event types and apply filters', async () => {
      tracker.once('query', (query) => {
        expect(query.method).toEqual('select');
        expect(query.bindings).toContain('recipient-uuid');
        expect(query.bindings).toContain('caregiver-uuid');

        query.response(testEventDb);
      });

      const result = await getEventTypes({
        care_recipient_id: 'recipient-uuid',
        caregiver_id: 'caregiver-uuid',
      });

      expect(result).toEqual({ events: testEventDb });
    });
  });

  describe('Get caregivers', () => {
    const testEventDb = [
      {
        id: 'caregiver-1',
        total_events: 45,
      },
      {
        id: 'caregiver-2',
        total_events: 20,
      },
      {
        id: 'caregiver-3',
        total_events: 30,
      },
      {
        id: 'caregiver-4',
        total_events: 5,
      },
    ];

    it('should get all caregivers', async () => {
      tracker.once('query', (query) => {
        expect(query.method).toEqual('select');
        expect(query.bindings).toEqual([]);

        query.response(testEventDb);
      });

      const result = await getEventCareGivers({});

      expect(result).toEqual({ caregivers: testEventDb });
    });

    it('should get all caregivers and apply filters', async () => {
      tracker.once('query', (query) => {
        expect(query.method).toEqual('select');
        expect(query.bindings).toContain('recipient-uuid');
        expect(query.bindings).toContain(EEventTypes.ALERT_QUALIFIED);

        query.response(testEventDb);
      });

      const result = await getEventCareGivers({
        event_type: EEventTypes.ALERT_QUALIFIED,
        care_recipient_id: 'recipient-uuid',
      });

      expect(result).toEqual({ caregivers: testEventDb });
    });
  });

  describe('Get recipients', () => {
    const testEventDb = [
      {
        id: 'recipient-1',
        total_events: 45,
      },
      {
        id: 'recipient-2',
        total_events: 20,
      },
      {
        id: 'recipient-3',
        total_events: 30,
      },
      {
        id: 'recipient-4',
        total_events: 5,
      },
    ];

    it('should get all recipient', async () => {
      tracker.once('query', (query) => {
        expect(query.method).toEqual('select');
        expect(query.bindings).toEqual([]);

        query.response(testEventDb);
      });

      const result = await getEventCareRecipients({});

      expect(result).toEqual({ care_recipients: testEventDb });
    });

    it('should get all recipient and apply filters', async () => {
      tracker.once('query', (query) => {
        expect(query.method).toEqual('select');
        expect(query.bindings.length).toBe(2);
        expect(query.bindings).toContain(EEventTypes.CHECK_IN);
        expect(query.bindings).toContain('caregiver-uuid');

        query.response(testEventDb);
      });

      const result = await getEventCareRecipients({
        event_type: EEventTypes.CHECK_IN,
        caregiver_id: 'caregiver-uuid',
      });

      expect(result).toEqual({ care_recipients: testEventDb });
    });
  });

  describe('Get events', () => {
    const testEventDb = [
      {
        payload: {},
        alert_id: null,
        task_instance_id:
          'bXxmYzhhM2I3Zi02ODhhLTRjYTMtYWVjNS03YTA5NWJhNzU5ODN8MjAxOS0wNS0xMlQyMDowMDowMC4wMDBa',
        visit_id: 'b7c54214-8861-4495-a244-fac62abace70',
        caregiver_id: '56890b44-f575-4d66-840a-b402d19a81e5',
        rejected_event_id: null,
        observation_event_id: null,
        timestamp: '2019-05-12T22:06:34+01:00',
        id: '7aed0ca0-311a-48de-ae72-e7e92bf18b2c',
        event_type: 'regular_medication_taken',
        care_recipient_id: 'ad3512a6-91b1-4d7d-a005-6f8764dd0111',
      },
      {
        payload: {},
        alert_id: null,
        task_instance_id: null,
        visit_id: 'b7c54214-8861-4495-a244-fac62abace70',
        caregiver_id: '56890b44-f575-4d66-840a-b402d19a81e5',
        rejected_event_id: null,
        observation_event_id: null,
        timestamp: '2019-05-12T22:05:07+01:00',
        id: '19f90822-d91f-4c5f-a67c-38e5c87f7e27',
        event_type: 'food_intake_observation',
        care_recipient_id: 'ad3512a6-91b1-4d7d-a005-6f8764dd0111',
      },
    ];

    it('should get all events', async () => {
      tracker.on('query', (query) => {
        if (query.sql.includes('count(*)')) {
          query.response([{ total: testEventDb.length }]);
        } else {
          expect(query.bindings.length).toBe(2);
          expect(query.bindings).toContain(10);
          expect(query.bindings).toContain(5);

          query.response(testEventDb);
        }
      });

      const result = await getEvents({ page: 3, limit: 5 });

      expect(result.events).toEqual(testEventDb);
      expect(result.meta.pageInfo).toEqual({
        page: 3,
        limit: 5,
        total: testEventDb.length,
      });
    });

    it('should get all events and apply filters', async () => {
      tracker.on('query', (query) => {
        expect(query.method).toBe('select');

        if (query.sql.includes('count(*)')) {
          query.response([{ total: testEventDb.length }]);
        } else {
          expect(query.bindings.length).toBe(5);
          expect(query.bindings).toEqual(
            expect.arrayContaining([
              'caregiver-uuid',
              'recipient-uuid',
              EEventTypes.CHECK_IN,
              10,
              5,
            ])
          );

          query.response(testEventDb);
        }
      });

      const result = await getEvents({
        event_type: EEventTypes.CHECK_IN,
        caregiver_id: 'caregiver-uuid',
        care_recipient_id: 'recipient-uuid',
        page: 3,
        limit: 5,
      });

      expect(result.events).toEqual(testEventDb);
      expect(result.meta.pageInfo).toEqual({
        page: 3,
        limit: 5,
        total: testEventDb.length,
      });
    });
  });

  describe('Get event rate', () => {
    const testEventDb = [
      {
        timestamp: '2019-04-24T23:00:00.000Z',
        total_events: 1,
      },
      {
        timestamp: '2019-04-29T23:00:00.000Z',
        total_events: 1,
      },
    ];

    it('should get all events', async () => {
      tracker.on('query', (query) => {
        expect(query.method).toBe('select');
        expect(query.bindings.length).toBe(4);
        expect(query.bindings).toEqual(
          expect.arrayContaining([
            'caregiver-uuid',
            'recipient-uuid',
            EEventTypes.CHECK_IN,
          ])
        );

        query.response(testEventDb);
      });

      const result = await getEventDailyRate({
        event_type: EEventTypes.CHECK_IN,
        caregiver_id: 'caregiver-uuid',
        care_recipient_id: 'recipient-uuid',
      });

      expect(result.total).toBe(2);
      expect(result.rates).toEqual(
        expect.arrayContaining(
          testEventDb.map((r) => ({ ...r, timestamp: new Date(r.timestamp) }))
        )
      );

      // since the difference between the dates returned by the db is 4
      // entries for missing days will be generated
      expect(result.rates.length).toEqual(6);
    });
  });
});
