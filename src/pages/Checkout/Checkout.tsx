import editIcon from '~/assets/edit.png'
import tickIcon from '~/assets/check_2.png'
import checkIcon from '~/assets/check.png'
import zalopayLogo from '~/assets/zalopayLogo.png'
import shopeepayLogo from '~/assets/shopeepayLogo.png'
import momoLogo from '~/assets/momoLogo.png'
import QR from '~/assets/QR.png'
import visaLogo from '~/assets/visaLogo.jpg'
import jcbLogo from '~/assets/jcbLogo.jpg'
import mastercardLogo from '~/assets/mastercardLogo.jpg'
import americaexpressLogo from '~/assets/americaexpressLogo.png'
import discoverLogo from '~/assets/discoverLogo.jpg'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import '~/App.scss'
import { fetchCustomerDetailAPI } from '~/apis/customerApi'
import { fetchProductDetailsAPI, updateQuantitySold } from '~/apis/productApi'
import { useNavigate } from 'react-router-dom'
import dingSound from '~/assets/ding-sound.mp3'
import { jwtDecode } from 'jwt-decode'
import styles from './Checkout.module.scss'
import { findCartByCustomerId, updateCartAfterCheckoutAPI } from '~/apis/cartApi'
import { Product } from '~/interface/product.interface'
import { Cart } from '~/interface/cart.interface'
import { Customer } from '~/interface/customer.interface'
import { fetchCreateOrder } from '~/apis/orderApi'

