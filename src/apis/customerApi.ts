import apiClient from '~/utils/axiosConfig'

export const fetchGetAllCustomerPageAPI = async (page: number, limit: number, filters = {}) => {
  const response = await apiClient.get('/v1/customers/', {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const fetchCustomerDetailAPI = async (id: string) => {
  const response = await apiClient.get(`/v1/customers/${id}`)
  return response.data
}

export const updateCustomer = async (customerId: string, properties: any) => {
  const response = await apiClient.put(`/v1/customers/${customerId}/updateCustomer`, { properties })
  return response.data
}

export const changeRoleCustomerAPI = async (id: string, role: string) => {
  const response = await apiClient.put(`/v1/customers/${id}/changeRole`, { role })
  return response.data
}

export const deleteCustomerAPI = async (id: string) => {
  const response = await apiClient.put(`/v1/customers/${id}/delete`)
  return response.data
}

export const addOrderToCustomer = async (customerId: string, order: any) => {
  const response = await apiClient.put(`/v1/customers/${customerId}/add-order`, order)
  return response.data
}

export const updateOrderInCustomer = async (customerId: string, orderId: string, status = 'pending') => {
  const response = await apiClient.put(`/v1/customers/${customerId}/update-order`, { orderId, status })
  return response.data
}

export const getAllCustomerQuantityAPI = async () => {
  const response = await apiClient.get('/v1/customers/allCustomerQuantity')
  return response.data
}

export const getCustomerChartByDay = async () => {
  const response = await apiClient.get('/v1/customers/customerChartByDay')
  return response.data
}

export const getCustomerChartByYear = async () => {
  const response = await apiClient.get('/v1/customers/customerChartByYear')
  return response.data
}
