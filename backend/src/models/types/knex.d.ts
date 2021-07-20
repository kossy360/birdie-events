import { Knex } from 'knex';
import { IEvent } from '../../types.ts/event.type';

declare module 'knex/types/tables' {
  interface Tables {
    events: Knex.CompositeTableType<IEvent>;
  }
}
