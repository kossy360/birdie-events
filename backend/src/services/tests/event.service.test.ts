import { db } from '../../models';
import mockDb from 'mock-knex';
import {
  getEventCareGivers,
  getEventCareRecipients,
  getEventTypes,
} from '../event.service';
import { EEventTypes } from '../../types.ts/event.type';

describe('Event service test', () => {
  const tracker = mockDb.getTracker();

  beforeAll(() => {
    mockDb.mock(db);
    tracker.install();
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
});
