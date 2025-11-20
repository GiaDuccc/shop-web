import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import closeIcon from '~/assets/x-white.png'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import '~/App.scss'
import checkIcon from '~/assets/check.png'
import heartIcon from '~/assets/heart-outline.png'
import heartColorIcon from '~/assets/heart-color.png'
import dingSound from '~/assets/ding-sound.mp3'
import tapSound from '~/assets/tap-sound.mp3'
import { addOrderToCustomer, fetchCustomerDetailAPI } from '~/apis/customerApi'
import { addProductToOrder, fetchCreateOrder } from '~/apis/orderApi'
import { jwtDecode } from 'jwt-decode'

export default function ProductCardDetail({ product, open, onClose }) {

  const accessToken = localStorage.getItem('accessToken') || null
  const user = accessToken ? jwtDecode(accessToken) : null

  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  // eslint-disable-next-line no-unused-vars
  const [productList, setProductList] = useState(
    product.colors.map((color, index) => {
      return {
        id: index,
        color: color.color.toLowerCase(),
        colorHex: color.colorHex,
        imageDetail: color.imageDetail,
        name: product.name,
        type: product.type,
        size: color.sizes.map(size => `${size.size} : ${size.quantity}`),
        stock: color.sizes.reduce((sum, item) => sum + Number(item.quantity), 0),
        price: product.price,
        highLight: product.highLight,
        desc: product.desc
      }
    })
  )

  const [activeProduct, setActiveProduct] = useState(productList[0])

  const [activeSize, setActiveSize] = useState(null)

  const [currentImage, setCurrentImage] = useState({ image: activeProduct.imageDetail[0], id: 0 })

  const tickSound = new Audio(dingSound)
  const addFavouriteSound = new Audio(tapSound)
  const [addProductStatus, setAddProductStatus] = useState('idle')
  const [addFavouriteStatus, setAddFavouriteStatus] = useState(false)


  const handleClose = () => {
    const currentParams = Object.fromEntries(searchParams.entries())
    delete currentParams.product
    delete currentParams.active
    setSearchParams(currentParams, { replace: false })
    onClose()
  }

  const handleAddToCart = async () => {
    setAddProductStatus('loading')
    if (!user) navigate('/sign-in')
    const productData = {
      productId: product._id,
      color: activeProduct.color,
      size: activeSize.split(':')[0].trim(),
      name: product.name,
      price: product.price.toString(),
      image: activeProduct.imageDetail[0]
    }

    try {
      let customerData = await fetchCustomerDetailAPI(user.userId)
      if (!customerData.orders || customerData.orders.length === 0) {
        const order = await fetchCreateOrder()
        const data = { orderId: order._id, status: order.status }
        const updatedCustomer = await addOrderToCustomer(user.userId, data)
        // localStorage.setItem('user', JSON.stringify(updatedCustomer))

        customerData = updatedCustomer
      }
      await addProductToOrder(customerData.orders[customerData.orders.length - 1].orderId, productData).then(() => {
        tickSound.volume = 0.25
        tickSound.play()
        setTimeout(() => {
          setAddProductStatus('success')
        }, 250)
      })

      // CHỜ 3s rồi quay lại idle
      setTimeout(() => {
        setAddProductStatus('idle')
      }, 3000)

    } catch (error) {
      // console.error('Lỗi:', error)
      setAddProductStatus('idle')
    }
  }

  useEffect(() => {
    setActiveSize(null)
  }, [activeProduct])

  useEffect(() => {
    setSearchParams({ ...Object.fromEntries([...searchParams]), active: 'productDetail', product: product.slug }, { replace: true })
  }, [])

  return (
    <Modal
      className="Modal "
      open={open}
      sx={{
        overflowY: 'scroll',
        transition: 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
      onClick={handleClose}
    >
      <Box
        sx={{
          height: 'fit-content',
          outline: 'none',
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <Box
          className="fade-in-up"
          onClick={(e) => e.stopPropagation()} // Ngăn click ra ngoài phần nội dung
          sx={{
            width: '85%',
            minHeight: '100vh',
            height: 'fit-content',
            bgcolor: 'white',
            outline: 'none',
            borderRadius: '28px',
            my: '32px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            px: '100px',
            py: '24px',
            boxShadow: '4px 4px 15px rgb(138, 138, 138)'
          }}
        >
          {/* Close Button */}
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
            onClick={handleClose}
          >
            <img src={closeIcon} style={{ width: '22px', height: '22px' }} />
          </Box>
          {/* Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{
              display: 'flex',
              '& > div': { pt: '32px' }
            }}>

              {/* Left */}
              <Box sx={{
                flex: 0.5,
                display: 'flex',
                flexDirection: 'column',
                height: 'fit-content',
                position: 'sticky',
                top: 0,
                zIndex: 100
              }}>
                {activeProduct.imageDetail.map((image, index) => (
                  <Box
                    onClick={() => setCurrentImage({ image: image, id: index })}
                    key={index}
                    sx={{
                      height: '70px',
                      width: '70px',
                      mb: '12px',
                      borderRadius: '6px',
                      border: 'solid 0.5px rgba(255, 255, 255, 0)',
                      transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                      '&:hover': {
                        boxShadow: '1px 1px 10px rgb(201, 200, 200)',
                        transform: 'scale(1.02)',
                        transformOrigin: 'center',
                        cursor: 'pointer',
                        border: 'solid 1px #b6b6b6'
                      }
                    }}
                  >
                    <img
                      src={image}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '6px',
                        boxShadow: '0.2px 0.2px 10px rgb(220, 220, 220)',
                        objectFit: 'cover'

                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* Mid */}
              <Box sx={{
                flex: 5,
                px: 3,
                height: 'fit-content',
                position: 'sticky',
                top: 0,
                zIndex: 100
              }}>
                <Box
                  sx={{
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  <img
                    src={currentImage.image}
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
                    }}
                  />
                  {/* Button */}
                  <Box sx={{
                    position: 'absolute',
                    display: 'flex',
                    gap: 2, p: '16px 32px',
                    justifyContent: 'right',
                    right: '-2%',
                    bottom: '2%'
                  }}>
                    <Box
                      onClick={() => {
                        const prevId = currentImage.id === 0
                          ? activeProduct.imageDetail.length - 1
                          : currentImage.id - 1;
                        setCurrentImage({
                          image: activeProduct.imageDetail[prevId],
                          id: prevId
                        })
                      }}
                      sx={{
                        bgcolor: '#f5f6fa',
                        width: '40px',
                        height: '40px',
                        borderRadius: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'rgba(0,0,0,.85)',
                        boxShadow: '0.5px 0.5px 10px rgb(189, 189, 189)',
                        transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                        '&:hover': {
                          bgcolor: 'rgb(228, 227, 227)'
                          // transform: 'scale(1.03)',
                        }
                      }}
                    >
                      <img src={leftIcon} style={{ width: '20px', height: '20px', userSelect: 'none' }} />
                    </Box>
                    <Box
                      onClick={() => {
                        const nextId = currentImage.id === activeProduct.imageDetail.length - 1
                          ? 0
                          : currentImage.id + 1;
                        setCurrentImage({
                          image: activeProduct.imageDetail[nextId],
                          id: nextId
                        })
                      }}
                      sx={{
                        bgcolor: '#f5f6fa',
                        width: '40px',
                        height: '40px',
                        borderRadius: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'rgba(0,0,0,.85)',
                        boxShadow: '0.5px 0.5px 10px rgb(189, 189, 189)',
                        transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                        '&:hover': {
                          bgcolor: 'rgb(228, 227, 227)'
                        }
                      }}
                    >
                      <img src={rightIcon} style={{ width: '20px', height: '20px', userSelect: 'none' }} />
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Right */}
              <Box sx={{
                flex: 4,
                height: '100%'
              }}>
                {/* Title */}
                <Box>
                  <Typography sx={{ color: '#d33918', fontSize: '18px', fontWeight: '600' }}>{activeProduct.stock > 0 ? 'Just in' : 'Sold out'}</Typography>
                  <Typography sx={{ fontWeight: '600', fontSize: '22px', pt: '4px' }} >{activeProduct.name}</Typography>
                  <Typography sx={{ fontSize: '16px', color: '#7e7e85', pb: '4px' }} >{activeProduct.type.slice(0, 1).toUpperCase() + product.type.slice(1)}</Typography>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', color: '#000000c2', pt: '8px' }}>{Number(activeProduct.price).toLocaleString('vi-VN')}đ</Typography>
                </Box>
                <Typography sx={{ fontSize: '16px', color: '#7e7e85', py: '8px' }} >{activeProduct.color.slice(0, 1).toUpperCase() + activeProduct.color.slice(1)}</Typography>
                {/* Image List */}
                <Box
                  sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}
                >
                  {productList.map(product => (
                    <Box
                      onClick={() => {
                        setActiveProduct(product)
                        setCurrentImage({ image: product.imageDetail[0], id: 0 })
                      }}
                      key={product.id}
                      sx={{
                        position: 'relative',
                        width: '70px',
                        height: '70px',
                        borderRadius: '8px',
                        transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                        opacity: product.stock > 0 ? '1' : '0.4',
                        border: activeProduct.id === product.id ? 'solid 1px #000' : 'solid 1px rgba(255,255,255, 0)',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transformOrigin: 'center',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <img
                        src={product.imageDetail[0]}
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                          boxShadow: '0.2px 0.2px 10px rgb(220, 220, 220)'
                        }}
                      />
                      {product.stock === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '5px',
                            left: '5px',
                            width: '83px',
                            height: '1px',
                            backgroundColor: 'red',
                            transform: 'rotate(45deg)',
                            transformOrigin: 'top left'
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
                {/* Size */}
                <Box sx={{ pt: '32px' }} >
                  <Typography sx={{ color: 'rgba(0,0,0, .85)', fontSize: '16px', fontWeight: '600', pb: 1 }}>Select Size</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {activeProduct.size.map((size, idx) => (
                      <Typography
                        onClick={(e) => {
                          if (size.split(':')[1] > 0) {
                            setActiveSize(() => activeSize !== size ? size : null)
                          }
                          else { e.preventDefault() }
                        }}
                        key={idx}
                        sx={{
                          border: activeSize === size ? 'solid 0.5px rgb(0, 0, 0)' : 'solid 0.5px rgba(255, 255, 255, 0)',
                          p: '8px 24px',
                          fontSize: '16px',
                          borderRadius: '8px',
                          bgcolor: 'white',
                          boxShadow: '0.5px 0.5px 10px rgb(220, 220, 220)',
                          transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                          color: 'rgba(0,0,0, .85)',
                          opacity: size.split(':')[1] > 0 ? 'none' : '0.4',
                          '&:hover': {
                            boxShadow: size.split(':')[1] > 0 ? '1px 1px 10px rgb(201, 200, 200)' : '0.5px 0.5px 10px rgb(220, 220, 220)',
                            transform: 'scale(1.02)',
                            transformOrigin: 'center',
                            cursor: size.split(':')[1] > 0 ? 'pointer' : 'not-allowed'
                            // border: size.split(':')[1] > 0 ? 'solid 0.5px #b6b6b6' : 'solid 0.5px rgba(255, 255, 255, 0)'
                          }
                        }}
                      >
                        {size.split(':')[0]}
                      </Typography>
                    ))}
                  </Box>
                </Box>
                {/* Add to Cart */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: '32px',
                    transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                    '& > div': {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      // p: '16px',
                      height: '50px',
                      transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                      borderRadius: '32px',
                      boxShadow: '0.5px 0.5px 10px rgb(220, 220, 220)'
                    },
                    '& > div:hover': {
                      cursor: 'pointer',
                      boxShadow: '1px 1px 10px rgb(201, 200, 200)',
                      transform: 'scale(1.02)',
                      transformOrigin: 'center'
                    },
                    '& p': {
                      fontSize: '16px',
                      fontWeight: '600'
                    }
                  }}
                >
                  <Box
                    onClick={() => (activeSize && addProductStatus !== 'loading' && addProductStatus !== 'success') && handleAddToCart()}
                    sx={{
                      bgcolor: 'black',
                      color: 'white',
                      opacity: activeSize ? 1 : 0.5
                    }}>
                    {addProductStatus === 'idle' && (
                      <Typography className='fade-in'>{user ? 'Add to Cart' : 'Sign in to shopping'}</Typography>
                    )}
                    {addProductStatus === 'loading' && (
                      <span className='spinner-white' style={{ width: '28px', height: '28px' }}></span>
                    )}
                    {addProductStatus === 'success' && (
                      <span className='boom' style={{ display: 'flex', alignItems: 'center' }} >
                        <img src={checkIcon} style={{ width: '32px', height: '32px' }} />
                      </span>
                    )}
                  </Box>
                  <Box
                    onClick={() => {
                      setAddFavouriteStatus(!addFavouriteStatus)
                      if (!addFavouriteStatus) {
                        addFavouriteSound.volume = 0.4
                        addFavouriteSound.play()
                      }
                    }}
                    sx={{ color: 'rgba(0,0,0,.85)', display: 'flex', gap: 1 }}
                  >
                    <Typography>Add Favourite</Typography>
                    {addFavouriteStatus ? (
                      <img className='boom' src={heartColorIcon} style={{ width: '28px', height: '28px', userSelect: 'none' }} />
                    ) : (
                      <Box sx={{
                        mx: '4px', display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        <img className='fade-in' style={{ width: '20px', height: '20px', userSelect: 'none' }} src={heartIcon} />
                      </Box>
                    )}
                  </Box>
                </Box>
                {/* HighLight and Desc */}
                <Box>
                  {/* HighLight */}
                  {activeProduct.highLight && (
                    <Box sx={{
                      display: 'flex',
                      bgcolor: '#f5f5f5',
                      alignItems: 'center', justifyContent: 'center',
                      mt: '48px'
                    }}>
                      <Typography sx={{
                        py: '24px',
                        px: '32px',
                        fontSize: '16px'
                      }}>
                        {activeProduct.highLight}
                      </Typography>
                    </Box>
                  )}
                  {/* Desc */}
                  {activeProduct.desc && (
                    <Box sx={{ mt: '48px' }}>
                      <Typography sx={{
                        fontWeight: '600',
                        fontSize: '20px',
                        mb: '4px'
                      }}>
                        Description:
                      </Typography>
                      <Typography
                        sx={{ fontSize: '16px' }}
                      >
                        {activeProduct.desc}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

            </Box>
            {/* <div style={{ padding: '16px 0', display:'flex', flexDirection: 'column' }}>
              <p style={{ fontWeight: '600', fontSize: '28px', pt: '4px' }} >Related Products</p>
            </div> */}
          </div>
        </Box>
      </Box>
    </Modal>
  )
}
