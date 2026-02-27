import axiosAdmin from '../axiosAdmin'

export const fetchGetAllCustomerPageAPI = async (page: number, limit: number, filters = {}) => {
  const response = await axiosAdmin.get('/customers/', {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const deleteCustomerAPI = async (id: string) => {
  const response = await axiosAdmin.delete(`/customers/${id}`)
  return response.data
}

export const fetchCustomerDetailAPI = async (id: string) => {
  const response = await axiosAdmin.get(`/customers/${id}`)
  return response.data
}

export const getAllCustomerQuantityAPI = async () => {
  const response = await axiosAdmin.get('/customers/allCustomerQuantity')
  return response.data
}

export const getCustomerChartByYear = async () => {
  const response = await axiosAdmin.get('/customers/customerChartByYear')
  return response.data
}
