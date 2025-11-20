import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import OrderDetail from '~/components/OrderDetail/OrderDetail'
import '~/App.scss'
import { fetchCustomerDetailAPI } from '~/apis/customerApi'
import { fetchGetOrder } from '~/apis/orderApi'
import closeIcon from '~/assets/x-white.png'


export default function CustomerDetail({ customerId, open, onClose }) {

  const [customer, setCustomer] = useState({})
  const [ordersInCustomer, setOrdersInCustomer] = useState([])
  const [orderDetail, setOrderDetail] = useState(null)
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
    let newOrders = []
    for (const order of customer.orders) {
      if (order.status !== 'cart') {
        const data = await fetchGetOrder(order.orderId)
        newOrders.push(data)
      }
    }
    if (newOrders) setIsLoadingCustomer(false)
    setOrdersInCustomer(newOrders.reverse())
  }

  useEffect(() => {
    fetchCustomer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      className="Modal"
      open={open}
      sx={{
        overflowY: 'scroll'
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          minHeight: '100vh',
          height: 'fit-content',
          outline: 'none',
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          alignItems: 'center',
          transition: 'opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          opacity: orderDetail ? 0 : 1
        }}
      >
        <Box
          className="fade-in-up"
          onClick={(e) => e.stopPropagation()} // Ngăn click ra ngoài phần nội dung
          sx={{
            width: '85%',
            // minHeight: '100vh',
            height: isLoadingCustomer ? '100vh' : 'fit-content',
            bgcolor: 'white',
            outline: 'none',
            borderRadius: '28px',
            my: '32px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: '100px',
            py: '24px',
            pb: '64px',
            boxShadow: '4px 4px 15px rgb(138, 138, 138)',
            transition: 'opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
            opacity: orderDetail ? 0 : 1
          }}
        >
          {isLoadingCustomer ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box className='spinner-large'></Box>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column'
            }}>
              {/* Close Button */}
              <Box sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
                <Box
                  sx={{
                    bgcolor: '#333336',
                    width: '40px',
                    height: '40px',
                    borderRadius: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    mr: '-70px',
                    '&:hover svg': {
                      color: 'white',
                      transition: 'color 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
                    }
                  }}
                  onClick={onClose}
                >
                  <img src={closeIcon} style={{ width: '20px', height: '20px' }} />
                </Box>
              </Box>
              <Typography sx={{ color: 'rgba(0,0,0,.85)', fontWeight: '600', fontSize: '32px' }}>
                {`Customer #${customer.phone}`}
              </Typography>
              {/* Customer info */}
              <Box sx={{ display: 'flex', flexDirection: 'column', mt: '16px', mb: '32px', gap: 2, pl: '8px' }}>
                {/* Name */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Name:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>{customer.lastName + ' ' + customer.firstName}</Typography>
                </Box>
                {/* Dob */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Date of birth:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>{new Date(customer.dob).toLocaleDateString('vi-VN')}</Typography>
                </Box>
                {/* Email */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Email:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>{customer.email}</Typography>
                </Box>
                {/* Phone */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Phone:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>{customer.phone}</Typography>
                </Box>
                {/* Address */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Address:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>{customer.address}</Typography>
                </Box>
                {/* Country */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Address:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>{customer.country}</Typography>
                </Box>
                {/* Join Date */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Join Date:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</Typography>
                </Box>
                {/* Role */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Role:</Typography>
                  <Typography sx={{ fontSize: '16px' }}>
                    {`${customer.role?.slice(0, 1).toUpperCase()}${customer.role?.slice(1)}`}
                  </Typography>
                </Box>
                {/* isActive */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Active:</Typography>
                  <Box sx={{
                    width: '14px',
                    height: '14px',
                    bgcolor: customer.isActive ? '#3dff4c' : '#ff3232',
                    border: '1px solid rgb(141, 141, 141)',
                    borderRadius: '16px'
                  }}></Box>
                </Box>

                <hr style={{
                  width: '100%',
                  border: 'none',
                  borderTop: '1px solid #ccc',
                  margin: '4px auto'
                }} />

                {/* Product Order */}
                <Box>
                  {ordersInCustomer.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Orders History: </Typography>
                      {ordersInCustomer?.map((order, idx) => (
                        <Box
                          onClick={() => {
                            setOrderDetail(order._id)
                            // onClose()
                          }}
                          className='fade-in-up'
                          key={idx}
                          sx={{
                            display: 'flex',
                            height: 'fit-content',
                            gap: 2,
                            bgcolor: '#f6f6f6',
                            p: '20px',
                            borderRadius: '16px',
                            transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                            '&:hover': {
                              cursor: 'pointer',
                              transform: 'scale(1.02)',
                              boxShadow: '3px 3px 15px #ddd'
                            }
                          }}
                        >
                          {/* Img and quatity */}
                          <Box
                            sx={{
                              // flex: 2,
                              display: 'flex',
                              gap: 1,
                              width: '110px',
                              height: '110px',
                              flexWrap: 'wrap'
                            }}
                          >
                            {order.items.slice(0, 4).map((product, idx) => (
                              <img
                                key={idx}
                                src={product.image}
                                style={{
                                  width: order.items.length === 1 ? '100%' : '50px',
                                  height: order.items.length === 1 ? '100%' : '50px',
                                  objectFit: 'cover',
                                  borderRadius: '8px'
                                }}
                              />
                            ))}
                          </Box>
                          {/* Name & color & size */}
                          <Box
                            sx={{
                              flex: 5,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.5
                            }}
                          >
                            <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>
                              Order #{order._id.slice(0, order._id.length / 2)}
                            </Typography>
                            <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                              {'Status: '}
                              <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: statusColors[order.status] }} >
                                {order.status}
                              </span>
                            </Typography>
                            <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                              {'Address: '}
                              <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: 'black' }}>
                                {order.address}
                              </span>
                            </Typography>
                          </Box>
                          {/* Total and Time*/}
                          <Box
                            sx={{
                              flex: 3,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              alignItems: 'end'
                            }}
                          >
                            <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>
                              {(Number(order.totalPrice)).toLocaleString('vi-VN')}đ
                            </Typography>
                            <Typography sx={{
                              fontSize: '14px',
                              fontWeight: '600',
                              fontStyle: 'italic',
                              color: 'rgba(0,0,0,.45)'
                            }}>
                              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>


            </Box>
          )}
          {orderDetail && (
            <OrderDetail open={Boolean(orderDetail)} onClose={() => setOrderDetail(null)} orderId={orderDetail} />
          )}
        </Box>
      </Box >
    </Modal >
  )
}
