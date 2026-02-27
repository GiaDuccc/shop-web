import { API_ROOT } from '~/utils/constants'
import axiosClient from '../axiosClient'

export const findCartByCustomerId = async (customerId: string) => {
  try {
    const response = await axiosClient.get(`${API_ROOT}/v1/carts/findCartByCustomerId/${customerId}`)
    return response.data
  } catch (error: any) {
    throw error.response.data.errors
  }
}

export const updateCartAPI = async (cartId: string, updateData: any) => {
  const response = await axiosClient.put(`${API_ROOT}/v1/carts/updateCart/${cartId}`, updateData)
  return response.data
}

export const addProductToCartAPI = async (cartId: string, productData: any) => {
  const response = await axiosClient.post(`${API_ROOT}/v1/carts/addProductToCart/${cartId}`, productData)
  return response.data
}

export const removeProductFromCartAPI = async (cartId: string, productId: string) => {
  const response = await axiosClient.delete(`${API_ROOT}/v1/carts/removeProductFromCart/${cartId}`, {
    data: { productId }
  })
  return response.data
}

export const deleteCartAPI = async (cartId: string) => {
  const response = await axiosClient.delete(`${API_ROOT}/v1/carts/${cartId}`)
  return response.data
}

export const updateCartAfterCheckoutAPI = async (cartId: string, updateData: any) => {
  const response = await axiosClient.put(`${API_ROOT}/v1/carts/updateCartAfterCheckout/${cartId}`, updateData)
  return response.data
}

export const createCartAPI = async (customerId: string) => {
  const response = await axiosClient.post(`${API_ROOT}/v1/carts/`, { customerId })
  return response.data
}