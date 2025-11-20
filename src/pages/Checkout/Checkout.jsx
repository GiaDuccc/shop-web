import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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
import { fetchCustomerDetailAPI, updateOrderInCustomer } from '~/apis/customerApi'
import { addInformationToOrderAPI, fetchGetOrder, updatedOrderAPI } from '~/apis/orderApi'
import { updateQuantitySold } from '~/apis/productApi'
import { useNavigate } from 'react-router-dom'
import dingSound from '~/assets/ding-sound.mp3'
import { jwtDecode } from 'jwt-decode'

function Checkout() {

  const accessToken = localStorage.getItem('accessToken')
  const token = accessToken ? jwtDecode(accessToken) : null

  const [customer, setCustomer] = useState(null)
  const navigate = useNavigate()
  const [isLoadingToPage, setIsLoadingToPage] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const [name, setName] = useState(null)
  const [phone, setPhone] = useState(null)
  const [address, setAddress] = useState(null)
  const [itemsToBuy, setItemsToBuy] = useState([])
  const [isCheckout, setIsCheckout] = useState('idle')
  const tickSound = new Audio(dingSound)


  const [infoBeforeEdit, setInfoBeforeEdit] = useState({})

  const [paymentSelect, setPaymentSelect] = useState({
    COD: false,
    QR: false,
    eWallet: false,
    credit: false
  })

  const getTotal = () => {
    let sum = 0
    itemsToBuy.forEach(product => {
      sum += Number(product.quantity) * Number(product.price)
    })
    return sum
  }

  const fetchCustomer = async () => {
    const customer = await fetchCustomerDetailAPI(token.userId)
    setCustomer(customer)
    setName(`${customer?.lastName} ${customer?.firstName}`)
    setPhone(`${customer?.phone}`)
    setAddress(`${customer?.address}`)

    const updateData = async () => {
      let newData = {
        name: `${customer?.lastName} ${customer?.firstName}`,
        phone: `${customer?.phone}`,
        address: `${customer?.address}`
      }

      const order = await fetchGetOrder(customer?.orders[customer?.orders.length - 1].orderId)

      setItemsToBuy(order.items)

      await addInformationToOrderAPI(customer?.orders[customer?.orders.length - 1].orderId, newData).then(data => {
        setName(data.name)
        setPhone(data.phone)
        setAddress(data.address)
      })
    }
    updateData()
  }

  const handleCheckout = async () => {
    setIsCheckout('loading')
    await Promise.all(
      itemsToBuy.map((product) =>
        updateQuantitySold(product.productId, product.quantity)
          // eslint-disable-next-line no-console
          .then(() => console.log('update thành công'))
      )
    )
    await updatedOrderAPI(customer.orders[customer.orders.length - 1].orderId, getTotal(), Object.entries(paymentSelect).find(([, value]) => value)?.[0])
    await updateOrderInCustomer(customer._id, customer.orders[customer.orders.length - 1].orderId).then(() => {
      setTimeout(() => {
        tickSound.volume = 0.4
        tickSound.play()
        setIsCheckout('success')

        setTimeout(() => {
          navigate('/profile')
        }, 1300)
      }, 500)
    })
  }

  const handlePaymentSelect = (method) => {
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
    if (address === 'Unknown' || !address) {
      setAddress('address is required')
      return
    }
    const data = {
      name: name,
      phone: phone,
      address: address
    }
    await addInformationToOrderAPI(customer.orders[customer.orders.length - 1].orderId, data).then(data => {
      setName(data.name)
      setPhone(data.phone)
      setAddress(data.address)
    })
    setIsEdit(false)
  }

  useEffect(() => {
    fetchCustomer()
    setTimeout(() => {
      setIsLoadingToPage(false)
    }, 700)
  }, [])

  if (isLoadingToPage) {
    return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Box className='spinner-large'></Box>
    </Box>)
  }

  return (
    <Container disableGutters maxWidth={false} className='fade-in-up' sx={{
      bgcolor: 'white',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      pb: '200px'
    }}>
      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', mx: 'auto', mt: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ color: 'rgba(0,0,0,.85)', fontWeight: '600', fontSize: '32px' }}>
            {`Order #${customer?.orders[customer?.orders.length - 1].orderId.slice(0, customer?.orders[customer?.orders.length - 1].orderId.length / 2)}`}
          </Typography>
        </Box>
        <hr style={{
          width: '100%',
          border: 'none',
          borderTop: '1px solid #ccc',
          margin: '4px auto'
        }} />

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: '32px',
          mb: '12px',
          maxHeight: '550px',
          height: 'fit-content',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}>
          {itemsToBuy?.map((product, idx) => (
            <Box
              className='fade-in-up'
              key={idx}
              sx={{
                display: 'flex',
                height: 'fit-content',
                gap: 2,
                bgcolor: '#f6f6f6',
                p: '20px',
                borderRadius: '16px'
              }}
            >
              {/* Img and quatity */}
              <Box
                sx={{
                  flex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  maxWidth: 'fit-content'
                }}
              >
                <img
                  src={product.image}
                  style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
              {/* Name & color & size */}
              <Box
                sx={{
                  flex: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.1
                }}
              >
                <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>{product.name}</Typography>
                {/* <Typography sx={{ fontSize: '16px', color: '#696969' }}>{product.type.slice(0, 1).toUpperCase() + product.type.slice(1)}</Typography> */}
                <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                  {'Color: '}
                  <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: 'black' }} >
                    {product.color}
                  </span>
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                  {'Size: '}
                  <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: 'black' }}>
                    {product.size}
                  </span>
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                  {'Quantity: '}
                  <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: 'black' }}>
                    {product.quantity}
                  </span>
                </Typography>
              </Box>
              {/* Total and Quantity*/}
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
                  {(Number(product.price * product.quantity)).toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
            </Box>
          ))}
          {/* Subtotal */}
        </Box>
        <Box sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          mx: '20px',
          '& p': {
            fontSize: '20px',
            fontWeight: '600'
          }
        }}>
          <Typography>Subtotal</Typography>
          <Typography>{getTotal().toLocaleString('vi-VN')}đ</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          m: '12px 20px',
          '& p': {
            color: 'rgba(0,0,0,.5)',
            fontSize: '20px',
            fontWeight: '600'
          }
        }}>
          <Typography>Delivery</Typography>
          <Typography>Free</Typography>
        </Box>

        <hr style={{
          width: '100%',
          border: 'none',
          borderTop: '1px solid #ccc',
          margin: '4px auto'
        }} />

        {/* User Detail */}
        < Box sx={{
          mt: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>Customer Information</Typography>
          <Box
            component="img"
            src={editIcon}
            alt="Edit"
            onClick={() => {
              setIsEdit(true)
              setInfoBeforeEdit({
                name: name,
                phone: phone,
                address: address
              })
            }}
            sx={{
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 0.5
              }
            }}
          />

        </Box>
        {/* Customer info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: '16px', mb: '32px', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: '8px' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: '600', minWidth: '70px' }}>Name:</Typography>
            {isEdit ? (
              <Box className='slide-from-left' sx={{ flex: 1 }}>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  // onBlur={() => handleError('email', values.email.value, 'Email')}
                  id="filledEmail"
                  variant="filled"
                  value={name}
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
                      border: '2px solid rgb(170, 170, 170)',
                      p: 0,
                      '&.Mui-focused': {
                        border: '2px solid rgba(0, 0, 0, 0.65)',
                        borderRadius: '16px',
                        backgroundColor: 'white'
                      },
                      '& input:-webkit-autofill': {
                        borderRadius: '16px'
                      }
                    },
                    '& .MuiFilledInput-input': {
                      padding: '8px 16px' // hoặc '0' nếu bạn muốn bỏ hết
                    },
                    '& .MuiInputLabel-root': {
                      color: '#666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(0,0,0,.85)'
                    }
                  }}
                />
              </Box>
            ) : (
              <Typography sx={{ fontSize: '16px' }}>{name}</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: '8px' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: '600', minWidth: '70px' }}>Phone:</Typography>
            {isEdit ? (
              <Box className='slide-from-left' sx={{ flex: 1 }}>
                <TextField
                  onChange={(e) => setPhone(e.target.value)}
                  // onBlur={() => handleError('email', values.email.value, 'Email')}
                  id="filledEmail"
                  type="number"
                  variant="filled"
                  value={phone}
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
                      border: '2px solid rgb(170, 170, 170)',
                      p: 0,
                      '&.Mui-focused': {
                        border: '2px solid rgba(0, 0, 0, 0.65)',
                        borderRadius: '16px',
                        backgroundColor: 'white'
                      },
                      '& input:-webkit-autofill': {
                        borderRadius: '16px'
                      }
                    },
                    '& .MuiFilledInput-input': {
                      padding: '8px 16px' // hoặc '0' nếu bạn muốn bỏ hết
                    },
                    '& .MuiInputLabel-root': {
                      color: '#666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(0,0,0,.85)'
                    },
                    '& input::-webkit-outer-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0
                    },
                    '& input::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0
                    },
                    '& input[type=number]': {
                      MozAppearance: 'textfield'
                    }
                  }}
                />
              </Box>
            ) : (
              <Typography sx={{ fontSize: '16px' }}>{phone}</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: '8px' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>Address:</Typography>
            {isEdit ? (
              <Box className='slide-from-left' sx={{ flex: 1 }}>
                <TextField
                  onChange={(e) => setAddress(e.target.value)}
                  // onBlur={() => handleError('email', values.email.value, 'Email')}
                  id="filledEmail"
                  variant="filled"
                  value={address}
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
                      border: '2px solid rgb(170, 170, 170)',
                      p: 0,
                      '&.Mui-focused': {
                        border: '2px solid rgba(0, 0, 0, 0.65)',
                        borderRadius: '16px',
                        backgroundColor: 'white'
                      },
                      '& input:-webkit-autofill': {
                        borderRadius: '16px'
                      }
                    },
                    '& .MuiFilledInput-input': {
                      padding: '8px 16px' // hoặc '0' nếu bạn muốn bỏ hết
                    },
                    '& .MuiInputLabel-root': {
                      color: '#666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'rgba(0,0,0,.85)'
                    }
                  }}
                />
              </Box>
            ) : (
              <Typography sx={{ fontSize: '16px' }}>{address}</Typography>
            )}
          </Box>
          {isEdit && (
            <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
              <Typography
                className='boom-small'
                onClick={() => {
                  setIsEdit(false)
                  setAddress(infoBeforeEdit.address)
                  setName(infoBeforeEdit.name)
                  setPhone(infoBeforeEdit.phone)
                  setInfoBeforeEdit({})
                }}
                sx={{
                  fontSize: '16px',
                  fontWeight: '600',
                  bgcolor: '#e1e1e1',
                  color: '#000000',
                  p: '6px 24px',
                  borderRadius: '12px',
                  transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    cursor: 'pointer'
                  }
                }}>Cancel</Typography>
              <Typography
                className='boom-small'
                onClick={() => handleUpdate()}
                sx={{
                  fontSize: '16px',
                  fontWeight: '600',
                  bgcolor: '#000000',
                  color: '#ffffff',
                  p: '6px 24px',
                  borderRadius: '12px',
                  transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    cursor: 'pointer'
                  }
                }}>Update</Typography>
            </Box>
          )}
        </Box>

        <hr style={{
          width: '100%',
          border: 'none',
          borderTop: '1px solid #ccc',
          margin: '4px auto'
        }} />

        {/* payment method */}
        <Box>
          < Box sx={{
            mt: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography sx={{ fontSize: '24px', fontWeight: '600' }}>Payment Method</Typography>
          </Box>
          {/* payment method content */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: '8px' }}>
            {/* COD */}
            <Box
              onClick={() => handlePaymentSelect('COD')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '48px',
                px: '8px',
                borderRadius: '12px',
                transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                '& p': {
                  fontSize: '16px'
                },
                '&:hover': {
                  bgcolor: '#efefef',
                  cursor: 'pointer'
                }
              }}>
              <Typography>Cash on Delivery (COD)</Typography>
              {paymentSelect.COD ? (
                <Box
                  className='boom-small'
                  component="img"
                  src={tickIcon}
                  sx={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              ) : (
                <Box sx={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '20px',
                  border: '1px solid #999999'
                }} />
              )}
            </Box>
            {/* E-wallet */}
            <Box
              onClick={() => handlePaymentSelect('eWallet')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '48px',
                px: '8px',
                borderRadius: '12px',
                transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                '& p': {
                  fontSize: '16px'
                },
                '&:hover': {
                  bgcolor: '#efefef',
                  cursor: 'pointer'
                }
              }}>
              <Typography>E-Wallet</Typography>
              <Box sx={{ height: '100%', display: paymentSelect.eWallet ? 'flex' : 'none', alignItems: 'center', gap: 1, flex: 1, ml: '16px' }}>
                <Box
                  className='boom'
                  component="img"
                  src={zalopayLogo}
                  sx={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
                <Box
                  className='boom'
                  component="img"
                  src={shopeepayLogo}
                  sx={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
                <Box
                  className='boom'
                  component="img"
                  src={momoLogo}
                  sx={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
              </Box>
              {paymentSelect.eWallet ? (
                <Box
                  className='boom-small'
                  component="img"
                  src={tickIcon}
                  sx={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              ) : (
                <Box sx={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '20px',
                  border: '1px solid #999999'
                }} />
              )}
            </Box>
            {/* Bank transfer */}
            <Box
              onClick={() => handlePaymentSelect('QR')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '48px',
                px: '8px',
                borderRadius: '12px',
                transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                '& p': {
                  fontSize: '16px'
                },
                '&:hover': {
                  bgcolor: '#efefef',
                  cursor: 'pointer'
                }
              }}>
              <Typography>Bank Transfer (QR)</Typography>
              {paymentSelect.QR ? (
                <Box
                  className='boom-small'
                  component="img"
                  src={tickIcon}
                  sx={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              ) : (
                <Box sx={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '20px',
                  border: '1px solid #999999'
                }} />
              )}
            </Box>
            <Box sx={{
              display: paymentSelect.QR ? 'flex' : 'none',
              justifyContent: 'center',
              py: '8px',
              height: paymentSelect.QR ? 'fit-content' : '0px',
              transition: 'all 2s cubic-bezier(0.42, 0, 0.58, 1)',
              overflow: 'hidden'
            }}>
              <Box
                className='boom-small'
                component="img"
                src={QR}
                sx={{
                  width: '120px',
                  height: '120px'
                }}
              />
            </Box>
            {/* Credit and Debit */}
            <Box
              onClick={() => handlePaymentSelect('credit')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '48px',
                px: '8px',
                borderRadius: '12px',
                transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                '& p': {
                  fontSize: '16px'
                },
                '&:hover': {
                  bgcolor: '#efefef',
                  cursor: 'pointer'
                }
              }}>
              <Typography>Credit / Debit Card</Typography>
              <Box sx={{ height: '100%', display: paymentSelect.credit ? 'flex' : 'none', alignItems: 'center', gap: 1, flex: 1, ml: '16px' }}>
                <Box
                  className='boom'
                  component="img"
                  src={visaLogo}
                  sx={{
                    width: '36px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
                <Box
                  className='boom'
                  component="img"
                  src={jcbLogo}
                  sx={{
                    width: '34px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
                <Box
                  className='boom'
                  component="img"
                  src={mastercardLogo}
                  sx={{
                    width: '34px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
                <Box
                  className='boom'
                  component="img"
                  src={discoverLogo}
                  sx={{
                    width: '34px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
                <Box
                  className='boom'
                  component="img"
                  src={americaexpressLogo}
                  sx={{
                    width: '34px',
                    height: '28px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
              </Box>
              {paymentSelect.credit ? (
                <Box
                  className='boom-small'
                  component="img"
                  src={tickIcon}
                  sx={{
                    width: '20px',
                    height: '20px'
                  }}
                />
              ) : (
                <Box sx={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '20px',
                  border: '1px solid #999999'
                }} />
              )}
            </Box>
          </Box>
        </Box>
        {/* Button */}
        <Box sx={{ position: 'fixed', bottom: 0, width: '50%', zIndex: 999, bgcolor: '#fff', pt: '16px' }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            '& p': {
              fontSize: '30px',
              fontWeight: '600'
            }
          }}>
            <Typography>Total</Typography>
            <Typography>{getTotal().toLocaleString('vi-VN')}đ</Typography>
          </Box>
          <hr style={{
            width: '100%',
            border: 'none',
            borderTop: '1px solid #ccc',
            margin: '4px auto'
          }} />
          <Box sx={{
            display: 'flex',
            gap: 2,
            my: '16px',
            '& div': {
              flex: 1,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
              height: '48px'
            },
            '& div:hover': {
              cursor: 'pointer',
              transform: 'scale(1.02)'
            },
            '& p': {
              fontSize: '18px', fontWeight: '600'
            }
          }}>
            <Box sx={{ bgcolor: '#e1e1e1' }}>
              <Typography>0% interest installment payment</Typography>
            </Box>
            <Box
              onClick={() =>
                (Object.values(paymentSelect).includes(true) && address !== 'Unknown') && handleCheckout()
              }
              sx={{
                bgcolor: '#000',
                opacity: (Object.values(paymentSelect).includes(true) && address !== 'Unknown') ? 1 : .5
              }}>
              {isCheckout === 'idle' && (
                <Typography sx={{ color: '#fff' }}>Checkout</Typography>
              )}
              {isCheckout === 'loading' && (
                <span className='spinner-white' style={{ width: '28px', height: '28px' }}></span>
              )}
              {isCheckout === 'success' && (
                <span className='boom' style={{ display: 'flex', alignItems: 'center' }} >
                  <img src={checkIcon} style={{ width: '32px', height: '32px' }} />
                </span>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container >
  )
}

export default Checkout