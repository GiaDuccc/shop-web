import axios from 'axios';
import { API_ROOT } from '~/utils/constants';
import axiosAdmin from '../axiosAdmin';

export const signInAdminAPI = async (username: string, password: string) => {
  const response = await axios.post(`${API_ROOT}/v1/admin/auth/signInAdmin`,
    { username, password }, { withCredentials: true }
  );
  return response.data;
}

export const signOutAdminAPI = async () => {
  const response = await axiosAdmin.post('/auth/signOutAdmin', {});
  return response.data;
}

export const refreshTokenAdminAPI = async () => {
  const response = await axios.post(`${API_ROOT}/v1/admin/auth/refreshTokenAdmin`, {}, { withCredentials: true });
  return response.data;
}