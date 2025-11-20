import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

export const chatbot = async (message: string, conversation: any[]) => {
  const response = await axios.post(`${API_ROOT}/v1/chat/`, { message, conversation })
  return response.data
}
