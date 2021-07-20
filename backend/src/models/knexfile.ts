import dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config();

const config: Record<'local' | 'development' | 'test', Knex.Config> = {
  local: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      typeCast: (field: any, next: VoidFunction) => {
        if (field.type === 'JSON') {
          return JSON.parse(field.string());
        } else {
          return next();
        }
      },
    },
    debug: true,
    pool: {
      min: 2,
      max: 10,
    },
  },

  development: {
    client: 'mysql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
  },

  test: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      typeCast: (field: any, next: VoidFunction) => {
        if (field.type === 'JSON') {
          return JSON.parse(field.string());
        } else {
          return next();
        }
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;
