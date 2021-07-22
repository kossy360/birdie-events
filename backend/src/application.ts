import cors from 'cors';
import express from 'express';
import controller from './controllers';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(controller);
app.use(errorMiddleware);

export default app;
