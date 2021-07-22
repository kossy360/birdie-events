import axios from 'axios';
import { apiBaseUrl } from '../config/environment';

export const http = axios.create({
  baseURL: apiBaseUrl,
});
