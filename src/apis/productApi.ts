import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

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

export const fetchAllProductPageAPI = async (page: number, limit: number, filter = {}) => {
  const response = await axios.get(`${API_ROOT}/v1/products/filter`, {
    params: {
      page,
      limit,
      ...filter
    }
  })
  return response
}

export const uploadImageAPI = async (image: File, productName: string, productColor = '') => {
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
