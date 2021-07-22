import { sumBy } from 'lodash';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getRecipientsService } from '../services/eventService';
import { EEventTypes } from '../types/event';
import Select from './Select';

export interface IProps {
  eventType?: EEventTypes;
  caregiver?: string | null;
  onChange: (type: string | undefined) => void;
}

const RecipientSelector = (props: IProps) => {
  const { eventType: event_type, caregiver: caregiver_id, onChange } = props;
  const eventTypeQuery = useQuery(
    ['event', 'care-recipient', { event_type, caregiver_id }],
    () => getRecipientsService({ event_type, caregiver_id })
  );
  const totalEvents = useMemo(
    () =>
      sumBy(eventTypeQuery.data?.care_recipients ?? [], (t) => t.total_events),
    [eventTypeQuery.data]
  );

  return (
    <Select
      label="Recipient"
      onChange={(e) => {
        const { value } = e.target;

        onChange(value === '' ? undefined : value);
      }}
    >
      <option value="">All ({totalEvents})</option>
      {eventTypeQuery.data?.care_recipients.map((recipient) => {
        return (
          <option key={recipient.id} value={recipient.id}>
            {recipient.id} ({recipient.total_events})
          </option>
        );
      })}
    </Select>
  );
};

export default RecipientSelector;
