import { sumBy } from 'lodash';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getCareGiversService } from '../services/eventService';
import { EEventTypes } from '../types/event';
import Select from './Select';

export interface IProps {
  eventType?: EEventTypes;
  recipient?: string;
  onChange: (type: string | null | undefined) => void;
}

const CaregiverSelector = (props: IProps) => {
  const {
    eventType: event_type,
    recipient: care_recipient_id,
    onChange,
  } = props;
  const eventTypeQuery = useQuery(
    ['event', 'caregiver', { event_type, care_recipient_id }],
    () => getCareGiversService({ event_type, care_recipient_id })
  );
  const totalEvents = useMemo(
    () => sumBy(eventTypeQuery.data?.caregivers ?? [], (t) => t.total_events),
    [eventTypeQuery.data]
  );

  return (
    <Select
      label="Caregiver"
      onChange={(e) => {
        const { value } = e.target;

        onChange(value === '' ? undefined : value);
      }}
    >
      <option value="">All ({totalEvents})</option>
      {eventTypeQuery.data?.caregivers.map((caregiver) => {
        return (
          <option key={caregiver.id ?? 'none'} value={caregiver.id ?? 'none'}>
            {caregiver.id || 'Anonymous'} ({caregiver.total_events})
          </option>
        );
      })}
    </Select>
  );
};

export default CaregiverSelector;
