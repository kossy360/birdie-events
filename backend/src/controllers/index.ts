import express from 'express';
import { eventController } from './event.controller';

const controller = express.Router();

controller.use('/event', eventController);

export default controller;
