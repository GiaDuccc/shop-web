import axiosAdmin from '../axiosAdmin'

export const getCustomerOrdersAPI = async (customerId: string) => {
  const response = await axiosAdmin.get(`/orders/getCustomerOrders/${customerId}`)
  return response.data
}

export const fetchGetOrder = async (id: string) => {
  const response = await axiosAdmin.get(`/orders/${id}`)
  return response.data
}

export const fetchGetAllOrderPageAPI = async (page: number, limit: number, filters = {}) => {
  const response = await axiosAdmin.get('/orders/', {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const updatedOrderStatusAPI = async (id: string, status: string) => {
  const response = await axiosAdmin.put(`/orders/${id}/updateStatus`, { status })
  return response.data
}

export const deleteOrderAPI = async (id: string) => {
  const response = await axiosAdmin.delete(`/orders/${id}/delete`)
  return response.data
}

export const getQuantityAndProfitAPI = async () => {
  const response = await axiosAdmin.get('/orders/quantityAndProfit')
  return response.data
}

export const getOrderChartByYear = async () => {
  const response = await axiosAdmin.get('/orders/orderAndProductSoldChartByYear')
  return response.data
}