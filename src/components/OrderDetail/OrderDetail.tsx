import Modal from '@mui/material/Modal'
import { useEffect, useState } from 'react'
import closeIcon from '~/assets/x-white.png'
import '~/App.scss'
import { fetchGetOrder } from '~/apis/orderApi'
import { fetchProductDetailsAPI } from '~/apis/productApi'
import { useSearchParams } from 'react-router-dom'
import styles from './OrderDetail.module.scss'

interface OrderDetailProps {
  orderId: string
  open: boolean
  onClose: () => void
}

export interface Product {
  _id: string;
  name: string;
  price: number;

  colors: {
    color: string;
    imageDetail: string[];
    colorHex?: string;
  }[]
}

interface Order {
  name: string
  phone: string
  address: string
  status: "pending" | "delivering" | "completed" | "canceled"
  payment: string
  items: {
    productId: string
    quantity: number
    color: string
    size: string
  }[]
}

interface OrderItem {
  productId: string
  name: string
}

export default function OrderDetail({ orderId, open, onClose }: OrderDetailProps) {

  const [order, setOrder] = useState<Order | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [searchParam, setSearchParam] = useSearchParams()


  const statusColors = {
    pending: '#ffa706',
    delivering: '#0066ff',
    completed: '#4cd137',
    canceled: '#ff4f4f'
  }

  const getTotal = () => {
    let sum = 0
    order?.items?.forEach((product, idx) => {
      sum += Number(product.quantity) * Number(products[idx].price)
    })
    return sum
  }


  const fetchOrder = async () => {
    setIsLoadingOrder(true)
    const orders = await fetchGetOrder(orderId)
    setOrder(orders)
    const products = await Promise.all(
      orders.items.map((item: OrderItem) => fetchProductDetailsAPI(item.productId)) // truyền đúng ID
    )
    if (products) {
      setIsLoadingOrder(false)
      setProducts(products)
    }
  }

  useEffect(() => {
    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <Modal
      className={styles.modal}
      open={open}
      onClick={() => {
        const params = Object.fromEntries([...searchParam])
        delete params.active
        setSearchParam(params)
        onClose()
      }}
    >
      <div className={styles.modal_backdrop}>
        <div
          className={`${styles.modal_content} fade-in-up`}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoadingOrder ? (
            <div className={styles.loading_container}>
              <div className='spinner-large'></div>
            </div>
          ) : (
            <div className={styles.content_wrapper}>
              {/* Close Button */}
              <div className={styles.close_button_container}>
                <div
                  className={styles.close_button}
                  onClick={() => {
                    const params = Object.fromEntries([...searchParam])
                    delete params.active
                    setSearchParam(params)
                    onClose()
                  }}
                >
                  <img src={closeIcon} alt="Close" />
                </div>
              </div>
              <p className={styles.order_title}>
                {`Order #${orderId.slice(0, orderId.length / 2)}`}
              </p>
              {/* Customer info */}
              <div className={styles.customer_info}>
                <div className={styles.info_row}>
                  <p className={styles.info_label}>Name:</p>
                  <p>{order?.name}</p>
                </div>
                <div className={styles.info_row}>
                  <p className={styles.info_label}>Phone:</p>
                  <p>{order?.phone}</p>
                </div>
                <div className={styles.info_row}>
                  <p className={styles.info_label}>Address:</p>
                  <p>{order?.address}</p>
                </div>
                <div className={styles.info_row}>
                  <p className={styles.info_label}>Status:</p>
                  <p className={styles.status_value} style={{ color: order ? statusColors[order.status] : '#000' }}>
                    {order?.status}
                  </p>
                </div>
                <div className={styles.info_row}>
                  <p className={styles.info_label}>Payment:</p>
                  <p>{order?.payment}</p>
                </div>
              </div>

              <hr className={styles.divider} />

              {/* Product Order */}
              <div className={styles.products_container}>
                {products && order && order.items.length > 0 && order.items.map((item, idx) => (
                  <div className={`${styles.product_item} fade-in-up`} key={idx}>
                    {/* Img and quatity */}
                    <div className={styles.product_image}>
                      <img
                        src={
                          products[idx].colors
                            ?.find(c => c.color === item.color)
                            ?.imageDetail[0]
                        }
                        alt={products[idx].name}
                      />
                    </div>
                    {/* Name & color & size */}
                    <div className={styles.product_info}>
                      <p className={styles.product_name}>{products[idx].name}</p>
                      <p className={styles.product_detail}>
                        {'Color: '}
                        <span style={{
                          color: products[idx].colors
                            ?.find(c => c.color === item.color)
                            ?.colorHex

                        }}>
                          {item.color}
                        </span>
                      </p>
                      <p className={styles.product_detail}>
                        {'Size: '}
                        <span>{item.size}</span>
                      </p>
                      <p className={styles.product_detail}>
                        {'Quantity: '}
                        <span>{item.quantity}</span>
                      </p>
                    </div>
                    {/* Total and Quantity*/}
                    <div className={styles.product_price}>
                      <p>
                        {(Number(products[idx].price * item.quantity)).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.delivery_section}>
                <p>Delivery</p>
                <p>Free</p>
              </div>

              {/* Subtotal */}
              <div className={styles.total_section}>
                <p>Total</p>
                <p>{getTotal().toLocaleString('vi-VN')}đ</p>
              </div>

            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
