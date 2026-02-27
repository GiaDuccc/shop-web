/* eslint-disable no-console */
import Drawer from '@mui/material/Drawer'
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
import { findCartByCustomerId, updateCartAPI } from '~/apis/clientAPI/cartApi'
import { fetchCustomerDetailAPI } from '~/apis/clientAPI/customerApi'
import { fetchProductDetailsAPI } from '~/apis/clientAPI/productApi'
import { Cart } from '~/interface/cart.interface'
import { Product } from '~/interface/product.interface'

interface ShoppingCartProps {
  open: boolean
  toggleDrawer: () => void
}

function ShoppingCart({ open, toggleDrawer }: ShoppingCartProps) {

  const accessToken = localStorage.getItem('accessTokenClient')
  const token = accessToken ? jwtDecode(accessToken) as { sub: string } : null

  const [customer, setCustomer] = useState(null)

  const [cartData, setCartData] = useState<Cart | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const getMaxQuantityByIdx = (idx: number) => {
    if (!cartData || products.length === 0 || !products[idx]) return 0
    const colorMatch = products[idx].colors.find(c => c?.color === cartData.items[idx]?.color)
    if (!colorMatch) return 0
    const sizeMatch = colorMatch.sizes.find(s => s.size === cartData.items[idx].size)
    return sizeMatch ? sizeMatch.quantity : 0
  }

  const getTotal = () => {
    if (!cartData) return 0
    let sum = 0
    cartData.items.forEach((item) => {
      const product = products.find(p => p._id === item.productId)
      if (product) {
        sum += item.quantity * product.price
      }
    })
    return sum
  }

  const handleUpQuantity = async (idx: number) => {
    if (!cartData) return
    const availableQuantity = getMaxQuantityByIdx(idx) || 0
    if (cartData.items[idx].quantity + 1 > availableQuantity) {
      return
    } else {
      const newCart = { ...cartData }
      newCart.items[idx].quantity += 1
      setCartData(newCart)
      await updateCartAPI(cartData._id, { items: newCart.items })

      // Assuming there's an API to update, but since it's commented, maybe just update local state
      // await increaseQuantityAPI(cartData._id, cartData.items[idx])
    }
  }

  const handleDownQuantity = async (idx: number) => {
    if (!cartData) return
    const newCart = { ...cartData }
    const newProducts = [...products]

    if (!newCart.items || !newCart.items[idx]) return

    // Nếu số lượng = 1 thì xoá luôn sản phẩm
    if (newCart.items[idx].quantity === 1) {
      newCart.items.splice(idx, 1)
      newProducts.splice(idx, 1)
    } else {
      newCart.items[idx].quantity -= 1
    }

    setCartData(newCart)
    setProducts(newProducts)
    await updateCartAPI(newCart._id, { items: newCart.items })
  }

  const handleSubmit = () => {
    navigate('/checkout')
  }

  useEffect(() => {
    const fetchData = async () => {

      if (!token) return

      const customer = await fetchCustomerDetailAPI(token.sub)
      setCustomer(customer)

      const cart = await findCartByCustomerId(token.sub)

      let productsData = []
      if (cart.items.length > 0) {
        productsData = await Promise.all(
          cart.items.map(async (item: any) => {
            const product = await fetchProductDetailsAPI(item.productId)
            return product
          })
        )
      }

      setCartData(cart)
      sessionStorage.setItem('cart', JSON.stringify(cart))
      setProducts(productsData)
      setIsLoading(false)
    }

    if (open) { // chỉ fetchData khi mở cart
      setIsLoading(true)
      fetchData()
    }
  }, [open])

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
      {!token && !customer ? (
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
      ) : (
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
              {products.length > 0 && cartData ? products?.map((product, idx) => (
                <div className={`${styles.product_item} fade-in-up`} key={idx}>
                  {/* Img and quatity */}
                  <div className={styles.product_image_section}>
                    <img
                      src={product.colors.find(item => item.color === cartData.items[idx].color)?.imageDetail[0]}
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
                        color: product.colors.find(color => color.color === cartData.items[idx].color)?.colorHex || '#000'
                      }}>
                        {cartData.items[idx]?.color.slice(0, 1).toUpperCase() + cartData.items[idx]?.color.slice(1)}
                      </span>
                    </p>
                    <p className={styles.product_size}>
                      {'Size: '}
                      <span>
                        {cartData.items[idx]?.size}
                      </span>
                    </p>
                  </div>
                  {/* Total and Quantity*/}
                  <div className={styles.product_actions}>
                    <p className={styles.product_total}>
                      {(Number(cartData.items[idx].quantity) * Number(products[idx].price)).toLocaleString('vi-VN')}đ
                    </p>
                    <div className={styles.quantity_control}>
                      <div className={`${styles.quantity_button} ${styles.quantity_decrease}`} onClick={() => handleDownQuantity(idx)}>
                        {cartData.items[idx]?.quantity === 1 ? (
                          <img src={trashIcon} alt="Remove" />
                        ) : (
                          <img src={removeIcon} alt="Decrease" />
                        )}
                      </div>
                      <div className={`${styles.quantity_button} ${styles.quantity_display}`}>
                        <p>{cartData.items[idx].quantity}</p>
                      </div>
                      <div
                        className={`${styles.quantity_button} ${cartData.items[idx].quantity === getMaxQuantityByIdx(idx) ? styles.quantity_increase_disabled : styles.quantity_increase}`}
                        onClick={() => !(cartData.items[idx].quantity === getMaxQuantityByIdx(idx)) && handleUpQuantity(idx)}
                      >
                        {cartData.items[idx].quantity === getMaxQuantityByIdx(idx) ? (
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
      )}
    </Drawer>
  )
}

export default ShoppingCart