import React, { useState } from 'react';
import styled from 'styled-components';
import CaregiverSelector from '../../components/CaregiverSelector';
import EventTypeSelector from '../../components/EventTypeSelector';
import RecipientSelector from '../../components/RecipientSelector';
import { Typography } from '../../components/Typography';
import { EEventTypes } from '../../types/event';
import EventTable from './EventTable';
import TrendChart from './TrendChart';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;

  .topBar {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 2px 4px rgb(236 229 255 / 30%);
    position: sticky;
    top: 0;
    background-color: #fff;

    .selectGroup {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      gap: 30px;
      max-width: 80rem;
      margin-top: 1rem;
    }
  }

  .content {
    padding: 2rem 0 3rem;
    max-width: 80rem;
    width: 90%;
    margin: auto;
    flex-grow: 1;

    .selectGroup {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      gap: 30px;
    }
  }

  .footer {
    display: flex;
    padding: 1rem;
    justify-content: center;
  }
`;

const Home = () => {
  const [eventType, setEventType] = useState<EEventTypes | undefined>(
    undefined
  );
  const [caregiver, setCaregiver] = useState<string | null | undefined>(
    undefined
  );
  const [careRecipient, setCareRecipient] = useState<string | undefined>(
    undefined
  );

  return (
    <Container>
      <div className="topBar">
        <Typography
          as="h1"
          textStyle="sm18"
          textTheme={{ weight: 600 }}
          display="block"
        >
          Birdie Events Dashboard
        </Typography>
        <div role="group" aria-label="event filters" className="selectGroup">
          <EventTypeSelector
            caregiver={caregiver}
            recipient={careRecipient}
            onChange={setEventType}
          />
          <RecipientSelector
            caregiver={caregiver}
            eventType={eventType}
            onChange={setCareRecipient}
          />
          <CaregiverSelector
            eventType={eventType}
            recipient={careRecipient}
            onChange={setCaregiver}
          />
        </div>
      </div>
      <div className="content">
        <EventTable
          filters={{
            event_type: eventType,
            caregiver_id: caregiver,
            care_recipient_id: careRecipient,
          }}
        />
        <TrendChart
          filters={{
            event_type: eventType,
            caregiver_id: caregiver,
            care_recipient_id: careRecipient,
          }}
        />
      </div>
      <footer className="footer">
        <Typography textStyle="sm12" textColor="primary600">
          Built by Kossy for Birdie
        </Typography>
      </footer>
    </Container>
  );
};

export default Home;
