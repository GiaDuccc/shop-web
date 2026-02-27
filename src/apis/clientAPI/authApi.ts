import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import axiosClient from '../axiosClient'

export const fetchCreateCustomerAPI = async (payload: any) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/customers/`, payload)
    return response.data
  } catch (error: any) {
    throw error.response.data.errors
  }
}

export const signInAPI = async (data: any) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/signInClient`, {
    ...data
  }, { withCredentials: true })
  return response.data
}

export const signOutAPI = async () => {
  const response = await axiosClient.post('/auth/signOutClient')
  return response.data
}

export const fetchRefreshTokenAPI = async (refreshToken: string) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/refreshTokenClient`, { refreshToken })
  return response.data
}
