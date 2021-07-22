import request from 'supertest';
import app from '../../application';
import {
  getEventCareGivers,
  getEventCareRecipients,
  getEventDailyRate,
  getEvents,
  getEventTypes,
} from '../../services/event.service';
import { EEventTypes } from '../../types.ts/event.type';

jest.mock('../../services/event.service');

describe('Event Controller', () => {
  describe('GET /event/types', () => {
    const getEventTypesMock = getEventTypes as jest.MockedFunction<
      typeof getEventTypes
    >;
    const events = [
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

    beforeAll(() => {
      getEventTypesMock.mockReturnValue(Promise.resolve({ events }));
    });

    afterEach(() => {
      getEventTypesMock.mockClear();
    });

    it('returns event types', async () => {
      await request(app)
        .get('/event/types')
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({ events });
        });

      expect(getEventTypesMock).toHaveBeenCalledWith({});
    });

    it('returns event types with query', async () => {
      const query = {
        caregiver_id: '7aed0ca0-311a-48de-ae72-e7e92bf18b2c',
      };

      await request(app)
        .get('/event/types')
        .query(query)
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({ events });
        });

      expect(getEventTypesMock).toHaveBeenCalledWith(query);
    });

    it('400 on validation error', async () => {
      await request(app)
        .get('/event/types')
        .query({ care_recipient_id: 'invalid-uuid' })
        .expect(400)
        .expect(function (res) {
          expect(res.body.error).toBe('Validation error');
        });
    });

    it('500 on app error', async () => {
      getEventTypesMock.mockRejectedValue(new Error());

      await request(app)
        .get('/event/types')
        .expect(500)
        .expect(function (res) {
          expect(res.body.message).toBeDefined();
        });
    });
  });

  describe('GET /event/caregivers', () => {
    const mockService = getEventCareGivers as jest.MockedFunction<
      typeof getEventCareGivers
    >;
    const caregivers = [
      {
        id: 'b5583964-a87f-4f29-91eb-e1996bb54ea4',
        total_events: 648,
      },
      {
        id: '220d9432-b5ed-4c81-8709-434899d2cd1b',
        total_events: 291,
      },
      {
        id: 'd8d66637-c3d6-4c58-a254-3b274a031fec',
        total_events: 279,
      },
      {
        id: 'ac3967a6-1392-4227-9987-a201e0f8f287',
        total_events: 266,
      },
      {
        id: 'ca216495-6806-4ecb-974d-e7ece2e9e5b5',
        total_events: 255,
      },
    ];

    beforeAll(() => {
      mockService.mockReturnValue(Promise.resolve({ caregivers }));
    });

    afterEach(() => {
      mockService.mockClear();
    });

    it('returns caregivers', async () => {
      await request(app)
        .get('/event/caregivers')
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({ caregivers });
        });

      expect(mockService).toHaveBeenCalledWith({});
    });

    it('returns caregivers with query', async () => {
      const query = {
        care_recipient_id: '7aed0ca0-311a-48de-ae72-e7e92bf18b2c',
        event_type: EEventTypes.CHECK_IN,
      };

      await request(app)
        .get('/event/caregivers')
        .query(query)
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({ caregivers });
        });

      expect(mockService).toHaveBeenCalledWith(query);
    });

    it('400 on validation error', async () => {
      await request(app)
        .get('/event/caregivers')
        .query({ event_type: 'invalid_type' })
        .expect(400)
        .expect(function (res) {
          expect(res.body.error).toBe('Validation error');
        });
    });

    it('500 on app error', async () => {
      mockService.mockRejectedValue(new Error());

      await request(app)
        .get('/event/caregivers')
        .expect(500)
        .expect(function (res) {
          expect(res.body.message).toBeDefined();
        });
    });
  });

  describe('GET /event/care-recipients', () => {
    const mockService = getEventCareRecipients as jest.MockedFunction<
      typeof getEventCareRecipients
    >;
    const recipients = [
      {
        id: 'b5583964-a87f-4f29-91eb-e1996bb54ea4',
        total_events: 648,
      },
      {
        id: '220d9432-b5ed-4c81-8709-434899d2cd1b',
        total_events: 291,
      },
      {
        id: 'd8d66637-c3d6-4c58-a254-3b274a031fec',
        total_events: 279,
      },
      {
        id: 'ac3967a6-1392-4227-9987-a201e0f8f287',
        total_events: 266,
      },
      {
        id: 'ca216495-6806-4ecb-974d-e7ece2e9e5b5',
        total_events: 255,
      },
    ];

    beforeAll(() => {
      mockService.mockReturnValue(
        Promise.resolve({ care_recipients: recipients })
      );
    });

    afterEach(() => {
      mockService.mockClear();
    });

    it('returns care recipients', async () => {
      await request(app)
        .get('/event/care-recipients')
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({ care_recipients: recipients });
        });

      expect(mockService).toHaveBeenCalledWith({});
    });

    it('returns care recipients with query', async () => {
      const query = {
        caregiver_id: '7aed0ca0-311a-48de-ae72-e7e92bf18b2c',
        event_type: EEventTypes.CHECK_IN,
      };

      await request(app)
        .get('/event/care-recipients')
        .query(query)
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({ care_recipients: recipients });
        });

      expect(mockService).toHaveBeenCalledWith(query);
    });

    it('400 on validation error', async () => {
      await request(app)
        .get('/event/care-recipients')
        .query({ event_type: 'invalid_type' })
        .expect(400)
        .expect(function (res) {
          expect(res.body.error).toBe('Validation error');
        });
    });

    it('500 on app error', async () => {
      mockService.mockRejectedValue(new Error());

      await request(app)
        .get('/event/care-recipients')
        .expect(500)
        .expect(function (res) {
          expect(res.body.message).toBeDefined();
        });
    });
  });

  describe('GET /event', () => {
    const getEventsMock = getEvents as jest.MockedFunction<typeof getEvents>;
    const paginationQuery = { page: 3, limit: 10 };
    const events = [
      {
        payload: {},
        alert_id: null,
        task_instance_id:
          'bXxmYzhhM2I3Zi02ODhhLTRjYTMtYWVjNS03YTA5NWJhNzU5ODN8MjAxOS0wNS0xMlQyMDowMDowMC4wMDBa',
        visit_id: 'b7c54214-8861-4495-a244-fac62abace70',
        caregiver_id: '56890b44-f575-4d66-840a-b402d19a81e5',
        rejected_event_id: null,
        observation_event_id: null,
        timestamp: new Date('2019-05-12T22:06:34+01:00'),
        id: '7aed0ca0-311a-48de-ae72-e7e92bf18b2c',
        event_type: EEventTypes.REGULAR_MEDICATION_TAKEN,
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
        timestamp: new Date('2019-05-12T22:05:07+01:00'),
        id: '19f90822-d91f-4c5f-a67c-38e5c87f7e27',
        event_type: EEventTypes.FOOD_INTAKE_OBSERVATION,
        care_recipient_id: 'ad3512a6-91b1-4d7d-a005-6f8764dd0111',
      },
    ];

    beforeAll(() => {
      getEventsMock.mockReturnValue(
        Promise.resolve({
          meta: { pageInfo: { ...paginationQuery, total: 100 } },
          events,
        })
      );
    });

    afterEach(() => {
      getEventsMock.mockClear();
    });

    it('returns events', async () => {
      await request(app)
        .get('/event')
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual(
            expect.objectContaining({
              events: JSON.parse(JSON.stringify(events)),
            })
          );
        });

      expect(getEventsMock).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('returns events with query', async () => {
      const query = {
        ...paginationQuery,
        caregiver_id: '7aed0ca0-311a-48de-ae72-e7e92bf18b2c',
        event_type: EEventTypes.CHECK_IN,
      };

      await request(app)
        .get('/event')
        .query(query)
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual(
            expect.objectContaining({
              events: JSON.parse(JSON.stringify(events)),
            })
          );
        });

      expect(getEventsMock).toHaveBeenCalledWith(query);
    });

    it('400 on validation error', async () => {
      await request(app)
        .get('/event')
        .query({ event_type: 'invalid_type' })
        .expect(400)
        .expect(function (res) {
          expect(res.body.error).toBe('Validation error');
        });
    });

    it('500 on app error', async () => {
      getEventsMock.mockRejectedValue(new Error());

      await request(app)
        .get('/event')
        .expect(500)
        .expect(function (res) {
          expect(res.body.message).toBeDefined();
        });
    });
  });

  describe('GET /event/daily-rate', () => {
    const mockService = getEventDailyRate as jest.MockedFunction<
      typeof getEventDailyRate
    >;
    const rates = [
      {
        timestamp: new Date('2019-04-22T23:00:00.000Z'),
        total_events: 350,
      },
      {
        timestamp: new Date('2019-04-23T23:00:00.000Z'),
        total_events: 295,
      },
      {
        timestamp: new Date('2019-04-24T23:00:00.000Z'),
        total_events: 284,
      },
    ];

    beforeAll(() => {
      mockService.mockReturnValue(Promise.resolve({ total: 500, rates }));
    });

    afterEach(() => {
      mockService.mockClear();
    });

    it('returns daily rates', async () => {
      await request(app)
        .get('/event/daily-rate')
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({
            total: 500,
            rates: JSON.parse(JSON.stringify(rates)),
          });
        });

      expect(mockService).toHaveBeenCalledWith({});
    });

    it('returns daily rates with query', async () => {
      const query = {
        care_recipient_id: '7aed0ca0-311a-48de-ae72-e7e92bf18b2c',
        event_type: EEventTypes.CHECK_IN,
      };

      await request(app)
        .get('/event/daily-rate')
        .query(query)
        .expect(200)
        .expect(function (res) {
          expect(res.body).toEqual({
            total: 500,
            rates: JSON.parse(JSON.stringify(rates)),
          });
        });

      expect(mockService).toHaveBeenCalledWith(query);
    });

    it('400 on validation error', async () => {
      await request(app)
        .get('/event/daily-rate')
        .query({ event_type: 'invalid_type' })
        .expect(400)
        .expect(function (res) {
          expect(res.body.error).toBe('Validation error');
        });
    });

    it('500 on app error', async () => {
      mockService.mockRejectedValue(new Error());

      await request(app)
        .get('/event/daily-rate')
        .expect(500)
        .expect(function (res) {
          expect(res.body.message).toBeDefined();
        });
    });
  });
});
