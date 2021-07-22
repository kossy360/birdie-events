import { fireEvent, waitForElementToBeRemoved, within } from '@testing-library/react';
import { startMirage } from '../../../test/mirageServer';
import { renderWithApp } from '../../../test/testRenderer';
import { EEventTypes, IEvent, IGetEventFilters, IGetEventsResult } from '../../../types/event';
import EventTable from '../EventTable';

describe('EventTable component', () => {
  const server = startMirage();

  afterEach(() => {
    server.db.emptyData();
  });

  afterAll(() => {
    server.shutdown();
  });

  it('should render event data', async () => {
    server.createList('event', 15);

    const events = server.db.events as unknown as IEvent[];
    const querySpy = jest.fn();

    server.get('/event', (schema, req): IGetEventsResult => {
      querySpy(req.queryParams);

      const page = parseInt(req.queryParams.page);
      const limit = parseInt(req.queryParams.limit);

      return {
        meta: {
          pageInfo: {
            page: parseInt(req.queryParams.page),
            limit: parseInt(req.queryParams.page),
            total: events.length,
          },
        },
        events: events.slice((page - 1) * limit, page * limit),
      };
    });

    const filters: IGetEventFilters = {
      event_type: EEventTypes.ALERT_QUALIFIED,
      care_recipient_id: 'recipient',
      caregiver_id: 'caregiver',
    };
    const component = renderWithApp(<EventTable filters={filters} />);
    const loader = component.getByText('Fetching events...');

    expect(
      component.getByRole('heading', { name: 'Events Table' })
    ).toBeInTheDocument();
    expect(component.getByText('Fetching events...')).toBeInTheDocument();
    expect(component.getAllByRole('columnheader').length).toBe(5);

    await waitForElementToBeRemoved(loader);

    let rows = component.getAllByRole('row', { name: /event row/i });

    expect(rows.length).toBe(10);
    expect(within(rows[0]).getByText(events[0].id)).toBeInTheDocument();

    const nextBtn = component.getByRole('button', { name: 'next' });

    fireEvent.click(nextBtn);

    await waitForElementToBeRemoved(rows[9]);

    rows = component.getAllByRole('row', { name: /event row/i });

    expect(rows.length).toBe(5);
    expect(querySpy).lastCalledWith({ ...filters, page: '2', limit: '10' });
  });

  it('should render no data text', async () => {
    const querySpy = jest.fn();

    server.get('/event', (schema, req): IGetEventsResult => {
      querySpy(req.queryParams);

      return {
        meta: {
          pageInfo: {
            page: parseInt(req.queryParams.page),
            limit: parseInt(req.queryParams.page),
            total: 0,
          },
        },
        events: [],
      };
    });

    const component = renderWithApp(<EventTable filters={{}} />);
    const loader = component.getByText('Fetching events...');

    expect(component.getByText('Fetching events...')).toBeInTheDocument();

    await waitForElementToBeRemoved(loader);

    expect(component.getByText('No events')).toBeInTheDocument();

    let rows = component.queryAllByRole('row', { name: /event row/i });

    expect(rows.length).toBe(0);
  });
});
