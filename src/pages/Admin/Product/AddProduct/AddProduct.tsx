import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { useState, ChangeEvent } from 'react'
import addImage from '~/assets/addImage.png'
import addIcon from '~/assets/add.png'
import closeIcon from '~/assets/x-white.png'
import '~/App.scss'
import { addProductAPI, uploadImageAPI, uploadImagesAPI } from '~/apis/adminAPI/productAPI'
import successIcon from '~/assets/check.png'
import trashIcon from '~/assets/trash.png'
import dingSound from '~/assets/ding-sound.mp3'
import styles from '../Add&EditProduct.module.scss'
import { ProductColor } from '~/interface/product.interface'
import { jwtDecode } from 'jwt-decode'

const imageDetailLimit = 6

interface AddProductProps {
  open: boolean
  onClose: () => void
  refresh: () => void
}

interface ProductInfo {
  name: string
  type: string
  brand: string
  price: string
  highLight: string
  desc: string
}

interface SizeAndQuantity {
  size: string
  quantity: string
  id: number | string
}

interface SizeTrashState {
  productId: number
  sizeId: number
}

interface ImageTrashState {
  colorId: number
  imageId: number
}

type LoadingState = 'idle' | 'loading' | 'success' | 'failed'

export default function AddProduct({ open, onClose, refresh }: AddProductProps) {

  const [productColors, setProductColors] = useState<ProductColor[]>([])
  const [productSizeAndQuantity, setProductSizeAndQuantity] = useState<SizeAndQuantity>({ size: '', quantity: '', id: '' })
  const [adImage, setAdImage] = useState<string | null>(null)
  const [navbarImage, setNavbarImage] = useState<string | null>(null)
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    type: '',
    brand: '',
    price: '',
    highLight: '',
    desc: ''
  })

  const tickSound = new Audio(dingSound)
  const [isLoadingAdd, setIsLoadingAdd] = useState<LoadingState>('idle')
  const [showSizeTrash, setShowSizeTrash] = useState<SizeTrashState | null>(null)
  const [showImageTrash, setShowImageTrash] = useState<ImageTrashState | null>(null)
  const [showAdImageTrash, setShowAdImageTrash] = useState<boolean>(false)
  const [showNavbarImageTrash, setShowNavbarImageTrash] = useState<boolean>(false)

  const handleUploadAdImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const image = await uploadImageAPI(file, productInfo.name)
    setAdImage(image.filePath)
  }

  const handleUploadNavbarImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const image = await uploadImageAPI(file, productInfo.name)
    setNavbarImage(image.filePath)
  }

  const handleUploadImageDetails = async (e: ChangeEvent<HTMLInputElement>, color: string, idx: number) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length === 0 || !color) return
    const image = await uploadImagesAPI(files, productInfo.name, color)
    setProductColors((prev: ProductColor[]) => prev.map((item: ProductColor, id: number) =>
      id === idx ?
        {
          ...item,
          imageDetail: [...item.imageDetail, ...image.filePaths.slice(0, imageDetailLimit - item.imageDetail.length)]
        }
        : item
    ))
  }

  const handleAddProduct = async () => {
    const accessTokenAdmin = localStorage.getItem("accessTokenAdmin")
    if (!accessTokenAdmin) return
    const user = jwtDecode(accessTokenAdmin) as { role: string }
    if (user.role !== 'manager') return

    setIsLoadingAdd('loading')
    const product = {
      ...productInfo,
      adImage: adImage || '',
      navbarImage: navbarImage || '',
      colors: productColors.map((color: ProductColor) => ({
        ...color,
        color: color.color.toLowerCase(),
        sizes: color.sizes.map(({ size, quantity }) => ({ size, quantity }))
      }))
    }
    await addProductAPI(product)
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

  const handleDeleteImageDetail = (idx: number, id: number) => {
    setProductColors((prev: ProductColor[]) => prev.map((color: ProductColor, i: number) =>
      idx === i ? { ...color, imageDetail: color.imageDetail.filter((_, index: number) => index !== id) } : color
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
    // onClick={onClose}
    >
      <div className={styles.modalBackdrop}>
        <div
          className={`fade-in-up ${styles.modalContent}`}
          onClick={(e) => e.stopPropagation()} // Ngăn click ra ngoài phần nội dung
        >
          {/* Close Button */}
          <div
            className={styles.closeButton}
            onClick={onClose}
          >
            <img src={closeIcon} className={styles.closeIcon} />
          </div>
          {/* Content */}
          <div className={styles.content}>
            <p className={styles.title}>Add Product</p>
            {/* Info */}
            <div className={styles.infoContainer}>
              <div className={styles.infoColumn}>
                {/* Name */}
                <div>
                  <p className={styles.fieldLabel}>Product Name:</p>
                  <TextField
                    autoFocus
                    onChange={(e) => {
                      setAdImage(null)
                      setNavbarImage(null)
                      setProductColors([])
                      setProductInfo({ ...productInfo, name: e.target.value })
                    }}
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
                </div>
                {/* Brand */}
                <div>
                  <p className={styles.fieldLabel}>Brand:</p>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, brand: e.target.value })}
                    select
                    label="Enter Brand"
                    variant="filled"
                    defaultValue=''
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
                </div>
                {/* HighLight */}
                <div>
                  <p className={styles.fieldLabel}>Highlight:</p>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, highLight: e.target.value })}
                    label='Enter Highlight'
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
                </div>
              </div>
              <div className={styles.infoColumn}>
                {/* Type */}
                <div>
                  <p className={styles.fieldLabel}>Type:</p>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, type: e.target.value })}
                    select
                    label="Enter Type"
                    variant="filled"
                    // value={productInfo.type}
                    defaultValue=''
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
                </div>
                {/* Price */}
                <div>
                  <p className={styles.fieldLabel}>Price:</p>
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
                </div>
                {/* Desc */}
                <div>
                  <p className={styles.fieldLabel}>Description:</p>
                  <TextField
                    onChange={(e) => setProductInfo({ ...productInfo, desc: e.target.value })}
                    label='Enter Description'
                    variant="filled"
                    multiline
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
                </div>
              </div>
            </div>
            {/* adImage & navbarImage */}
            <div className={`${styles.imageSection} ${productInfo.name ? styles.visible : styles.hidden}`}>
              {/* Ad */}
              <div
                className='boom-small'
                onMouseEnter={() => setShowAdImageTrash(true)}
                onMouseLeave={() => setShowAdImageTrash(false)}
              >
                <p className={styles.fieldLabel}>Ad Image:</p>
                <div className={styles.imageContainer}>
                  <label htmlFor='upload-adImage' className={styles.imageLabel} >
                    <div className={styles.imageUploadBox}>
                      {adImage ? (
                        <img
                          className={`slide-from-right ${styles.imagePreview}`}
                          src={adImage}
                        />
                      ) : (
                        <img
                          src={addImage}
                          className={styles.addImageIcon}
                        />
                      )}

                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleUploadAdImage(e)
                      }}
                      className={styles.hiddenInput}
                      id="upload-adImage"
                    />
                  </label>
                  <div
                    className={`boom-small ${styles.trashButton}`}
                    onClick={() => setAdImage(null)}
                    style={{ display: showAdImageTrash && adImage ? 'flex' : 'none' }}
                  >
                    <img src={trashIcon} className={styles.trashIcon} />
                  </div>
                </div>
              </div>
              {/* Navbar */}
              <div
                className='boom-small'
                onMouseEnter={() => setShowNavbarImageTrash(true)}
                onMouseLeave={() => setShowNavbarImageTrash(false)}
              >
                <p className={styles.fieldLabel}>Navbar Image:</p>
                <div className={styles.imageContainer}>
                  <label htmlFor='upload-navbarImage' className={styles.imageLabel} >
                    <div className={styles.imageUploadBox}>
                      {navbarImage ? (
                        <img
                          className={`slide-from-right ${styles.imagePreview}`}
                          src={navbarImage}
                        />
                      ) : (
                        <img
                          src={addImage}
                          className={styles.addImageIcon}
                        />
                      )}

                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleUploadNavbarImage(e)
                      }}
                      className={styles.hiddenInput}
                      id="upload-navbarImage"
                    />
                  </label>
                  <div
                    className={`boom-small ${styles.trashButton}`}
                    onClick={() => setNavbarImage(null)}
                    style={{ display: showNavbarImageTrash && navbarImage ? 'flex' : 'none' }}
                  >
                    <img src={trashIcon} className={styles.trashIcon} />
                  </div>
                </div>
              </div>
            </div>

            {/* Color */}
            <div
              className={`fade-in-up ${styles.colorsSection} ${productInfo.name ? styles.visible : styles.hidden}`}
            >
              <p className={styles.colorsTitle}>Colors:</p>
              {productColors.length > 0 && productColors.map((product: ProductColor, idx: number) => (
                <div
                  className={`boom-small ${styles.colorCard}`}
                  key={idx}
                >
                  {/* Color */}
                  <div className={styles.colorHeader}>
                    <div className={styles.colorHeaderRow}>
                      <p className={styles.colorTitle}>Color:</p>
                      <div
                        className={styles.deleteColorButton}
                        onClick={() => setProductColors((prev: ProductColor[]) => prev.filter((_, index: number) => index !== idx))}
                      >
                        <img
                          src={trashIcon}
                        />
                      </div>
                    </div>
                    <div className={styles.colorInputContainer}>
                      <TextField
                        onChange={(e) => setProductColors((prev: ProductColor[]) => prev.map((color: ProductColor, id: number) =>
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
                        <div
                          className={styles.colorPicker}
                          style={{
                            background: product.colorHex || 'conic-gradient(from 0deg, #ffb055, #fcff41, #ff5151, #ffb055)'
                          }}
                        />
                        <input
                          id={`colorHex${idx}`}
                          type="color"
                          onChange={(e) => setProductColors((prev: ProductColor[]) => prev.map((color: ProductColor, id: number) =>
                            idx === id ? { ...color, colorHex: e.target.value } : color
                          ))}
                          value='#ffffff'
                          className={styles.colorPickerInput}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Size */}
                  <div className={styles.sizesSection}>
                    <p className={product.sizes?.length > 0 ? styles.sizesTitle : styles.sizesTitleEmpty}>Sizes:</p>
                    <div className={styles.sizesList}>
                      {product.sizes?.length > 0 && product.sizes.map((item: { size: string; quantity: number }, id: number) => (
                        <div
                          onMouseEnter={() => setShowSizeTrash({ productId: idx, sizeId: id })}
                          onMouseLeave={() => setShowSizeTrash(null)}
                          onClick={() =>
                            setProductColors((prev: ProductColor[]) =>
                              prev.map((color: ProductColor, keyId: number) => keyId === idx ? {
                                ...color,
                                sizes: color.sizes.filter((_, index: number) => index !== id) // xóa phần tử tại vị trí `id`
                              } : color
                              )
                            )
                          }
                          className={`boom-small ${styles.sizeItem} ${showSizeTrash?.sizeId === id && showSizeTrash?.productId === idx ? styles.sizeItemHovered : ''}`}
                          key={id}
                        >
                          {showSizeTrash?.sizeId === id && showSizeTrash?.productId === idx && (
                            <img src={trashIcon} className={styles.sizeTrashIcon} />
                          )}
                          {`${item.size} : ${item.quantity}`}
                        </div>
                      ))}
                    </div>
                    <div className={styles.sizeInputContainer}>
                      <TextField
                        id='size-input'
                        onChange={(e) => setProductSizeAndQuantity((prev: SizeAndQuantity) => { return { ...prev, size: e.target.value, id: idx } })}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') {
                            if (!productSizeAndQuantity || !productSizeAndQuantity.size || !productSizeAndQuantity.quantity) return
                            setProductColors((prev: ProductColor[]) => prev.map((color: ProductColor, id: number) =>
                              idx === id ? { ...color, sizes: [...color.sizes || [], { size: productSizeAndQuantity.size, quantity: Number(productSizeAndQuantity.quantity) }].sort((a, b) => a.size.localeCompare(b.size)) } : color
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
                        onChange={(e) => setProductSizeAndQuantity((prev: SizeAndQuantity) => { return { ...prev, quantity: e.target.value, id: idx } })}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter') {
                            if (!productSizeAndQuantity || !productSizeAndQuantity.size || !productSizeAndQuantity.quantity) return
                            setProductColors((prev: ProductColor[]) => prev.map((color: ProductColor, id: number) =>
                              idx === id ? { ...color, sizes: [...color.sizes || [], { size: productSizeAndQuantity.size, quantity: Number(productSizeAndQuantity.quantity) }].sort((a, b) => a.size.localeCompare(b.size)) } : color
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
                      <div
                        className={styles.addSizeButton}
                        onClick={() => {
                          if (!productSizeAndQuantity || !productSizeAndQuantity.size || !productSizeAndQuantity.quantity) return
                          setProductColors((prev: ProductColor[]) => prev.map((color: ProductColor, id: number) =>
                            idx === id ? { ...color, sizes: [...color.sizes || [], { size: productSizeAndQuantity.size, quantity: Number(productSizeAndQuantity.quantity) }].sort((a, b) => a.size.localeCompare(b.size)) } : color
                          ))
                          setProductSizeAndQuantity({ size: '', quantity: '', id: '' })
                        }}
                      >
                        <p className={styles.addSizeButtonText}>Add size</p>
                      </div>
                    </div>
                  </div>

                  {/* Image Details */}
                  {product.color && (
                    <div className={styles.imageDetailsSection}>
                      <p className={styles.imageDetailsTitle}>Image Details:</p>
                      <div className={styles.imageDetailsList}>
                        {product.imageDetail.length > 0 && product.imageDetail.map((image: string, id: number) => (
                          <div
                            onMouseEnter={() => setShowImageTrash({ colorId: idx, imageId: id })}
                            onMouseLeave={() => setShowImageTrash(null)}
                            key={id}
                            className={`${styles.imageDetailItem} ${showImageTrash?.colorId === idx && showImageTrash?.imageId === id ? styles.imageDetailItemHovered : ''}`}
                          >
                            <div className={styles.imageDetailBox}>
                              <label htmlFor={`upload-image${idx}-${id}`} className={styles.imageDetailLabel}>
                                <div
                                  className={`slide-from-left ${styles.imageDetailUploadBox} ${showImageTrash?.colorId === idx && showImageTrash?.imageId === id ? styles.imageDetailUploadBoxHovered : ''}`}
                                >
                                  <img src={image} className={styles.imageDetailPreview} />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                                      const file = e.target.files?.[0]
                                      if (!file) return
                                      const image = await uploadImageAPI(file, productInfo.name, product.color)
                                      setProductColors((prev: ProductColor[]) => prev.map((color: ProductColor, i: number) =>
                                        idx === i ? {
                                          ...color, imageDetail: color.imageDetail.map((img: string, j: number) => j === id ? image.filePath : img
                                          )
                                        } : color
                                      ))
                                    }}
                                    className={styles.hiddenInput}
                                    id={`upload-image${idx}-${id}`}
                                  />
                                </div>
                              </label>
                            </div>
                            {showImageTrash && (
                              <div
                                className={`boom-small ${styles.imageDetailTrashButton}`}
                                onClick={() => handleDeleteImageDetail(idx, id)}
                                style={{ display: (showImageTrash.colorId === idx && showImageTrash.imageId === id) ? 'flex' : 'none' }}
                              >
                                <img src={trashIcon} className={styles.imageDetailTrashIcon} />
                              </div>
                            )}
                          </div>
                        ))}
                        {product.imageDetail.length < 6 && (
                          <div className={styles.addImageDetailBox}>
                            <label htmlFor={`upload-imageDetails${idx}`}>
                              <div className={styles.addImageDetailUploadBox}>
                                <img
                                  src={addImage}
                                  className={styles.addImageIcon}
                                />
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleUploadImageDetails(e, product.color, idx)}
                                className={styles.hiddenInput}
                                id={`upload-imageDetails${idx}`}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* add color button */}
              <div
                className={styles.addColorButton}
                onClick={() => setProductColors((prev: ProductColor[]) => [...prev, {
                  imageDetail: [],
                  color: '',
                  colorHex: '',
                  sizes: []
                }])}
              >
                <p className={styles.addColorButtonText}>Add Color</p>
                <img src={addIcon} className={styles.addIcon} />
              </div>
            </div>

          </div>
          {/* Button */}
          <div
            className={`${styles.submitButton} ${!navbarImage || !adImage ||
              Object.keys(productInfo).some((key: string) => !productInfo[key as keyof ProductInfo]) ||
              productColors.some((color: ProductColor) => Object.keys(color).some((key: string) => !color[key as keyof ProductColor]))
              ? styles.submitButtonDisabled : ''}`}
            onClick={() => {
              if (!navbarImage || !adImage ||
                Object.keys(productInfo).some((key: string) => !productInfo[key as keyof ProductInfo]) ||
                productColors.some((color: ProductColor) => Object.keys(color).some((key: string) => !color[key as keyof ProductColor]))
              ) return
              handleAddProduct()
            }}
          >
            {isLoadingAdd === 'idle' && (<p>Add</p>)}
            {isLoadingAdd === 'loading' && (
              <span className='spinner-white' style={{ width: '28px', height: '28px' }}></span>
            )}
            {isLoadingAdd === 'success' && (
              <span className='boom' style={{ display: 'flex', alignItems: 'center' }} >
                <img src={successIcon} className={styles.statusIcon} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal >
  )
}
