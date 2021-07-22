import { fireEvent, waitFor } from '@testing-library/react';
import { sumBy } from 'lodash';
import { startMirage } from '../../test/mirageServer';
import { renderWithApp } from '../../test/testRenderer';
import { EEventTypes, IEventUser } from '../../types/event';
import RecipientSelector from '../RecipientSelector';

describe('RecipientSelector component', () => {
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
    server.createList('recipient', 5);
    const recipients = server.db.recipients as unknown as IEventUser[];
    const totalEvents = sumBy(recipients, (c) => c.total_events);

    server.get('/event/care-recipients', (schema, req) => {
      querySpy(req.queryParams);
      return { care_recipients: recipients };
    });

    const component = renderWithApp(<RecipientSelector onChange={onChange} />);
    const select = component.getByRole('combobox');
    const recipient1 = recipients[0];
    await waitFor(() =>
      component.getByRole('option', {
        name: `All (${totalEvents})`,
      })
    );
    await waitFor(() =>
      component.getByRole('option', {
        name: `${recipient1.id} (${recipient1.total_events})`,
      })
    );

    fireEvent.change(select, { target: { value: recipient1.id } });

    expect(select).toBeDefined();
    expect(component.getByLabelText(/Recipient/)).toBeDefined();
    expect(component.getAllByRole('option').length).toBe(recipients.length + 1);
    expect(querySpy).toHaveBeenCalledWith({});
    expect(onChange).toHaveBeenCalledWith(recipient1.id);
  });

  it('should apply filters', async () => {
    const querySpy = jest.fn();
    server.createList('recipient', 5);
    const recipients = server.db.recipients as unknown as IEventUser[];

    server.get('/event/care-recipients', (schema, req) => {
      querySpy(req.queryParams);
      return { care_recipients: recipients };
    });

    const component = renderWithApp(
      <RecipientSelector
        eventType={EEventTypes.ALERT_QUALIFIED}
        caregiver={'caregiver'}
        onChange={() => {}}
      />
    );
    const recipient1 = recipients[0];

    await waitFor(() =>
      component.getByRole('option', {
        name: `${recipient1.id} (${recipient1.total_events})`,
      })
    );

    expect(querySpy).toHaveBeenCalledWith({
      event_type: EEventTypes.ALERT_QUALIFIED,
      caregiver_id: 'caregiver',
    });
  });
});
