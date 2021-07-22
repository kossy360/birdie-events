import { knex } from 'knex';
import config from './knexfile';

export const db = knex(
  config[process.env.NODE_ENV as 'local' | 'production' | 'test']
);
