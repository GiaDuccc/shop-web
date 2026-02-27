import apiClient from '../axiosClient'

export const fetchGetAllCustomerPageAPI = async (page: number, limit: number, filters = {}) => {
  const response = await apiClient.get('/customers/', {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const fetchCustomerDetailAPI = async (id: string) => {
  const response = await apiClient.get(`/customers/${id}`)
  return response.data
}

export const updateCustomer = async (customerId: string, properties: any) => {
  const response = await apiClient.put(`/customers/${customerId}/updateCustomer`, { properties })
  return response.data
}

export const changeRoleCustomerAPI = async (id: string, role: string) => {
  const response = await apiClient.put(`/customers/${id}/changeRole`, { role })
  return response.data
}

export const deleteCustomerAPI = async (id: string) => {
  const response = await apiClient.put(`/customers/${id}/delete`)
  return response.data
}

export const addOrderToCustomer = async (customerId: string, order: any) => {
  const response = await apiClient.put(`/customers/${customerId}/add-order`, order)
  return response.data
}

export const updateOrderInCustomer = async (customerId: string, orderId: string, status = 'pending') => {
  const response = await apiClient.put(`/customers/${customerId}/update-order`, { orderId, status })
  return response.data
}

export const getAllCustomerQuantityAPI = async () => {
  const response = await apiClient.get('/customers/allCustomerQuantity')
  return response.data
}

export const getCustomerChartByDay = async () => {
  const response = await apiClient.get('/customers/customerChartByDay')
  return response.data
}

export const getCustomerChartByYear = async () => {
  const response = await apiClient.get('/customers/customerChartByYear')
  return response.data
}
