import axios, { AxiosInstance } from 'axios';
import { config } from '../config/config';

const instance: AxiosInstance = axios.create({ baseURL: config.backendUrl });

export default instance;
