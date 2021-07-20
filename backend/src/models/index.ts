import { knex } from 'knex';
import { attachPaginate } from 'knex-paginate';
import config from './knexfile';

attachPaginate();

export const db = knex(
  config[process.env.NODE_ENV as 'local' | 'development' | 'test']
);
