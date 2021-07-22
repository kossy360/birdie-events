import { waitFor } from '@testing-library/react';
import * as visx from '@visx/visx';
import { startMirage } from '../../../test/mirageServer';
import { renderWithApp } from '../../../test/testRenderer';
import { EEventTypes, IEventDailyRate, IGetEventFilters } from '../../../types/event';
import TrendChart from '../TrendChart';

describe('TrendChart component', () => {
  const server = startMirage();
  const parentSizeMock = jest.spyOn(visx, 'ParentSize');

  afterEach(() => {
    server.db.emptyData();
  });

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

  afterAll(() => {
    server.shutdown();
  });

  it('should render trend chart', async () => {
    server.createList('rate', 8);

    const rates = server.db.rates as unknown as IEventDailyRate[];
    const querySpy = jest.fn();

    server.get('/event/daily-rate', (schema, req) => {
      querySpy(req.queryParams);

      return { rates };
    });

    const filters: IGetEventFilters = {
      event_type: EEventTypes.ALERT_QUALIFIED,
      care_recipient_id: 'recipient',
      caregiver_id: 'caregiver',
    };
    const component = renderWithApp(<TrendChart filters={filters} />);

    expect(
      component.getByRole('heading', { name: 'Events Trend Chart' })
    ).toBeInTheDocument();
    expect(
      component.getByRole('figure', { name: 'trend chart' })
    ).toBeInTheDocument();

    const tooltips = await waitFor(() =>
      component.getAllByRole('tooltip', { name: 'trend chart point' })
    );

    expect(tooltips.length).toBe(8);
    expect(querySpy).lastCalledWith(filters);
  });
});
