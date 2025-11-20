import apiClient from '~/utils/axiosConfig'

export const fetchGetAllOrderPageAPI = async (page: number, limit: number, filters = {}) => {
  const response = await apiClient.get('/v1/orders/', {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const fetchGetOrder = async (id: string) => {
  const response = await apiClient.get(`/v1/orders/${id}`)
  return response.data
}

export const updatedOrderAPI = async (id: string, total: number, payment: string) => {
  const response = await apiClient.put(`/v1/orders/${id}`, { total, payment })
  return response.data
}

export const updatedOrderStatusAPI = async (id: string, status: string) => {
  const response = await apiClient.put(`/v1/orders/${id}/updateStatus`, { status })
  return response.data
}

export const deleteOrderAPI = async (id: string) => {
  const response = await apiClient.put(`/v1/orders/${id}/delete`)
  return response.data
}

export const fetchCreateOrder = async () => {
  const response = await apiClient.post('/v1/orders/')
  return response.data
}

export const addProductToOrder = async (orderId: string, data: any) => {
  const response = await apiClient.put(`/v1/orders/${orderId}/add-product`, data)
  return response.data
}

export const removeProductFromOrderAPI = async (orderId: string, data: any) => {
  const response = await apiClient.put(`/v1/orders/${orderId}/remove-product`, data)
  return response.data
}

export const increaseQuantityAPI = async (orderId: string, product: any) => {
  const response = await apiClient.put(`/v1/orders/${orderId}/increase-quantity`, product)
  return response.data
}

export const decreaseQuantityAPI = async (orderId: string, product: any) => {
  const response = await apiClient.put(`/v1/orders/${orderId}/decrease-quantity`, product)
  return response.data
}

export const addInformationToOrderAPI = async (orderId: string, data: any) => {
  const response = await apiClient.put(`/v1/orders/${orderId}/add-information`, data)
  return response.data
}

export const getQuantityAndProfitAPI = async () => {
  const response = await apiClient.get('/v1/orders/quantityAndProfit')
  return response.data
}

export const getOrderChartByDay = async () => {
  const response = await apiClient.get('/v1/orders/orderChartByDay')
  return response.data
}

export const getOrderChartByYear = async () => {
  const response = await apiClient.get('/v1/orders/orderAndProductSoldChartByYear')
  return response.data
}
