import { fireEvent, waitFor } from '@testing-library/react';
import { sumBy } from 'lodash';
import { startMirage } from '../../test/mirageServer';
import { renderWithApp } from '../../test/testRenderer';
import { IEventType } from '../../types/event';
import EventTypeSelector from '../EventTypeSelector';

describe('EventTypeSelector component', () => {
  const server = startMirage();

  afterEach(() => {
    server.db.emptyData();
  });

  afterAll(() => {
    server.shutdown();
  });

  it('should render', async () => {
    const onChange = jest.fn();
    const querySpy = jest.fn();
    server.createList('eventType', 5);
    const eventTypes = server.db.eventTypes as unknown as IEventType[];
    const totalEvents = sumBy(eventTypes, (c) => c.total_events);

    server.get('/event/types', (schema, req) => {
      querySpy(req.queryParams);
      return { events: eventTypes };
    });

    const component = renderWithApp(<EventTypeSelector onChange={onChange} />);
    const select = component.getByRole('combobox');
    const eventType1 = eventTypes[0];
    await waitFor(() =>
      component.getByRole('option', {
        name: `All (${totalEvents})`,
      })
    );
    await waitFor(() =>
      component.getByRole('option', {
        name: `${eventType1.name.replace(/_/g, ' ')} (${
          eventType1.total_events
        })`,
      })
    );

    fireEvent.change(select, { target: { value: eventType1.name } });

    expect(select).toBeDefined();
    expect(component.getByLabelText(/Event Type/)).toBeInTheDocument();
    expect(component.getAllByRole('option').length).toBe(eventTypes.length + 1);
    expect(querySpy).toHaveBeenCalledWith({});
    expect(onChange).toHaveBeenCalledWith(eventType1.name);
  });

  it('should apply filters', async () => {
    const querySpy = jest.fn();
    server.createList('eventType', 5);
    const eventTypes = server.db.eventTypes as unknown as IEventType[];

    server.get('/event/types', (schema, req) => {
      querySpy(req.queryParams);
      return { events: eventTypes };
    });

    const component = renderWithApp(
      <EventTypeSelector
        recipient={'recipient'}
        caregiver={'caregiver'}
        onChange={() => {}}
      />
    );
    const eventType1 = eventTypes[0];

    await waitFor(() =>
      component.getByRole('option', {
        name: `${eventType1.name.replace(/_/g, ' ')} (${
          eventType1.total_events
        })`,
      })
    );

    expect(querySpy).toHaveBeenCalledWith({
      care_recipient_id: 'recipient',
      caregiver_id: 'caregiver',
    });
  });
});
