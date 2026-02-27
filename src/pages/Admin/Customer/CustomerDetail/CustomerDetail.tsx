import Modal from '@mui/material/Modal'
import { useEffect, useState } from 'react'
import OrderDetail from '~/components/OrderDetail/OrderDetailAdmin'
import '~/App.scss'
import { fetchCustomerDetailAPI } from '~/apis/adminAPI/customerAPI'
import { getCustomerOrdersAPI } from '~/apis/adminAPI/orderAPI'
import { fetchProductDetailsAPI } from '~/apis/adminAPI/productAPI'
import closeIcon from '~/assets/x-white.png'
import { Customer } from '~/interface/customer.interface'
import { Order, OrderItems } from '~/interface/order.interface'
import styles from './CustomerDetail.module.scss'

interface CustomerDetailProps {
  customerId: string
  open: boolean
  onClose: () => void
}

export default function CustomerDetail({ customerId, open, onClose }: CustomerDetailProps) {

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [ordersInCustomer, setOrdersInCustomer] = useState<Order[]>([])
  const [orderDetail, setOrderDetail] = useState<string | null>(null)
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false)

  const statusColors = {
    pending: '#ffa706',
    delivering: '#0066ff',
    completed: '#4cd137',
    canceled: '#ff4f4f'
  }

  const fetchCustomer = async () => {
    setIsLoadingCustomer(true)
    const customer = await fetchCustomerDetailAPI(customerId)
    setCustomer(customer)

    const orders = await getCustomerOrdersAPI(customerId)

    const allOrderItems = await Promise.all(
      orders.map(async (order: Order) => {
        const orderItems = await Promise.all(
          order.items.map(async (item) => {
            const productData = await fetchProductDetailsAPI(item.productId)
            return productData
          })
        )
        return {
          ...order,
          items: orderItems
        }
      })
    )

    setOrdersInCustomer(allOrderItems.reverse())
    setIsLoadingCustomer(false)
  }

  useEffect(() => {
    fetchCustomer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      open={open}
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div className={`${styles.modalBackdrop} ${orderDetail ? styles.modalBackdropHidden : styles.modalBackdropVisible}`}>
        <div
          className={`${styles.modalContent} ${isLoadingCustomer ? styles.modalContentLoading : styles.modalContentFit} fade-in-up`}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoadingCustomer ? (
            <div className={styles.spinnerContainer}>
              <div className='spinner-large'></div>
            </div>
          ) : (
            <div className={styles.contentWrapper}>
              {/* Close Button */}
              <div className={styles.closeButtonWrapper}>
                <div className={styles.closeButton} onClick={onClose}>
                  <img src={closeIcon} alt="Close" />
                </div>
              </div>
              <p className={styles.title}>
                {`Customer #${customer?.phone}`}
              </p>
              {/* Customer info */}
              <div className={styles.customerInfo}>
                {/* Name */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Name:</p>
                  <p className={styles.infoValue}>{customer?.lastName + ' ' + customer?.firstName}</p>
                </div>
                {/* Dob */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Date of birth:</p>
                  <p className={styles.infoValue}>{customer?.dob ? new Date(customer.dob).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
                {/* Email */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Email:</p>
                  <p className={styles.infoValue}>{customer?.email}</p>
                </div>
                {/* Phone */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Phone:</p>
                  <p className={styles.infoValue}>{customer?.phone}</p>
                </div>
                {/* Address */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Address:</p>
                  <p className={styles.infoValue}>{customer?.address}</p>
                </div>
                {/* Country */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Country:</p>
                  <p className={styles.infoValue}>{customer?.country}</p>
                </div>
                {/* Join Date */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Join Date:</p>
                  <p className={styles.infoValue}>{customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>

                <hr className={styles.divider} />

                {/* Product Order */}
                <div>
                  {ordersInCustomer.length > 0 && (
                    <div className={styles.ordersSection}>
                      <p className={styles.ordersTitle}>Orders History: </p>
                      {ordersInCustomer?.map((order, idx) => (
                        <div
                          onClick={() => {
                            setOrderDetail(order._id)
                          }}
                          className={`${styles.orderCard} fade-in-up`}
                          key={idx}
                        >
                          {/* Img and quatity */}
                          <div className={styles.orderImages}>
                            {order.items.slice(0, 4).map((product: OrderItems, idx: number) => (
                              <img
                                key={idx}
                                src={product.adImage}
                                alt="Product"
                                className={`${styles.productImage} ${order.items.length === 1 ? styles.productImageSingle : styles.productImageMultiple}`}
                              />
                            ))}
                          </div>
                          {/* Name & color & size */}
                          <div className={styles.orderInfo}>
                            <p className={styles.orderTitle}>
                              Order #{order._id.slice(0, order._id.length / 2)}
                            </p>
                            <p className={styles.orderText}>
                              {'Status: '}
                              <span className={styles.orderStatus} style={{ color: statusColors[order.status] }} >
                                {order.status}
                              </span>
                            </p>
                            <p className={styles.orderText}>
                              {'Address: '}
                              <span className={styles.orderAddress}>
                                {order.address}
                              </span>
                            </p>
                          </div>
                          {/* Total and Time*/}
                          <div className={styles.orderPricing}>
                            <p className={styles.orderPrice}>
                              {(Number(order.totalPrice)).toLocaleString('vi-VN')}đ
                            </p>
                            <p className={styles.orderDate}>
                              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {orderDetail && (
            <OrderDetail open={Boolean(orderDetail)} onClose={() => setOrderDetail(null)} orderId={orderDetail} />
          )}
        </div>
      </div>
    </Modal>
  )
}
