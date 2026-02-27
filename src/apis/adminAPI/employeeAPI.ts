import axiosAdmin from '../axiosAdmin'

export const fetchGetAllEmployeePageAPI = async (page: number, limit: number, filters = {}) => {
  const response = await axiosAdmin.get('/employees/getAllEmployeePage', {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const fetchEmployeeDetailAPI = async (id: string) => {
  const response = await axiosAdmin.get(`/employees/${id}`)
  return response.data
}

export const deleteEmployeeAPI = async (id: string) => {
  const response = await axiosAdmin.delete(`/employees/${id}`)
  return response.data
}

export const updateEmployeeRoleAPI = async (id: string, role: string) => {
  const response = await axiosAdmin.put(`/employees/${id}/updateRole`, { role })
  return response.data
}

export const addEmployeeAPI = async (payload: any) => {
  const response = await axiosAdmin.post('/employees/', payload)
  return response.data
}