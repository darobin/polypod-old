
import axios from 'axios';

export const PORT = 7654;
export const BASE_URL = `http://localhost:${PORT}/xrpc/`;
export const client = axios.create({ baseURL: BASE_URL });
