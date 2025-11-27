export interface Cart {
  _id: string
  customerId: string
  items: {
    productId: string
    quantity: number
    color: string
    size: string
  }[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}