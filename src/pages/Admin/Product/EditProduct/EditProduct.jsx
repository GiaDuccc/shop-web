import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import addImage from '~/assets/addImage.png'
import addIcon from '~/assets/add.png'
import '~/App.scss'
import { updateProductAPI, uploadImagesAPI, uploadImageAPI } from '~/apis/productApi'
import closeIcon from '~/assets/x-white.png'
import successIcon from '~/assets/check.png'
import errorIcon from '~/assets/error.png'
import trashIcon from '~/assets/trash.png'
import dingSound from '~/assets/ding-sound.mp3'

const imageDetailLimit = 6

export default function EditProduct({ product, open, onClose, refresh }) {

  const [productColors, setProductColors] = useState(product.colors)
  const [productSizeAndQuantity, setProductSizeAndQuantity] = useState({})
  const [adImage, setAdImage] = useState(product.adImage)
  const [navbarImage, setNavbarImage] = useState(product.navbarImage)
  const [productInfo, setProductInfo] = useState({
    name: product.name,
    type: product.type,
    brand: product.brand,
    price: product.price,
    highLight: product.highLight,
    desc: product.desc
  })

  const tickSound = new Audio(dingSound)
  const [isLoadingAdd, setIsLoadingAdd] = useState('idle')
  const [showSizeTrash, setShowSizeTrash] = useState(false)
  const [showImageTrash, setShowImageTrash] = useState(null)
  const [showAdImageTrash, setShowAdImageTrash] = useState(null)
  const [showNavbarImageTrash, setShowNavbarImageTrash] = useState(null)

  const handleUploadAdImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const image = await uploadImageAPI(file, productInfo.name)
    setAdImage(image.filePath)
  }

  const handleUploadNavbarImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const image = await uploadImageAPI(file, productInfo.name)
    setNavbarImage(image.filePath)
  }

  const handleUploadImageDetails = async (e, color, idx) => {
    const files = Array.from(e.target.files)
    if (files.length === 0 || !color) return
    const image = await uploadImagesAPI(files, productInfo.name, color)
    setProductColors(prev => prev.map((item, id) =>
      id === idx ?
        {
          ...item,
          imageDetail: [...item.imageDetail, ...image.filePaths.slice(0, imageDetailLimit - item.imageDetail.length)]
        }
        : item
    ))
  }

  const handleAddProduct = async () => {
    setIsLoadingAdd('loading')
    const updateProduct = {
      ...productInfo,
      adImage: adImage,
      navbarImage: navbarImage,
      // eslint-disable-next-line no-unused-vars
      colors: productColors.map(({ image, ...color }) => ({
        ...color,
        color: color.color.toLowerCase(),
        // eslint-disable-next-line no-unused-vars
        sizes: color.sizes.map(({ id, ...rest }) => rest) // bỏ id, giữ lại phần còn lại
      }))
    }

    await updateProductAPI(product._id, updateProduct)
      .then(() => {
        tickSound.volume = 0.25
        tickSound.play()
        setTimeout(() => {
          setIsLoadingAdd('success')
        }, 200)

        setTimeout(() => {
          refresh()
          onClose()
        }, 1000)
      })
      .catch(() => {
        setIsLoadingAdd('failed')
        setTimeout(() => {
          setIsLoadingAdd('idle')
        }, 1000)
      })
  }

  const handleDeleteImageDetail = (idx, id) => {
    setProductColors(prev => prev.map((color, i) =>
      idx === i ? { ...color, imageDetail: color.imageDetail.filter((_, index) => index !== id) } : color
    ))
  }

  return (
    <Modal
      className="Modal "
      open={open}
      sx={{
        overflowY: 'scroll',
        transition: 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
    >
      <Box
        sx={{
          // width: '100vw',
          minHeight: '100vh',
          height: 'fit-content',
          outline: 'none',
          display: 'flex',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          alignItems: 'center'
        }}
      >
        <Box
          className="fade-in-up"
          onClick={(e) => e.stopPropagation()} // Ngăn click ra ngoài phần nội dung
          sx={{
            width: '85%',
            // minHeight: '100vh',
            height: 'fit-content',
            bgcolor: 'white',
            outline: 'none',
            borderRadius: '28px',
            my: '52px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            p: '24px 100px 48px',
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
            onClick={onClose}
          >
            <img src={closeIcon} style={{ width: '20px', height: '20px' }} />
          </Box>
          {/* Content */}
          <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Typography sx={{ fontSize: '36px', fontWeight: '600' }}>Edit Product</Typography>
            {/* Info */}
            <Box sx={{ display: 'flex', width: '100%', gap: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                {/* Name */}
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Product Name:</Typography>
                  <TextField
                    autoFocus
                    onChange={(e) => {
                      setAdImage(null)
                      setNavbarImage(null)
                      setProductColors([])
                      setProductInfo({ ...productInfo, name: e.target.value })
                    }}
                    value={productInfo.name}
                    label='Enter Product Name'
                    variant="filled"
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
                        '&.Mui-focused': {
                          border: '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        },
                        '& input:-webkit-autofill': {
                          borderRadius: '16px'
                        }
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
                {/* Brand */}
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Brand:</Typography>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, brand: e.target.value })}
                    select
                    label="Enter Brand"
                    variant="filled"
                    defaultValue={productInfo.brand}
                    // value={productInfo.brand}
                    SelectProps={{
                      native: true,
                      IconComponent: () => null
                    }}
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      width: '100%',
                      backgroundColor: 'white',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        paddingRight: '10px',
                        color: 'rgba(255,255,255, 0)',
                        border: '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        }
                      },
                      '& .MuiFilledInput-input': {
                        color: productInfo.brand ? '#000' : 'transparent'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(0,0,0,.85)'
                      }
                    }}
                  >
                    <option value="" disabled style={{
                      backgroundColor: '#e2e2e2',
                      color: 'black'
                    }}
                    >
                      Brand
                    </option>
                    {['nike', 'adidas', 'puma', 'new balance', 'vans', 'balenciaga'].map((brand, idx) => (
                      <option key={idx} value={brand} style={{
                        backgroundColor: 'white',
                        color: 'black'
                      }}>
                        {`${brand.slice(0, 1).toUpperCase() + brand.slice(1)}`}
                      </option>
                    ))}
                  </TextField>
                </Box>
                {/* HighLight */}
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Highlight:</Typography>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, highLight: e.target.value })}
                    label='Enter Highlight'
                    variant="filled"
                    value={productInfo.highLight}
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
                        '&.Mui-focused': {
                          border: '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        },
                        '& input:-webkit-autofill': {
                          borderRadius: '16px'
                        }
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
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                {/* Type */}
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Type:</Typography>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, type: e.target.value })}
                    select
                    label="Enter Type"
                    variant="filled"
                    // value={productInfo.type}
                    defaultValue={productInfo.type}
                    SelectProps={{
                      native: true,
                      IconComponent: () => null
                    }}
                    InputProps={{
                      disableUnderline: true
                    }}
                    sx={{
                      width: '100%',
                      backgroundColor: 'white',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        paddingRight: '10px',
                        color: 'rgba(255,255,255, 0)',
                        border: '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        }
                      },
                      '& .MuiFilledInput-input': {
                        color: productInfo.type ? '#000' : 'transparent'
                      },
                      '& .MuiInputLabel-root': {
                        color: '#666'
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'rgba(0,0,0,.85)'
                      }
                    }}
                  >
                    <option value="" disabled style={{
                      backgroundColor: '#e2e2e2',
                      color: 'black'
                    }}
                    >
                      Type
                    </option>
                    {['sneaker', 'classic', 'running', 'basketball', 'football', 'boot'].map((type, idx) => (
                      <option key={idx} value={type} style={{
                        backgroundColor: 'white',
                        color: 'black'
                      }}>
                        {`${type.slice(0, 1).toUpperCase() + type.slice(1)}`}
                      </option>
                    ))}
                  </TextField>
                </Box>
                {/* Price */}
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Price:</Typography>
                  <TextField
                    onChange={(e) => {
                      const price = e.target.value.replace(/[^\d]/g, '')
                      if (!/^\d*$/.test(price)) return
                      setProductInfo({ ...productInfo, price: price })
                    }}
                    label='Enter Price'
                    variant="filled"
                    // value={productInfo.price}
                    value={Number(productInfo.price).toLocaleString('vi-VN')}
                    InputProps={{
                      disableUnderline: true
                    }}
                    // type='number'
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: '100%',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        border: '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        },
                        '& input:-webkit-autofill': {
                          borderRadius: '16px'
                        }
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
                {/* Desc */}
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Description:</Typography>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, desc: e.target.value })}
                    label='Enter Description'
                    variant="filled"
                    multiline
                    InputProps={{
                      disableUnderline: true
                    }}
                    value={productInfo.desc}
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      width: '100%',
                      '& .MuiFilledInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        color: 'rgba(0, 0, 0, 0.85)',
                        border: '2px solid rgb(170, 170, 170)',
                        '&.Mui-focused': {
                          border: '2px solid rgba(0, 0, 0, 0.65)',
                          borderRadius: '16px',
                          backgroundColor: 'white'
                        },
                        '& input:-webkit-autofill': {
                          borderRadius: '16px'
                        }
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
              </Box>
            </Box>

            <hr style={{
              border: 'none',
              borderTop: '1px solid #ccc',
              margin: '16px 0 8px'
            }} />

            {/* adImage & navbarImage */}
            <Box sx={{
              display: productInfo.name ? 'flex' : 'none',
              gap: 10,
              height: 'fit-content',
              '& > div': {
                width: '200px'
              }
            }}>
              {/* Ad */}
              <Box
                className='boom-small'
                onMouseEnter={() => setShowAdImageTrash(true)}
                onMouseLeave={() => setShowAdImageTrash(false)}
              >
                <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Ad Image:</Typography>
                <Box sx={{
                  width: 'fit-content', height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <label htmlFor='upload-adImage' style={{ width: '200px', height: '200px' }} >
                    <Box
                      sx={{
                        height: '200px',
                        width: '100%',
                        borderRadius: '8px',
                        border: 'dashed 2px #ccc',
                        transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                        bgcolor: '#f7f7f7',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transformOrigin: 'center',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {adImage ? (
                        <img
                          className='slide-from-right'
                          src={adImage}
                          style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          component='img'
                          src={addImage}
                          sx={{
                            width: '28px',
                            height: '28px',
                            opacity: .6
                          }}
                        />
                      )}

                    </Box>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleUploadAdImage(e)
                      }}
                      style={{ display: 'none' }}
                      id="upload-adImage"
                    />
                  </label>
                  <Box
                    className='boom-small'
                    onClick={() => setAdImage(null)}
                    sx={{
                      height: '36px',
                      width: '36px',
                      p: '2px 5px',
                      display: showAdImageTrash && adImage ? 'flex' : 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '30px',
                      bgcolor: '#fff',
                      transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                      '&:hover': {
                        bgcolor: '#ccc',
                        cursor: 'pointer'
                      }
                    }}>
                    <img src={trashIcon} style={{ width: '18px', height: '18px' }} />
                  </Box>
                </Box>
              </Box>
              {/* Navbar */}
              <Box
                className='boom-small'
                onMouseEnter={() => setShowNavbarImageTrash(true)}
                onMouseLeave={() => setShowNavbarImageTrash(false)}
              >
                <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: '8px' }}>Navbar Image:</Typography>
                <Box
                  sx={{
                    width: 'fit-content', height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <label htmlFor='upload-navbarImage' style={{ width: '200px', height: '200px' }} >
                    <Box
                      sx={{
                        height: '200px',
                        width: '100%',
                        borderRadius: '8px',
                        border: 'dashed 2px #ccc',
                        transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                        bgcolor: '#f7f7f7',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transformOrigin: 'center',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      {navbarImage ? (
                        <img
                          className='slide-from-right'
                          src={navbarImage}
                          style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          component='img'
                          src={addImage}
                          sx={{
                            width: '28px',
                            height: '28px',
                            opacity: .6
                          }}
                        />
                      )}

                    </Box>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleUploadNavbarImage(e)
                      }}
                      style={{ display: 'none' }}
                      id="upload-navbarImage"
                    />
                  </label>
                  <Box
                    className='boom-small'
                    onClick={() => setNavbarImage(null)}
                    sx={{
                      height: '36px',
                      width: '36px',
                      p: '2px 5px',
                      display: showNavbarImageTrash && navbarImage ? 'flex' : 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '30px',
                      bgcolor: '#fff',
                      transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                      '&:hover': {
                        bgcolor: '#ccc',
                        cursor: 'pointer'
                      }
                    }}>
                    <img src={trashIcon} style={{ width: '18px', height: '18px' }} />
                  </Box>
                </Box>
              </Box>
            </Box>

            <hr style={{
              border: 'none',
              borderTop: '1px solid #ccc',
              margin: '16px 0 8px'
            }} />

            {/* Color */}
            <Box
              className='fade-in-up'
              sx={{
                display: productInfo.name ? 'flex' : 'none',
                flexDirection: 'column',
                gap: 3
              }}>
              <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>Colors:</Typography>
              {productColors.length > 0 && productColors.map((product, idx) => (
                <Box
                  className='boom-small'
                  key={idx}
                  sx={{
                    bgcolor: '#eee',
                    borderRadius: '16px',
                    p: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  {/* Color */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Color:</Typography>
                      <Box
                        onClick={() => setProductColors(prev => prev.filter((_, index) => index !== idx))}
                        sx={{
                          width: '32px',
                          height: '32px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '30px',
                          cursor: 'pointer',
                          transition: 'all 0.15s cubic-bezier(0.42, 0, 0.58, 1)',
                          '& img': {
                            width: '22px', height: '22px',
                            transition: 'all 0.15s cubic-bezier(0.42, 0, 0.58, 1)'
                          },
                          '&:hover': {
                            bgcolor: '#fff'
                          },
                          '&:hover img': {
                            width: '18px', height: '18px'
                          }
                        }}
                      >
                        <img
                          src={trashIcon} style={{}}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '35%', gap: 2 }}>
                      <TextField
                        onChange={(e) => setProductColors(prev => prev.map((color, id) =>
                          idx === id ? { ...color, color: e.target.value, imageDetail: [] } : color
                        ))}
                        label='Enter Color'
                        variant="filled"
                        value={productColors[idx].color}
                        InputProps={{
                          disableUnderline: true
                        }}
                        sx={{
                          flex: 1,
                          backgroundColor: 'white',
                          width: '30%',
                          borderRadius: '16px',
                          '& .MuiFilledInput-root': {
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            color: 'rgba(0, 0, 0, 0.85)',
                            border: '2px solid rgb(170, 170, 170)',
                            '&.Mui-focused': {
                              border: '2px solid rgba(0, 0, 0, 0.65)',
                              borderRadius: '16px',
                              backgroundColor: 'white'
                            },
                            '& input:-webkit-autofill': {
                              borderRadius: '16px'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#666'
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'rgba(0,0,0,.85)'
                          }
                        }}
                      />
                      <label htmlFor={`colorHex${idx}`}>
                        <Box sx={{
                          width: '36px',
                          height: '36px',
                          background: product.colorHex || 'conic-gradient(from 0deg, #ffb055, #fcff41, #ff5151,  #ffb055)',
                          borderRadius: '50px',
                          border: '1px solid #000',
                          cursor: 'pointer'
                        }} />
                        <input
                          id={`colorHex${idx}`}
                          type="color"
                          onChange={(e) => setProductColors(prev => prev.map((color, id) =>
                            idx === id ? { ...color, colorHex: e.target.value } : color
                          ))}
                          value='#ffffff'
                          style={{
                            display: 'block',
                            opacity: 0,
                            width: 0,
                            height: 0
                          }} // Ẩn input
                        />
                      </label>
                    </Box>
                  </Box>

                  {/* Size */}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: '600', mb: product.sizes?.length > 0 ? '8px' : '0px' }}>Sizes:</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {product.sizes?.length > 0 && product.sizes.map((item, id) => (
                        <Box
                          onMouseEnter={() => setShowSizeTrash({ productId: idx, sizeId: id })}
                          onMouseLeave={() => setShowSizeTrash(null)}
                          onClick={() =>
                            setProductColors(prev =>
                              prev.map((color, keyId) => keyId === idx ? {
                                ...color,
                                sizes: color.sizes.filter((_, index) => index !== id) // xóa phần tử tại vị trí `id`
                              } : color
                              )
                            )
                          }
                          className='boom-small'
                          key={id}
                          sx={{
                            bgcolor: '#fff',
                            p: '8px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            position: 'relative',
                            color: showSizeTrash?.sizeId === id && showSizeTrash?.productId === idx ? 'transparent' : '#000'
                          }}
                        >
                          {showSizeTrash?.sizeId === id && showSizeTrash?.productId === idx && (
                            <img src={trashIcon} style={{
                              width: '20px',
                              height: '20px',
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)'
                            }} />
                          )}
                          {`${item.size} : ${item.quantity}`}
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: '12px' }}>
                      <TextField
                        id='size-input'
                        onChange={(e) => setProductSizeAndQuantity(prev => { return { ...prev, size: e.target.value, id: idx } })}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') {
                            if (!productSizeAndQuantity || !productSizeAndQuantity.size || !productSizeAndQuantity.quantity) return
                            setProductColors(prev => prev.map((color, id) =>
                              idx === id ? { ...color, sizes: [...color.sizes || [], productSizeAndQuantity].sort((a, b) => a.size.localeCompare(b.size)) } : color
                            ))
                            setProductSizeAndQuantity({ size: '', quantity: '', id: '' })
                          }
                        }}
                        value={productSizeAndQuantity.id === idx ? productSizeAndQuantity.size : ''}
                        label='Size'
                        type='number'
                        variant="filled"
                        InputProps={{
                          disableUnderline: true
                        }}
                        sx={{
                          backgroundColor: 'white',
                          width: '150px',
                          borderRadius: '16px',
                          '& .MuiFilledInput-root': {
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            color: 'rgba(0, 0, 0, 0.85)',
                            border: '2px solid rgb(170, 170, 170)',
                            '&.Mui-focused': {
                              border: '2px solid rgba(0, 0, 0, 0.65)',
                              borderRadius: '16px',
                              backgroundColor: 'white'
                            },
                            '& input:-webkit-autofill': {
                              borderRadius: '16px'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#666'
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'rgba(0,0,0,.85)'
                          }
                        }}
                      />
                      <TextField
                        id='quantity-input'
                        onChange={(e) => setProductSizeAndQuantity(prev => { return { ...prev, quantity: e.target.value, id: idx } })}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') {
                            if (!productSizeAndQuantity || !productSizeAndQuantity.size || !productSizeAndQuantity.quantity) return
                            setProductColors(prev => prev.map((color, id) =>
                              idx === id ? { ...color, sizes: [...color.sizes || [], productSizeAndQuantity].sort((a, b) => a.size.localeCompare(b.size)) } : color
                            ))
                            setProductSizeAndQuantity({ size: '', quantity: '', id: '' })
                          }
                        }}
                        value={productSizeAndQuantity.id === idx ? productSizeAndQuantity.quantity : ''}
                        label='Quantity'
                        type='number'
                        variant="filled"
                        InputProps={{
                          disableUnderline: true
                        }}
                        sx={{
                          backgroundColor: 'white',
                          width: '150px',
                          borderRadius: '16px',
                          '& .MuiFilledInput-root': {
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            color: 'rgba(0, 0, 0, 0.85)',
                            border: '2px solid rgb(170, 170, 170)',
                            '&.Mui-focused': {
                              border: '2px solid rgba(0, 0, 0, 0.65)',
                              borderRadius: '16px',
                              backgroundColor: 'white'
                            },
                            '& input:-webkit-autofill': {
                              borderRadius: '16px'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: '#666'
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'rgba(0,0,0,.85)'
                          }
                        }}
                      />
                      <Box
                        onClick={() => {
                          if (!productSizeAndQuantity || !productSizeAndQuantity.size || !productSizeAndQuantity.quantity) return
                          setProductColors(prev => prev.map((color, id) =>
                            idx === id ? { ...color, sizes: [...color.sizes || [], productSizeAndQuantity].sort((a, b) => a.size.localeCompare(b.size)) } : color
                          ))
                          setProductSizeAndQuantity({ size: '', quantity: '', id: '' })
                        }}
                        sx={{
                          width: '130px',
                          height: '40px',
                          bgcolor: '#000',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                          '&:hover': {
                            opacity: .7
                          }
                        }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Add size</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Image Details */}
                  {product.color && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}>
                      <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>Image Details:</Typography>
                      <Box sx={{ display: 'flex' }}>
                        {product.imageDetail.length > 0 && product.imageDetail.map((image, id) => (
                          <Box
                            onMouseEnter={() => setShowImageTrash({ colorId: idx, imageId: id })}
                            onMouseLeave={() => setShowImageTrash(null)}
                            key={id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              transition: 'width 0.1s cubic-bezier(0.42, 0, 0.58, 1)',
                              mr: showImageTrash?.colorId === idx && showImageTrash?.imageId === id ? '8px' : '20px',
                              width: showImageTrash?.colorId === idx && showImageTrash?.imageId === id ? '115px' : '70px'
                            }}
                          >
                            <Box sx={{ width: '70px' }}>
                              <label htmlFor={`upload-image${idx}-${id}`} style={{ width: '70px', height: '70px' }}>
                                <Box
                                  className='slide-from-left'
                                  sx={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border:
                                      showImageTrash?.colorId === idx && showImageTrash?.imageId === id
                                        ? '1px solid #000' : '1px solid transparent',
                                    transition: 'all 0.15s cubic-bezier(0.42, 0, 0.58, 1)',
                                    '&:hover': {
                                      border: '1px solid #000'
                                    }
                                  }}
                                >
                                  <img src={image}
                                    style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover', userSelect: 'none' }}
                                  />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files[0]
                                      if (!file) return
                                      const image = await uploadImageAPI(file, productInfo.name, product.color)
                                      setProductColors(prev => prev.map((color, i) =>
                                        idx === i ? {
                                          ...color, imageDetail: color.imageDetail.map((img, j) => j === id ? image.filePath : img
                                          )
                                        } : color
                                      ))
                                    }}
                                    style={{ display: 'none' }}
                                    id={`upload-image${idx}-${id}`}
                                  />
                                </Box>
                              </label>
                            </Box>
                            {showImageTrash && (
                              <Box
                                className='boom-small'
                                onClick={() => handleDeleteImageDetail(idx, id)}
                                sx={{
                                  height: '36px',
                                  width: '36px',
                                  p: '2px 5px',
                                  display: (showImageTrash.colorId === idx && showImageTrash.imageId === id) ? 'flex' : 'none',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '30px',
                                  bgcolor: '#fff',
                                  transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                                  '&:hover': {
                                    bgcolor: '#ccc',
                                    cursor: 'pointer'
                                  }
                                }}>
                                <img src={trashIcon} style={{ width: '18px', height: '18px', userSelect: 'none' }} />
                              </Box>
                            )}
                          </Box>
                        ))}
                        {product.imageDetail.length < 6 && (
                          <Box sx={{ width: '70px', height: '70px' }}>
                            <label htmlFor={`upload-imageDetails${idx}`}>
                              <Box
                                sx={{
                                  height: '70px',
                                  width: '70px',
                                  mb: '12px',
                                  borderRadius: '8px',
                                  border: 'dashed 2px #ccc',
                                  transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                                  bgcolor: '#f7f7f7',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  '&:hover': {
                                    transform: 'scale(1.02)',
                                    transformOrigin: 'center',
                                    cursor: 'pointer'
                                  }
                                }}
                              >
                                <Box
                                  component='img'
                                  src={addImage}
                                  sx={{
                                    width: '28px',
                                    height: '28px',
                                    opacity: .6,
                                    userSelect:'none'
                                  }}
                                />
                              </Box>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleUploadImageDetails(e, product.color, idx)}
                                style={{ display: 'none' }}
                                id={`upload-imageDetails${idx}`}
                              />
                            </label>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
              {/* add color button */}
              <Box
                onClick={() => setProductColors(prev => [...prev, {
                  imageDetail: [],
                  color: '',
                  colorHex: '',
                  sizes: []
                }])}
                sx={{
                  bgcolor: '#000',
                  display: 'flex',
                  p: '8px 16px',
                  width: 'fit-content',
                  borderRadius: '12px',
                  transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    opacity: .8,
                    cursor: 'pointer'
                  }
                }}>
                <Typography sx={{ fontSize: '20px', fontWeight: '600', color: '#fff' }}>Add Color</Typography>
                <img src={addIcon} style={{ width: '20px', height: '20px' }} />
              </Box>
            </Box>

          </Box>
          {/* Button */}
          <Box
            onClick={() => {
              if (!navbarImage || !adImage ||
                Object.keys(productInfo).some(key => !productInfo[key]) ||
                productColors.some(color => Object.keys(color).some(key => !color[key]))
              ) return
              if (isLoadingAdd !== 'idle') return
              handleAddProduct()
            }}
            sx={{
              bgcolor: '#000',
              width: '200px',
              height: '50px',
              borderRadius: '14px',
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
              mt: '32px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
              opacity:
                !navbarImage || !adImage ||
                  Object.keys(productInfo).some(key => !productInfo[key]) ||
                  productColors.some(color => Object.keys(color).some(key => !color[key]))
                  ? .5 : 1,
              '&:hover': {
                transform: 'scale(1.02)',
                transformOrigin: 'center'
              },
              '&:hover p': {
                color: '#fff'
              },
              '& p': {
                transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                color: '#bbb', fontSize: '20px', fontWeight: '600'
              }

            }}
          >
            {isLoadingAdd === 'idle' && (<Typography>Update</Typography>)}
            {isLoadingAdd === 'loading' && (
              <span className='spinner-white' style={{ width: '28px', height: '28px' }}></span>
            )}
            {isLoadingAdd === 'success' && (
              <span className='boom' style={{ display: 'flex', alignItems: 'center' }} >
                <img src={successIcon} style={{ width: '32px', height: '32px' }} />
              </span>
            )}
            {isLoadingAdd === 'failed' && (
              <span className='boom' style={{ display: 'flex', alignItems: 'center' }} >
                <img src={errorIcon} style={{ width: '32px', height: '32px' }} />
              </span>
            )}
          </Box>
        </Box>
      </Box>
    </Modal >
  )
}
