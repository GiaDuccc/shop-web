/* eslint-disable no-console */
import Drawer from '@mui/material/Drawer'
import { addOrderToCustomer, fetchCustomerDetailAPI } from '~/apis/customerApi'
import { fetchCreateOrder, fetchGetOrder, increaseQuantityAPI, decreaseQuantityAPI, removeProductFromOrderAPI } from '~/apis/orderApi'
import { fetchProductDetailsAPI } from '~/apis/productApi'
import { useEffect, useState } from 'react'
import removeIcon from '~/assets/minus.png'
import addIcon from '~/assets/plus.png'
import trashIcon from '~/assets/trash.png'
import outOfStock from '~/assets/outOfStock.png'
import deliveryIcon from '~/assets/delivery.png'
import { useNavigate } from 'react-router-dom'
import closeIcon from '~/assets/x-white.png'
import { jwtDecode } from 'jwt-decode'
import styles from './Cart.module.scss'

interface ShoppingCartProps {
  open: boolean
  toggleDrawer: () => void
}

interface Product {
  _id: string
  name: string
}

interface OrderData {
  _id: string
  items: Array<{
    productId: string
    color: string
    size: string
    quantity: number
  }>
  status: string
}

function ShoppingCart({ open, toggleDrawer }: ShoppingCartProps) {

  const accessToken = localStorage.getItem('accessToken')
  const token = accessToken ? jwtDecode(accessToken) : null

  const [customer, setCustomer] = useState(null)

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [quantitySelect, setQuantitySelect] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const getMaxQuantityByIdx = (idx) => {
    return products[idx].colors.find(c => c?.color === orderData.items[idx]?.color)
      ?.sizes.find(s => s.size.toString() === orderData.items[idx].size).quantity
  }

  const getTotal = () => {
    let sum = 0
    quantitySelect.forEach((quantity, idx) => {
      sum += Number(quantity) * Number(products[idx].price)
    })
    return sum
  }

  const handleUpQuantity = async (idx) => {
    const availableQuantity = getMaxQuantityByIdx(idx)
    if (orderData.items[idx].quantity + 1 > availableQuantity) {
      return
    }
    else {
      const newQuantitySelect = [...quantitySelect]
      newQuantitySelect[idx] = newQuantitySelect[idx] + 1
      setQuantitySelect(newQuantitySelect)

      await increaseQuantityAPI(orderData._id, orderData.items[idx])
        .then(data => {
          setOrderData(data)
          console.log('tăng quantity thành công', data)
        })
        .catch(error => console.log('tăng quantity lỗi', error))
    }
  }

  const handleDownQuantity = async (idx) => {
    const deletedItem = orderData.items[idx]; // Lưu trước cái item cần xóa

    if (orderData.items[idx].quantity - 1 < 1) {
      const updatedItems = [...orderData.items]
      updatedItems.splice(idx, 1) // Xóa sản phẩm tại vị trí idx

      // Cập nhật lại orderData với danh sách sản phẩm đã thay đổi
      const updatedOrderData = { ...orderData, items: updatedItems }

      // Cập nhật lại state và API
      setOrderData(updatedOrderData)
      // console.log('orderData cũ', orderData)


      const updatedProducts = [...products]
      updatedProducts.splice(idx, 1)
      setProducts(updatedProducts)
      // console.log('products cũ', products)


      // Cập nhật lại trạng thái số lượng chọn cho các sản phẩm còn lại
      const newQuantitySelect = [...quantitySelect]
      newQuantitySelect.splice(idx, 1) // Xóa chỉ số quantity cho sản phẩm đã xóa
      setQuantitySelect(newQuantitySelect)
      // console.log('quantitySelect cũ', quantitySelect)

      await removeProductFromOrderAPI(orderData._id, deletedItem)
        .then(data => console.log('Đơn hàng đã được cập nhật sau khi xóa sản phẩm', data))
        .catch(error => console.log('Lỗi khi cập nhật đơn hàng', error))

    } else {
      const newQuantitySelect = [...quantitySelect]
      newQuantitySelect[idx] = newQuantitySelect[idx] - 1
      setQuantitySelect(newQuantitySelect)

      await decreaseQuantityAPI(orderData._id, orderData.items[idx])
        .then(data => {
          setOrderData(data)
          console.log('giảm quantity thành công')
        })
        .catch(() => console.log('giảm quantity lỗi'))
    }
  }

  const handleSubmit = () => {
    navigate('/checkout')
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return

      const customer = await fetchCustomerDetailAPI(token.userId)
      setCustomer(customer)
      if (!customer.orders || customer.orders.length === 0) {
        const order = await fetchCreateOrder()
        const data = { orderId: order._id, status: order.status }
        const updatedCustomer = await addOrderToCustomer(token.userId, data)
        // localStorage.setItem('user', JSON.stringify(updatedCustomer))

        setCustomer(updatedCustomer)
        setOrderData(order)
      } else {
        if (customer.orders[customer.orders.length - 1]?.status !== 'cart') {
          const order = await fetchCreateOrder()
          const data = { orderId: order._id, status: order.status }
          const updatedCustomer = await addOrderToCustomer(token.userId, data)
          // localStorage.setItem('user', JSON.stringify(updatedCustomer))

          setCustomer(updatedCustomer)
          setOrderData(order)
          return
        }
        const lastOrder = await fetchGetOrder(customer.orders[customer.orders.length - 1].orderId)
        setOrderData(lastOrder)

        const productList = await Promise.all(
          lastOrder.items.map(item => fetchProductDetailsAPI(item.productId))
        )
        setProducts(productList)
        setQuantitySelect(lastOrder.items.map(item => item.quantity))
      }
    }

    if (open) { // chỉ fetchData khi mở cart
      setIsLoading(true)
      fetchData()
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }
  }, [open])

  if (!token) return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      className={styles.drawer_not_logged}
      ModalProps={{
        BackdropProps: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }}
    >
      <div className={styles.cart_container}>
        <div className={`${styles.close_button} ${styles.close_button_not_logged}`} onClick={toggleDrawer}>
          <img src={closeIcon} alt="Close" />
        </div>
        <p className={`${styles.cart_title} ${styles.cart_title_not_logged}`}>Your Cart</p>
        <div className={styles.not_logged_content}>
          <p className={styles.not_logged_message}>Sign In for Shopping.</p>
          <div className={styles.signin_button}>
            <a href="/sign-in">Sign In</a>
          </div>
        </div>
      </div>
    </Drawer>
  )

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      className={styles.drawer}
      ModalProps={{
        BackdropProps: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }}
    >
      <div className={`${styles.cart_container} fade-in`}>
        <div className={styles.close_button} onClick={toggleDrawer}>
          <img src={closeIcon} alt="Close" />
        </div>
        <p className={styles.cart_title}>Your Cart</p>
        {/* Sản phẩm trong giỏ hàng */}
        {isLoading ? (
          <div className={styles.loading_container}>
            <div className='spinner-large'></div>
          </div>
        ) : (
          <div className={styles.products_container}>
            {products.length > 0 ? products?.map((product, idx) => (
              <div className={`${styles.product_item} fade-in-up`} key={idx}>
                {/* Img and quatity */}
                <div className={styles.product_image_section}>
                  <img
                    src={product.colors.find(item => item.color === orderData.items[idx].color)?.imageDetail[0]}
                    alt={product.name}
                  />
                </div>
                {/* Name & color & size */}
                <div className={styles.product_info}>
                  <p className={styles.product_name}>{product.name}</p>
                  <p className={styles.product_type}>{product.type.slice(0, 1).toUpperCase() + product.type.slice(1)}</p>
                  <p className={styles.product_color}>
                    {'Color: '}
                    <span style={{
                      color: product.colors.find(color => color.color === orderData.items[idx].color).colorHex
                    }}>
                      {orderData.items[idx]?.color.slice(0, 1).toUpperCase() + orderData.items[idx]?.color.slice(1)}
                    </span>
                  </p>
                  <p className={styles.product_size}>
                    {'Size: '}
                    <span>
                      {orderData.items[idx]?.size}
                    </span>
                  </p>
                </div>
                {/* Total and Quantity*/}
                <div className={styles.product_actions}>
                  <p className={styles.product_total}>
                    {(Number(quantitySelect[idx]) * Number(products[idx].price)).toLocaleString('vi-VN')}đ
                  </p>
                  <div className={styles.quantity_control}>
                    <div className={`${styles.quantity_button} ${styles.quantity_decrease}`} onClick={() => handleDownQuantity(idx)}>
                      {orderData.items[idx]?.quantity - 1 < 1 ? (
                        <img src={trashIcon} alt="Remove" />
                      ) : (
                        <img src={removeIcon} alt="Decrease" />
                      )}
                    </div>
                    <div className={`${styles.quantity_button} ${styles.quantity_display}`}>
                      <p>{quantitySelect[idx]}</p>
                    </div>
                    <div
                      className={`${styles.quantity_button} ${orderData.items[idx].quantity + 1 > getMaxQuantityByIdx(idx) ? styles.quantity_increase_disabled : styles.quantity_increase}`}
                      onClick={() => !(orderData.items[idx].quantity + 1 > getMaxQuantityByIdx(idx)) && handleUpQuantity(idx)}
                    >
                      {orderData.items[idx]?.quantity + 1 > getMaxQuantityByIdx(idx) ? (
                        <img src={outOfStock} alt="Out of stock" />
                      ) : (
                        <img src={addIcon} alt="Increase" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className={`${styles.empty_cart} fade-in-up`}>
                <p>Your cart is empty</p>
              </div>
            )}
          </div>
        )}

        {/* Tổng tiền */}
        <div className={styles.summary_section}>
          <div className={styles.delivery_info}>
            <p className={styles.delivery_label}>
              Delivery fee
              <img src={deliveryIcon} alt="Delivery" />
            </p>
            <p>Free</p>
          </div>
          <hr className={styles.divider} />
          <div className={styles.total_section}>
            <p>Total</p>
            <p>{getTotal().toLocaleString('vi-VN')}đ</p>
          </div>
        </div>

        {/* Button thanh toán */}
        <div
          className={`${styles.checkout_button} ${products.length ? styles.checkout_enabled : styles.checkout_disabled}`}
          onClick={() => products.length && handleSubmit()}
        >
          <p>Checkout</p>
        </div>
      </div>
    </Drawer>
  )
}

export default ShoppingCart
