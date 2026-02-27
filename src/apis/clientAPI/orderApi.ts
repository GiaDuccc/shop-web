import axiosClient from '../axiosClient'

export const fetchGetAllOrderPageAPI = async (page: number, limit: number, filters = {}) => {
  const response = await axiosClient.get('/orders/', {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const fetchGetOrder = async (id: string) => {
  const response = await axiosClient.get(`/orders/${id}`)
  return response.data
}

// export const updatedOrderAPI = async (id: string, total: number, payment: string) => {
//   const response = await axiosClient.put(`/orders/${id}`, { total, payment })
//   return response.data
// }

export const updatedOrderStatusAPI = async (id: string, status: string) => {
  const response = await axiosClient.put(`/orders/${id}/updateStatus`, { status })
  return response.data
}

export const deleteOrderAPI = async (id: string) => {
  const response = await axiosClient.put(`/orders/${id}/delete`)
  return response.data
}

export const getCustomerOrdersAPI = async (customerId: string) => {
  const response = await axiosClient.get(`/orders/getCustomerOrders/${customerId}`)
  return response.data
}

export const fetchCreateOrder = async (data: any) => {
  const response = await axiosClient.post('/orders/', data)
  return response.data
}

export const getQuantityAndProfitAPI = async () => {
  const response = await axiosClient.get('/orders/quantityAndProfit')
  return response.data
}

export const getOrderChartByDay = async () => {
  const response = await axiosClient.get('/orders/orderChartByDay')
  return response.data
}

export const getOrderChartByYear = async () => {
  const response = await axiosClient.get('/orders/orderAndProductSoldChartByYear')
  return response.data
}

export const sendOrderEmailAPI = async (emailData: any) => {
  const response = await axiosClient.post('/orders/sendEmail', emailData)
  return response.data
}