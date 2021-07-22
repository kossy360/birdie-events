export enum EEventTypes {
  FLUID_INTAKE_OBSERVATION = 'fluid_intake_observation',
  TASK_COMPLETED = 'task_completed',
  PHYSICAL_HEALTH_OBSERVATION = 'physical_health_observation',
  VISIT_COMPLETED = 'visit_completed',
  CHECK_OUT = 'check_out',
  MOOD_OBSERVATION = 'mood_observation',
  REGULAR_MEDICATION_TAKEN = 'regular_medication_taken',
  ALERT_RAISED = 'alert_raised',
  NO_MEDICATION_OBSERVATION_RECEIVED = 'no_medication_observation_received',
  INCONTINENCE_PAD_OBSERVATION = 'incontinence_pad_observation',
  CHECK_IN = 'check_in',
  GENERAL_OBSERVATION = 'general_observation',
  REGULAR_MEDICATION_NOT_TAKEN = 'regular_medication_not_taken',
  FOOD_INTAKE_OBSERVATION = 'food_intake_observation',
  TASK_COMPLETION_REVERTED = 'task_completion_reverted',
  MENTAL_HEALTH_OBSERVATION = 'mental_health_observation',
  MEDICATION_SCHEDULE_UPDATED = 'medication_schedule_updated',
  VISIT_CANCELLED = 'visit_cancelled',
  REGULAR_MEDICATION_MAYBE_TAKEN = 'general_medication_maybe_taken',
  MEDICATION_SCHEDULE_CREATED = 'medication_schedule_created',
  ALERT_QUALIFIED = 'alert_qualified',
  TASK_SCHEDULE_CREATED = 'task_schedule_created',
  CONCERN_RAISED = 'concern_raised',
  REGULAR_MEDICATION_PARTIALLY_TAKEN = 'regular_medication_partially_taken',
  CATHETER_OBSERVATION = 'catheter_observation',
  TOILET_VISIT_RECORDED = 'toilet_visit_recorded',
}

export interface IEvent {
  id: string;
  event_type: EEventTypes;
  caregiver_id: string;
  care_recipient_id: string;
  timestamp: string;
}

export interface IEventType {
  name: EEventTypes;
  total_events: number;
}

export interface IGetEventTypesResult {
  events: IEventType[];
}

export interface IEventUser {
  id: string;
  total_events: number;
}

export interface IGetEventCareGiversResult {
  caregivers: IEventUser[];
}

export interface IGetEventCareRecipientsResult {
  care_recipients: IEventUser[];
}

export interface IGetEventFilters {
  event_type?: EEventTypes;
  care_recipient_id?: string;
  caregiver_id?: string | null;
}

export interface IGetAllEventFilters extends IGetEventFilters {
  page: number;
  limit: number;
}

export interface IGetEventsResult {
  meta: {
    pageInfo: {
      total: number;
      page: number;
      limit: number;
    };
  };
  events: IEvent[];
}

export interface IEventDailyRate {
  timestamp: string;
  total_events: number;
}

export interface IGetEventRateResult {
  total: number;
  rates: IEventDailyRate[];
}
