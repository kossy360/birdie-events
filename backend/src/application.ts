import express from 'express';
import controller from './controllers';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(controller);

export default app;
