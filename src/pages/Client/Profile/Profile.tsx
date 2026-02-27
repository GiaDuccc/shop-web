import Header from '~/components/Header/Header'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'
import editIcon from '~/assets/edit.png'
import logOutIcon from '~/assets/logout.png'
import moreIcon from '~/assets/3dot.png'
import { useEffect, useState } from 'react'
import { fetchCustomerDetailAPI, updateCustomer } from '~/apis/clientAPI/customerApi'
import { getCustomerOrdersAPI } from '~/apis/clientAPI/orderApi'
import { signOutAPI } from '~/apis/clientAPI/authApi'
import { fetchProductDetailsAPI } from '~/apis/clientAPI/productApi'
import OrderDetail from '~/components/OrderDetail/OrderDetailClient'
import '~/App.scss'
import warningIcon from '~/assets/danger.png'
import Footer from '~/components/Footer/Footer'
import { jwtDecode } from 'jwt-decode'
import styles from './Profile.module.scss'
import { useForm, Controller } from 'react-hook-form'
import { Order } from '~/interface/order.interface'
import { Customer } from '~/interface/customer.interface'

interface FormData {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  address: string;
}

export default function Profile() {

  const navigate = useNavigate()

  const [orders, setOrders] = useState<Order[]>([])
  const [customer, setCustomer] = useState<Customer>({} as Customer)
  const [orderDetail, setOrderDetail] = useState<string | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const token = localStorage.getItem('accessTokenClient');

  let user: { sub: string } | null = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      user = null; // token invalid → để FE tự gọi API và refresh lại
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/sign-in')
      return
    }
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update form default values when customer data changes
  useEffect(() => {
    if (customer && Object.keys(customer).length > 0) {
      reset({
        lastName: customer.lastName || '',
        firstName: customer.firstName || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || ''
      })
    }
  }, [customer])



  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      lastName: '',
      firstName: '',
      email: '',
      phone: '',
      address: ''
    }
  })

  const fetchOrders = async () => {
    setIsLoadingOrder(true)
    const customer = await fetchCustomerDetailAPI(user?.sub || '')
    setCustomer(customer)

    const orders = await getCustomerOrdersAPI(user?.sub || '')

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

    setOrders(allOrderItems.reverse().slice(0, 10))
    setIsLoadingOrder(false)
  }

  function getCountryName(code: string) {
    if (!code) return
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
    return regionNames.of(code.toUpperCase()) || code
  }

  const statusColors: Record<string, string> = {
    pending: '#ffa706',
    processing: '#0066ff',
    shipped: '#0066ff',
    delivering: '#0066ff',
    delivered: '#4cd137',
    completed: '#4cd137',
    canceled: '#ff4f4f'
  }

  const signOut = async () => {
    await signOutAPI()
      .then(() => {
        localStorage.removeItem('accessTokenClient')
        navigate('/sign-in')
      })
      .catch(error => {
        console.error('Logout error:', error)
      })
  }

  const handleUpdateInfo = async (formData: FormData) => {
    const changedFields: Partial<FormData> = {};

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      if (formData[key] !== customer[key]) {
        changedFields[key] = formData[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      setIsEdit(false);
      return;
    }

    try {
      await updateCustomer(customer._id, changedFields);
      setIsEdit(false);
      fetchOrders();
    } catch (error) {
      console.error("Update customer error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      {/* Content */}
      <div className={`${styles.content} fade-in-up`}>
        <div className={styles.contentHeader}>
          <p className={styles.customerId}>
            {`Customer #${customer?.phone}`}
          </p>
          <div className={styles.buttonFeature}>
            {/* Edit */}
            <div
              onClick={() => {
                setIsEdit(!isEdit)
                if (!isEdit) {
                  // Reset form to current customer values when entering edit mode
                  reset({
                    lastName: customer.lastName || '',
                    firstName: customer.firstName || '',
                    email: customer.email || '',
                    phone: customer.phone || '',
                    address: customer.address || ''
                  })
                }
              }}
              className={`${styles.button}`}
            >
              <p>{isEdit ? 'Cancel' : 'Edit'}</p>
              {/* <SettingsIcon sx={{ fontSize: '16px' }} /> */}
              <div className='width-18px height-18px position-relative'>
                <img className={styles.buttonIcon} src={editIcon} />
                {isEdit && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 9,
                      left: -2,
                      width: '22px',
                      height: '1px',
                      backgroundColor: 'red',
                      transform: 'rotate(45deg)'
                    }}
                  />
                )}
              </div>
            </div>
            {/* Log Out */}
            <div
              onClick={() => signOut()}
              className={styles.button}
            >
              <p>Log Out</p>
              <img className={styles.buttonIcon} src={logOutIcon} />
            </div>
          </div>
        </div>
        {/* Divider */}
        <hr className={styles.divider} />
        {/* User Detail */}
        <div className={styles.userDetailWrapper}>
          {isEdit ? (
            <form onSubmit={handleSubmit(handleUpdateInfo)} className={styles.userDetailEdit}>
              {/* Last Name */}
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Last Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="lastName"
                    className={errors.lastName ? 'shake' : ''}
                    label={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {errors.lastName && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                        {errors.lastName ? errors.lastName.message : 'Last Name'}
                      </span>
                    }
                    variant="filled"
                    error={!!errors.lastName}
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: '100%',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        border: errors.lastName ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: errors.lastName ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: errors.lastName ? 'rgb(184, 53, 53)' : '#666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: errors.lastName ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                      }
                    }}
                  />
                )}
              />

              {/* First Name */}
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'First Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="firstName"
                    className={errors.firstName ? 'shake' : ''}
                    label={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {errors.firstName && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                        {errors.firstName ? errors.firstName.message : 'First Name'}
                      </span>
                    }
                    variant="filled"
                    error={!!errors.firstName}
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: '100%',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        border: errors.firstName ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: errors.firstName ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: errors.firstName ? 'rgb(184, 53, 53)' : '#666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: errors.firstName ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                      }
                    }}
                  />
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    type="email"
                    className={errors.email ? 'shake' : ''}
                    label={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {errors.email && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                        {errors.email ? errors.email.message : 'Email'}
                      </span>
                    }
                    variant="filled"
                    error={!!errors.email}
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: '100%',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        border: errors.email ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: errors.email ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: errors.email ? 'rgb(184, 53, 53)' : '#666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: errors.email ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                      }
                    }}
                  />
                )}
              />

              {/* Phone */}
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Phone is required',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Phone must be 10-11 digits'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="phone"
                    className={errors.phone ? 'shake' : ''}
                    label={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {errors.phone && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                        {errors.phone ? errors.phone.message : 'Phone'}
                      </span>
                    }
                    variant="filled"
                    error={!!errors.phone}
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: '100%',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        border: errors.phone ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: errors.phone ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: errors.phone ? 'rgb(184, 53, 53)' : '#666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: errors.phone ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                      }
                    }}
                  />
                )}
              />

              {/* Address */}
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="address"
                    className={errors.address ? 'shake' : ''}
                    label={
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {errors.address && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                        {errors.address ? errors.address.message : 'Address'}
                      </span>
                    }
                    variant="filled"
                    error={!!errors.address}
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: '100%',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        border: errors.address ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: errors.address ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: errors.address ? 'rgb(184, 53, 53)' : '#666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: errors.address ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                      }
                    }}
                  />
                )}
              />

              {/* Update Button */}
              <button
                type="submit"
                disabled={!isDirty || !isValid}
                className={`${styles.submitButton} ${(!isDirty || !isValid) ? styles.disabled : ''}`}
              >
                <p>Update</p>
              </button>
            </form>
          ) : (
            <div className={styles.userDetailView}>
              <div className={styles.infoRow}>
                <p className={styles.label}>Name:</p>
                <p className={styles.value}>{customer?.lastName + ' ' + customer?.firstName}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.label}>Date of Birth:</p>
                <p className={styles.value}>{customer?.dob ? new Date(customer.dob).toLocaleDateString('vi-VN') : 'N/A'}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.label}>Email:</p>
                <p className={styles.value}>{customer?.email}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.label}>Phone:</p>
                <p className={styles.value}>{customer?.phone}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.label}>Address:</p>
                <p className={styles.value}>{customer?.address}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.label}>Country:</p>
                <p className={styles.value}>{customer?.country ? getCountryName(customer.country) : 'N/A'}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.label}>Join date:</p>
                <p className={styles.value}>{customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
              </div>
              <div className={styles.infoRow}>
                <p className={styles.label}>Active:</p>
                <div className={`${styles.activeIndicator} ${customer?.isActive ? styles.active : styles.inactive}`}></div>
              </div>
            </div>
          )}
          <p className={styles.sectionTitle}>Orders History: </p>
          {isLoadingOrder && (
            <div className={styles.loadingWrapper}>
              <div className='spinner-large'></div>
            </div>
          )}
          {/* Order history */}
          {(orders.length > 0 && !isLoadingOrder) && (
            <div className={styles.ordersContainer}>
              {orders?.map((order, index) => (
                <div
                  onClick={() => setOrderDetail(order._id)}
                  className={`fade-in-up ${styles.orderCard}`}
                  key={index}
                >
                  {/* Img and quatity */}
                  <div className={styles.orderImages}>
                    {order.items.length > 4 ? (
                      <>
                        {order.items.slice(0, 3).map((product, idx) => (
                          <img
                            key={idx}
                            src={product.adImage}
                            className={order.items.length === 1 ? styles.singleImage : styles.multipleImage}
                            alt="product"
                          />
                        ))}
                        <div className={styles.moreImages}>
                          <img src={moreIcon} alt="more" />
                        </div>
                      </>
                    ) : order.items.slice(0, 4).map((product, idx) => (
                      <img
                        key={idx}
                        src={product.adImage}
                        className={order.items.length === 1 ? styles.singleImage : styles.multipleImage}
                        alt="product"
                      />
                    ))
                    }
                  </div>
                  {/* Name & color & size */}
                  <div className={styles.orderInfo}>
                    <p className={styles.orderId}>
                      Order #{order._id}
                    </p>
                    <p className={styles.orderStatus}>
                      {'Status: '}
                      <span className={styles.statusValue} style={{ color: statusColors[order.status] }}>
                        {order.status}
                      </span>
                    </p>
                    <p className={styles.orderAddress}>
                      {'Address: '}
                      <span className={styles.addressValue}>
                        {order.address}
                      </span>
                    </p>
                  </div>
                  {/* Total and Time*/}
                  <div className={styles.orderPrice}>
                    <p className={styles.totalPrice}>
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
      <Footer />

      {orderDetail && (
        <OrderDetail open={Boolean(orderDetail)} onClose={() => setOrderDetail(null)} orderId={orderDetail} />
      )}
    </div>
  )
}