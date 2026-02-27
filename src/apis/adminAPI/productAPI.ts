import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import axiosAdmin from '../axiosAdmin'

export const fetchProductDetailsAPI = async (productId: string) => {
  const response = await axios.get(`${API_ROOT}/v1/products/${productId}`)
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
  return response.data
}

export const deleteProductAPI = async (id: string) => {
  const response = await axiosAdmin.delete(`/products/${id}`)
  return response.data
}

export const addProductAPI = async (product: any) => {
  const response = await axiosAdmin.post(`/products/`, product)
  return response.data
}

export const uploadImageAPI = async (image: File, productName: string, productColor = '') => {
  const formData = new FormData()
  formData.append('file', image)
  const queryParams = new URLSearchParams({ productName, productColor }).toString()
  const response = await axiosAdmin.post(`/products/uploadSingle?${queryParams}`, formData, {
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
  const response = await axiosAdmin.post(`/products/uploadArray?${queryParams}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const updateProductAPI = async (id: string, properties: any) => {
  const response = await axiosAdmin.put(`/products/${id}/`, properties)
  return response.data
}

export const getAllProductQuantityAPI = async () => {
  const response = await axiosAdmin.get('products/allProductQuantity')
  return response.data
}
