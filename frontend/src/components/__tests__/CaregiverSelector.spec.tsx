import { fireEvent, waitFor } from '@testing-library/react';
import { sumBy } from 'lodash';
import { startMirage } from '../../test/mirageServer';
import { renderWithApp } from '../../test/testRenderer';
import { EEventTypes, IEventUser } from '../../types/event';
import CaregiverSelector from '../CaregiverSelector';

describe('CaregiverSelector component', () => {
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
    server.createList('caregiver', 5);
    const caregivers = server.db.caregivers as unknown as IEventUser[];
    const totalEvents = sumBy(caregivers, (c) => c.total_events);

    server.get('/event/caregivers', (schema, req) => {
      querySpy(req.queryParams);
      return { caregivers: schema.all('caregiver').models };
    });

    const component = renderWithApp(<CaregiverSelector onChange={onChange} />);
    const select = component.getByRole('combobox');
    const caregiver1 = caregivers[0];
    await waitFor(() =>
      component.getByRole('option', {
        name: `All (${totalEvents})`,
      })
    );
    await waitFor(() =>
      component.getByRole('option', {
        name: `${caregiver1.id} (${caregiver1.total_events})`,
      })
    );

    fireEvent.change(select, { target: { value: caregiver1.id } });

    expect(select).toBeDefined();
    expect(component.getByLabelText(/Caregiver/)).toBeDefined();
    expect(component.getAllByRole('option').length).toBe(caregivers.length + 1);
    expect(querySpy).toHaveBeenCalledWith({});
    expect(onChange).toHaveBeenCalledWith(caregiver1.id);
  });

  it('should apply filters', async () => {
    const querySpy = jest.fn();
    server.createList('caregiver', 5);
    const caregivers = server.db.caregivers as unknown as IEventUser[];

    server.get('/event/caregivers', (schema, req) => {
      querySpy(req.queryParams);
      return { caregivers };
    });

    const component = renderWithApp(
      <CaregiverSelector
        eventType={EEventTypes.ALERT_QUALIFIED}
        recipient={'recipient'}
        onChange={() => {}}
      />
    );
    const caregiver1 = caregivers[0];

    await waitFor(() =>
      component.getByRole('option', {
        name: `${caregiver1.id} (${caregiver1.total_events})`,
      })
    );

    expect(querySpy).toHaveBeenCalledWith({
      event_type: EEventTypes.ALERT_QUALIFIED,
      care_recipient_id: 'recipient',
    });
  });
});
