import { format } from 'date-fns';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Column, useRowState, useTable } from 'react-table';
import styled from 'styled-components';
import Pagination from '../../components/Pagination';
import { Typography } from '../../components/Typography';
import { getEventsService } from '../../services/eventService';
import { IEvent, IGetAllEventFilters, IGetEventFilters } from '../../types/event';

const Container = styled.div`
  margin-bottom: 3rem;

  .title {
    margin-bottom: 1rem;
  }

  .loadingText {
    height: 20rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .paginationWrapper {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }

  .tableWrapper {
    border-radius: 7px;
    overflow: hidden;
    background: #f9f9f970;
  }
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 4px;

  td {
    text-align: center;
    padding: 1rem;
  }

  thead {
    td {
      text-align: center;
      background-color: black;
    }
  }

  tbody {
    tr:nth-child(2n + 2) {
      background: #efefefab;
    }
  }
`;

const columns: Column<IEvent>[] = [
  {
    accessor: 'id',
    Header: () => (
      <Typography textStyle="sm16" textColor="accent">
        ID
      </Typography>
    ),
    Cell: (cell) => <Typography textStyle="sm14">{cell.value}</Typography>,
  },
  {
    accessor: 'event_type',
    Header: () => (
      <Typography textStyle="sm16" textColor="accent">
        Event
      </Typography>
    ),
    Cell: (cell) => (
      <Typography textStyle="sm14" display="block">
        {cell.value.replace(/_/g, ' ')}
      </Typography>
    ),
  },
  {
    accessor: 'care_recipient_id',
    Header: () => (
      <Typography textStyle="sm16" textColor="accent">
        Recipient
      </Typography>
    ),
    Cell: (cell) => <Typography textStyle="sm14">{cell.value}</Typography>,
  },
  {
    accessor: 'caregiver_id',
    Header: () => (
      <Typography textStyle="sm16" textColor="accent">
        Caregiver
      </Typography>
    ),
    Cell: (cell) => (
      <Typography textStyle="sm14">{cell.value || 'Anonymous'}</Typography>
    ),
  },
  {
    accessor: 'timestamp',
    Header: () => (
      <Typography textStyle="sm16" textColor="accent">
        Date
      </Typography>
    ),
    Cell: (cell) => (
      <Typography textStyle="sm14">
        {format(new Date(cell.value), 'do MMM, yyyy @ kk:mm')}
      </Typography>
    ),
  },
];

const defaultArr: IEvent[] = [];

interface IProps {
  filters: IGetEventFilters;
}

const EventTable = (props: IProps) => {
  const [page, setPage] = useState(1);
  const query: IGetAllEventFilters = {
    page,
    limit: 10,
    ...props.filters,
  };
  const eventsQuery = useQuery(['events', 'all', query], () =>
    getEventsService(query)
  );
  const table = useTable(
    {
      columns,
      data: eventsQuery.data?.events ?? defaultArr,
    },
    useRowState
  );

  return (
    <Container>
      <Typography
        as="h1"
        className="title"
        textStyle="sm18"
        display="block"
        textAlign="center"
      >
        Events Table
      </Typography>
      <div className="tableWrapper">
        <Table aria-label="custom pagination table">
          <thead>
            <tr {...table.headerGroups[0].getHeaderGroupProps()}>
              {table.headerGroups[0].headers.map((column) => (
                <td
                  style={{ minWidth: column.minWidth }}
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => {
              table.prepareRow(row);

              return (
                <tr
                  aria-label={`event row ${parseInt(row.id) + 1}`}
                  {...row.getRowProps()}
                  key={row.id}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={`${cell.row.id}-${index}`}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        {!eventsQuery.isLoading && !eventsQuery.data?.events.length && (
          <Typography className="loadingText" textStyle="sm18">
            No events
          </Typography>
        )}
        {eventsQuery.isLoading && (
          <Typography className="loadingText" textStyle="sm18">
            Fetching events...
          </Typography>
        )}
      </div>
      <div className="paginationWrapper">
        <Pagination
          limit={eventsQuery.data?.meta.pageInfo.limit ?? 10}
          page={page}
          total={eventsQuery.data?.meta.pageInfo.total ?? 0}
          onPageChange={setPage}
        />
      </div>
    </Container>
  );
};

export default EventTable;
