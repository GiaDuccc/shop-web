export interface Order {
  address: string;
  createdAt: string;
  items: OrderItems[];
  name: string;
  payment: string;
  phone: string;
  status: 'pending' | 'delivering' | 'completed' | 'canceled';
  totalPrice: number;
  updateAt: string;
  _destroy: boolean;
  _id: string;
}

export interface OrderItems {
  productId: string;
  quantity: number;
  size: number;
  color: string;
  adImage?: string;
}