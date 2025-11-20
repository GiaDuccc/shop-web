import axios from 'axios'
import apiClient from '~/utils/axiosConfig'
import { API_ROOT } from '~/utils/constants'

export const fetchCreateCustomerAPI = async (payload: any) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/customers/`, payload)
    return response.data
  } catch (error: any) {
    throw error.response.data.errors
  }
}

export const fetchLoginAPI = async (data: any) => {
  const response = await axios.post(`${API_ROOT}/v1/customers/login`, data)
  return response.data
}

export const fetchLogoutAPI = async () => {
  const response = await apiClient.post('/v1/customers/logout')
  return response.data
}

export const fetchRefreshTokenAPI = async (refreshToken: string) => {
  const response = await axios.post(`${API_ROOT}/v1/customers/refresh-token`, { refreshToken })
  return response.data
}
