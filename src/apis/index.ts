import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

// Product
export const fetchProductDetailsAPI = async (productId: string) => {
  const response = await axios.get(`${API_ROOT}/v1/products/${productId}`)
  return response.data
}

export const fetchAllProductAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/products/`)
  return response.data
}

export const addProductAPI = async (product: any) => {
  const response = await axios.post(`${API_ROOT}/v1/products/`, product)
  return response.data
}

export const fetchAllProductPageAPI = async (page: number, limit: number, filter: any = {}) => {
  const response = await axios.get(`${API_ROOT}/v1/products/filter`, {
    params: {
      page,
      limit,
      ...filter
    }
  })
  return response
}

export const uploadImageAPI = async (image: File, productName: string, productColor: string = '') => {
  const formData = new FormData()
  formData.append('file', image)
  const queryParams = new URLSearchParams({ productName, productColor }).toString()
  const response = await axios.post(`${API_ROOT}/v1/products/uploadSingle?${queryParams}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const uploadImagesAPI = async (images: File | File[], productName: string, productColor: string) => {
  const formData = new FormData()
  if (Array.isArray(images)) {
    images.forEach(image => {
      formData.append('files', image)
    })
  } else {
    formData.append('files', images)
  }
  const queryParams = new URLSearchParams({ productName, productColor }).toString()
  const response = await axios.post(`${API_ROOT}/v1/products/uploadArray?${queryParams}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const deleteProductAPI = async (id: string) => {
  const response = await axios.put(`${API_ROOT}/v1/products/${id}/delete`)
  return response
}

export const updateProductAPI = async (id: string, properties: any) => {
  const response = await axios.put(`${API_ROOT}/v1/products/${id}/`, properties)
  return response.data
}

export const updateQuantitySold = async (productId: string, quantity: number) => {
  const response = await axios.put(`${API_ROOT}/v1/products/${productId}/quantitySold`, { quantity })
  return response.data
}

export const getAllProductQuantityAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/products/allProductQuantity`)
  return response.data
}

export const getTopBestSeller = async () => {
  const response = await axios.get(`${API_ROOT}/v1/products/topBestSeller`)
  return response.data
}

export const fetchLimitedProductsAPI = async (brand: string, type: string) => {
  const response = await axios.get(`${API_ROOT}/v1/products/sliderType`, {
    params: { brand, type }
  })
  return response.data
}

export const getTypeAndNavbarImageFromBrand = async (brand: string) => {
  const response = await axios.get(`${API_ROOT}/v1/products/typeAndNavbarImageFromBrand`, {
    params: { brand }
  })
  return response.data
}

// Customer
export const fetchGetAllCustomerPageAPI = async (page: number, limit: number, filters: any = {}) => {
  const response = await axios.get(`${API_ROOT}/v1/customers/`, {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const fetchCustomerDetailAPI = async (id: string) => {
  const response = await axios.get(`${API_ROOT}/v1/customers/${id}`)
  return response.data
}

export const fetchCreateCustomerAPI = async (payload: any) => {
  try {
    const response = await axios.post(`${API_ROOT}/v1/customers/`, payload)
    return response.data
  } catch (error: any) {
    throw error.response.data.errors
  }
}

export const updateCustomer = async (customerId: string, properties: any) => {
  const response = await axios.put(`${API_ROOT}/v1/customers/${customerId}/updateCustomer`, { properties })
  return response.data
}

export const changeRoleCustomerAPI = async (id: string, role: string) => {
  const response = await axios.put(`${API_ROOT}/v1/customers/${id}/changeRole`, { role })
  return response.data
}

export const deleteCustomerAPI = async (id: string) => {
  const response = await axios.put(`${API_ROOT}/v1/customers/${id}/delete`)
  return response.data
}

export const fetchLoginAPI = async (data: any) => {
  const response = await axios.post(`${API_ROOT}/v1/customers/login`, data)
  return response.data
}

export const fetchLogoutAPI = async () => {
  const response = await axios.post(`${API_ROOT}/v1/customers/logout`)
  return response.data
}

export const fetchRefreshTokenAPI = async (refreshToken: string) => {
  const response = await axios.post(`${API_ROOT}/v1/customers/refresh-token`, { refreshToken })
  return response.data
}

export const addOrderToCustomer = async (customerId: string, order: any) => {
  const response = await axios.put(`${API_ROOT}/v1/customers/${customerId}/add-order`, order)
  return response.data
}

export const updateOrderInCustomer = async (customerId: string, orderId: string, status: string = 'pending') => {
  const response = await axios.put(`${API_ROOT}/v1/customers/${customerId}/update-order`, { orderId, status })
  return response.data
}

export const getAllCustomerQuantityAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/customers/allCustomerQuantity`)
  return response.data
}

export const getCustomerChartByDay = async () => {
  const response = await axios.get(`${API_ROOT}/v1/customers/customerChartByDay`)
  return response.data
}

export const getCustomerChartByYear = async () => {
  const response = await axios.get(`${API_ROOT}/v1/customers/customerChartByYear`)
  return response.data
}

// Order

export const fetchGetAllOrderPageAPI = async (page: number, limit: number, filters: any = {}) => {
  const response = await axios.get(`${API_ROOT}/v1/orders/`, {
    params: {
      page,
      limit,
      ...filters
    }
  })
  return response.data
}

export const fetchGetOrder = async (id: string) => {
  const response = await axios.get(`${API_ROOT}/v1/orders/${id}`)
  return response.data
}

export const updatedOrderAPI = async (id: string, total: number, payment: string) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${id}`, { total, payment })
  return response.data
}

export const updatedOrderStatusAPI = async (id: string, status: string) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${id}/updateStatus`, { status })
  return response.data
}

export const deleteOrderAPI = async (id: string) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${id}/delete`)
  return response.data
}

export const fetchCreateOrder = async () => {
  const response = await axios.post(`${API_ROOT}/v1/orders/`)
  return response.data
}

export const addProductToOrder = async (orderId: string, data: any) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${orderId}/add-product`, data)
  return response.data
}

export const removeProductFromOrderAPI = async (orderId: string, data: any) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${orderId}/remove-product`, data)
  return response.data
}

export const increaseQuantityAPI = async (orderId: string, product: any) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${orderId}/increase-quantity`, product)
  return response.data
}

export const decreaseQuantityAPI = async (orderId: string, product: any) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${orderId}/decrease-quantity`, product)
  return response.data
}

export const addInformationToOrderAPI = async (orderId: string, data: any) => {
  const response = await axios.put(`${API_ROOT}/v1/orders/${orderId}/add-information`, data)
  return response.data
}

export const getQuantityAndProfitAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/orders/quantityAndProfit`)
  return response.data
}

export const getOrderChartByDay = async () => {
  const response = await axios.get(`${API_ROOT}/v1/orders/orderChartByDay`)
  return response.data
}

export const getOrderChartByYear = async () => {
  const response = await axios.get(`${API_ROOT}/v1/orders/orderAndProductSoldChartByYear`)
  return response.data
}

// Chatbot
export const chatbot = async (message: string, conversation: any) => {
  const response = await axios.post(`${API_ROOT}/v1/chat/`, { message, conversation })
  return response.data
}