function Checkout() {

  const accessToken = localStorage.getItem('accessToken')
  const token = accessToken ? jwtDecode(accessToken) as { userId: string } : null

  const [customer, setCustomer] = useState<Customer | null>(null)
  const navigate = useNavigate()
  const [isLoadingToPage, setIsLoadingToPage] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [cart, setCart] = useState<Cart | null>(null)
  const [itemsToBuy, setItemsToBuy] = useState<Product[]>([])
  const [isCheckout, setIsCheckout] = useState<'idle' | 'loading' | 'success'>('idle')
  const [updateError, setUpdateError] = useState<string | null>(null)
  const tickSound = new Audio(dingSound)
  const [infoBeforeEdit, setInfoBeforeEdit] = useState<{ name: string, phone: string, address: string } | null>(null)

  const [paymentSelect, setPaymentSelect] = useState({
    COD: false,
    QR: false,
    eWallet: false,
    credit: false
  })

  const fetchCustomer = async () => {
    if (!token) return
    const customer = await fetchCustomerDetailAPI(token.userId)
    setCustomer(customer)
    setName(`${customer?.lastName} ${customer?.firstName}`)
    setPhone(`${customer?.phone}`)
    setAddress(`${customer?.address}`)

    const cartData = await findCartByCustomerId(customer._id)
    const productsData = await Promise.all(
      cartData.items.map(async (item: any) => {
        const product = await fetchProductDetailsAPI(item.productId)
        return product
      })
    )
    setItemsToBuy(productsData)
    setCart(cartData)
  }

  const handleCheckout = async () => {
    setIsCheckout('loading')
    await Promise.all(
      itemsToBuy.map((product, idx) =>
        updateQuantitySold(product._id, cart?.items[idx].quantity || 0)
          // eslint-disable-next-line no-console
          .then(() => console.log('update quantity sold successfully'))
      ) 
    )
    const orderData = {
      ...cart,
      name: name,
      phone: phone,
      address: address,
      payment: Object.keys(paymentSelect).find(key => paymentSelect[key as keyof typeof paymentSelect] === true)
    }
    delete orderData._id
    delete orderData.createdAt
    delete orderData.updatedAt
    await fetchCreateOrder(orderData).then(async () => {
      tickSound.volume = 0.4
      tickSound.play()
      setIsCheckout('success')
      await updateCartAfterCheckoutAPI(cart?._id || '', {
        items: [],
        totalPrice: 0
      })

      setTimeout(() => {
        navigate('/profile')
      }, 1300)
    })
  }

  const handlePaymentSelect = (method: keyof typeof paymentSelect) => {
    setTimeout(() => {
      setPaymentSelect({
        COD: false,
        QR: false,
        eWallet: false,
        credit: false,
        [method]: !paymentSelect[method]
      })
    }, 100)
  }


  const handleUpdate = async () => {
    if (!address || !phone || !name) {
      setUpdateError('All fields are required.')
      return
    }
    setIsEdit(false)
    setUpdateError(null)
  }

  useEffect(() => {
    fetchCustomer()
    setTimeout(() => {
      setIsLoadingToPage(false)
    }, 700)
  }, [])

  if (isLoadingToPage) {
    return (
      <div className={styles.loading_container}>
        <div className='spinner-large'></div>
      </div>
    )
  }

  return (
    <div className={`fade-in-up ${styles.checkout_container}`}>
      <div className={styles.content_wrapper}>
        <div className={styles.header}>
          <p className={styles.order_title}>Overview</p>
        </div>
        <hr className={styles.divider} />

        <div className={styles.items_container}>
          {cart && itemsToBuy?.map((product, idx) => (
            <div className={`fade-in-up ${styles.product_item}`} key={idx}>
              <div className={styles.product_image_wrapper}>
                <img
                  src={product.colors.find(c => c.color === cart?.items[idx].color)?.imageDetail[0]}
                  alt={product.name}
                  className={styles.product_image}
                />
              </div>
              <div className={styles.product_details}>
                <p className={styles.product_name}>{product.name}</p>
                <p className={styles.product_info}>
                  {'Color: '}
                  <span
                  className={styles.info_highlight}
                  style={{
                    color: product.colors.find(c => c.color === cart?.items[idx].color)?.colorHex
                  }}
                  >
                    {cart?.items[idx].color}
                  </span>
                </p>
                <p className={styles.product_info}>
                  {'Size: '}
                  <span className={styles.info_highlight}>
                    {cart?.items[idx].size}
                  </span>
                </p>
                <p className={styles.product_info}>
                  {'Quantity: '}
                  <span className={styles.info_highlight}>
                    {cart?.items[idx].quantity}
                  </span>
                </p>
              </div>
              <div className={styles.product_price_wrapper}>
                <p className={styles.product_price}>
                  {Number(cart?.items[idx].quantity * product.price).toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.subtotal_row}>
          <p>Subtotal</p>
          <p>{cart?.totalPrice.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className={styles.delivery_row}>
          <p>Delivery</p>
          <p>Free</p>
        </div>

        <hr className={styles.divider} />

        <div className={styles.customer_info_header}>
          <p className={styles.section_title}>Customer Information</p>
          <img
            src={editIcon}
            alt="Edit"
            onClick={() => {
              setIsEdit(true)
              setInfoBeforeEdit({
                name: customer ? `${customer.lastName} ${customer.firstName}` : '',
                phone: customer ? `${customer.phone}` : '',
                address: customer ? `${customer.address}` : ''
              })
            }}
            className={styles.edit_icon}
          />
        </div>
        <div className={styles.customer_info_content}>
          <div className={styles.info_row}>
            <p className={styles.info_label}>Name:</p>
            {isEdit ? (
              <div className={`slide-from-left ${styles.text_field_wrapper}`}>
                <TextField
                  onChange={(e) => {
                    setName(e.target.value)
                    setUpdateError(null)
                  }}
                  id="filledEmail"
                  variant="filled"
                  value={name}
                  InputProps={{
                    disableUnderline: true
                  }}
                  className={styles.text_field}
                />
              </div>
            ) : (
              <p className={styles.info_value}>{name}</p>
            )}
          </div>
          <div className={styles.info_row}>
            <p className={styles.info_label}>Phone:</p>
            {isEdit ? (
              <div className={`slide-from-left ${styles.text_field_wrapper}`}>
                <TextField
                  onChange={(e) => {
                    setPhone(e.target.value)
                    setUpdateError(null)
                  }}
                  id="filledEmail"
                  type="number"
                  variant="filled"
                  value={phone}
                  InputProps={{
                    disableUnderline: true
                  }}
                  className={styles.text_field}
                />
              </div>
            ) : (
              <p className={styles.info_value}>{phone}</p>
            )}
          </div>
          <div className={styles.info_row}>
            <p className={styles.info_label}>Address:</p>
            {isEdit ? (
              <div className={`slide-from-left ${styles.text_field_wrapper}`}>
                <TextField
                  onChange={(e) => {
                    setAddress(e.target.value)
                    setUpdateError(null)
                  }}
                  id="filledEmail"
                  variant="filled"
                  value={address}
                  InputProps={{
                    disableUnderline: true
                  }}
                  className={styles.text_field}
                />
              </div>
            ) : (
              <p className={styles.info_value}>{address}</p>
            )}
          </div>
          {updateError && <p className={styles.error_message}>{updateError}</p>}
          {isEdit && (
            <div className={styles.action_buttons}>
              <p
                className={`boom-small ${styles.cancel_button}`}
                onClick={() => {
                  setIsEdit(false)
                  setName(infoBeforeEdit?.name || '')
                  setPhone(infoBeforeEdit?.phone || '')
                  setAddress(infoBeforeEdit?.address || '')
                  setInfoBeforeEdit(null)
                }}
              >Cancel</p>
              <p
                className={`boom-small ${styles.update_button}`}
                onClick={() => handleUpdate()}
              >Update</p>
            </div>
          )}
        </div>

        <hr className={styles.divider} />

        <div>
          <div className={styles.customer_info_header}>
            <p className={styles.section_title}>Payment Method</p>
          </div>
          <div className={styles.payment_method_content}>
            <div onClick={() => handlePaymentSelect('COD')} className={styles.payment_option}>
              <p>Cash on Delivery (COD)</p>
              {paymentSelect.COD ? (
                <img src={tickIcon} alt="Selected" className={`boom-small ${styles.tick_icon}`} />
              ) : (
                <div className={styles.unchecked_circle} />
              )}
            </div>
            <div onClick={() => handlePaymentSelect('eWallet')} className={styles.payment_option}>
              <p>E-Wallet</p>
              <div className={styles.wallet_logos} style={{ display: paymentSelect.eWallet ? 'flex' : 'none' }}>
                <img src={zalopayLogo} alt="ZaloPay" className={`boom ${styles.wallet_logo}`} />
                <img src={shopeepayLogo} alt="ShopeePay" className={`boom ${styles.wallet_logo}`} />
                <img src={momoLogo} alt="MoMo" className={`boom ${styles.wallet_logo}`} />
              </div>
              {paymentSelect.eWallet ? (
                <img src={tickIcon} alt="Selected" className={`boom-small ${styles.tick_icon}`} />
              ) : (
                <div className={styles.unchecked_circle} />
              )}
            </div>
            <div onClick={() => handlePaymentSelect('QR')} className={styles.payment_option}>
              <p>Bank Transfer (QR)</p>
              {paymentSelect.QR ? (
                <img src={tickIcon} alt="Selected" className={`boom-small ${styles.tick_icon}`} />
              ) : (
                <div className={styles.unchecked_circle} />
              )}
            </div>
            <div className={styles.qr_wrapper} style={{ display: paymentSelect.QR ? 'flex' : 'none' }}>
              <img src={QR} alt="QR Code" className={`boom-small ${styles.qr_image}`} />
            </div>
            <div onClick={() => handlePaymentSelect('credit')} className={styles.payment_option}>
              <p>Credit / Debit Card</p>
              <div className={styles.wallet_logos} style={{ display: paymentSelect.credit ? 'flex' : 'none' }}>
                <img src={visaLogo} alt="Visa" className={`boom ${styles.card_logo} ${styles.card_logo_visa}`} />
                <img src={jcbLogo} alt="JCB" className={`boom ${styles.card_logo} ${styles.card_logo_other}`} />
                <img src={mastercardLogo} alt="Mastercard" className={`boom ${styles.card_logo} ${styles.card_logo_other}`} />
                <img src={discoverLogo} alt="Discover" className={`boom ${styles.card_logo} ${styles.card_logo_other}`} />
                <img src={americaexpressLogo} alt="American Express" className={`boom ${styles.card_logo} ${styles.card_logo_other}`} />
              </div>
              {paymentSelect.credit ? (
                <img src={tickIcon} alt="Selected" className={`boom-small ${styles.tick_icon}`} />
              ) : (
                <div className={styles.unchecked_circle} />
              )}
            </div>
          </div>
        </div>
        <div className={styles.fixed_footer}>
          <div className={styles.total_row}>
            <p>Total</p>
            <p>{cart?.totalPrice.toLocaleString('vi-VN')}đ</p>
          </div>
          <hr className={styles.divider} />
          <div className={styles.footer_buttons}>
            <div className={styles.installment_button}>
              <p>0% interest installment payment</p>
            </div>
            <div
              onClick={() =>
                (Object.values(paymentSelect).includes(true) && !updateError) && handleCheckout()}
              className={styles.checkout_button}
              style={{
                opacity: (Object.values(paymentSelect).includes(true) && !updateError) ? 1 : 0.5
              }}
            >
              {isCheckout === 'idle' && (
                <p className={styles.checkout_text}>Checkout</p>
              )}
              {isCheckout === 'loading' && (
                <span className={`spinner-white ${styles.spinner_wrapper}`} style={{ width: '28px', height: '28px' }}></span>
              )}
              {isCheckout === 'success' && (
                <span className='boom' style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={checkIcon} alt="Success" style={{ width: '32px', height: '32px' }} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout