import { getByText, waitForElementToBeRemoved, within } from '@testing-library/react';
import * as visx from '@visx/visx';
import Home from '../';
import { startMirage } from '../../../test/mirageServer';
import { renderWithApp } from '../../../test/testRenderer';
import { IEvent, IGetEventsResult } from '../../../types/event';

describe('EventTable component', () => {
  const server = startMirage();
  const parentSizeMock = jest.spyOn(visx, 'ParentSize');

  beforeEach(() => {
    parentSizeMock.mockImplementation((props) => {
      return (
        <div>
          {props.children({
            top: 0,
            left: 0,
            width: 1000,
            height: 400,
            ref: null,
            resize: () => {},
          })}
        </div>
      );
    });
  });

  afterEach(() => {
    server.db.emptyData();
  });

  afterAll(() => {
    server.shutdown();
  });

  it('should render event data', async () => {
    server.createList('event', 6);
    server.createList('eventType', 5);
    server.createList('caregiver', 5);
    server.createList('recipient', 5);
    server.createList('rate', 10);

    const events = server.db.events as unknown as IEvent[];
    const querySpy = jest.fn();

    server.get('/event', (schema, req): IGetEventsResult => {
      querySpy(req.queryParams);

      return {
        meta: {
          pageInfo: {
            page: parseInt(req.queryParams.page),
            limit: parseInt(req.queryParams.page),
            total: events.length,
          },
        },
        events,
      };
    });
    server.get('/event/types', (schema) => {
      return { events: schema.db.eventTypes };
    });
    server.get('/event/care-recipients', (schema) => {
      return { care_recipients: schema.db.recipients };
    });
    server.get('/event/caregivers', (schema) => {
      return { caregivers: schema.db.caregivers };
    });
    server.get('/event/daily-rate', (schema) => {
      return { rates: schema.db.rates };
    });

    const component = renderWithApp(<Home />);
    const loader = component.getByText('Fetching events...');

    expect(
      component.getByRole('heading', { name: 'Birdie Events Dashboard' })
    ).toBeInTheDocument();
    expect(
      component.getByRole('heading', { name: 'Events Table' })
    ).toBeInTheDocument();
    expect(
      component.getByRole('heading', { name: 'Events Trend Chart' })
    ).toBeInTheDocument();
    expect(component.getByText('Fetching events...')).toBeInTheDocument();
    expect(component.getAllByRole('columnheader').length).toBe(5);

    const selectGroup = within(
      component.getByRole('group', { name: 'event filters' })
    );
    const filters = selectGroup.getAllByRole('combobox');

    expect(filters.length).toEqual(3);
    ['Event Type', 'Recipient', 'Caregiver'].forEach((label) => {
      expect(selectGroup.getByText(label)).toBeInTheDocument();
    });

    await waitForElementToBeRemoved(loader);

    const table = within(component.getByRole('table'));

    expect(table.getAllByRole('row', { name: /event row/i }).length).toBe(6);
    expect(
      component.getByRole('figure', { name: 'trend chart' })
    ).toBeInTheDocument();
    expect(
      component.getAllByRole('tooltip', { name: 'trend chart point' }).length
    ).toBe(10);
    expect(
      component.getByText(/built by kossy for birdie/i)
    ).toBeInTheDocument();
  });
});
