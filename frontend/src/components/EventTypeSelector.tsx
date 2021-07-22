import { sumBy } from 'lodash';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getEventTypesService } from '../services/eventService';
import { EEventTypes } from '../types/event';
import Select from './Select';

export interface IProps {
  recipient?: string;
  caregiver?: string | null;
  onChange: (type?: EEventTypes | undefined) => void;
}

const EventTypeSelector = (props: IProps) => {
  const {
    recipient: care_recipient_id,
    caregiver: caregiver_id,
    onChange,
  } = props;
  const eventTypeQuery = useQuery(
    ['event', 'type', { care_recipient_id, caregiver_id }],
    () => getEventTypesService({ care_recipient_id, caregiver_id })
  );
  const totalEvents = useMemo(
    () => sumBy(eventTypeQuery.data?.events ?? [], (t) => t.total_events),
    [eventTypeQuery.data]
  );

  return (
    <Select
      label="Event Type"
      onChange={(e) => {
        const { value } = e.target;

        onChange(value === '' ? undefined : (value as EEventTypes));
      }}
    >
      <option value="">All ({totalEvents})</option>
      {eventTypeQuery.data?.events.map((type) => {
        return (
          <option key={type.name} value={type.name}>
            {type.name.replace(/_/g, ' ')} ({type.total_events})
          </option>
        );
      })}
    </Select>
  );
};

export default EventTypeSelector;
