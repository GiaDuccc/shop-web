import Modal from '@mui/material/Modal'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import closeIcon from '~/assets/x-white.png'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import checkIcon from '~/assets/check.png'
import heartIcon from '~/assets/heart-outline.png'
import cartIcon from '~/assets/cart_2.png'
import heartColorIcon from '~/assets/heart-color.png'
import dingSound from '~/assets/ding-sound.mp3'
import tapSound from '~/assets/tap-sound.mp3'
import { jwtDecode } from 'jwt-decode'
import '~/App.scss'
import styles from './ProductCardDetail.module.scss'
import { addProductToCartAPI, findCartByCustomerId } from '~/apis/cartApi'

interface ProductCardDetailProps {
  product: Product
  open: boolean
  onClose: () => void
  onGoToCart: () => void
}

interface Product {
  adImage: string;
  brand: string;
  colors: ProductColor[];
  desc: string;
  highLight?: string;
  name: string;
  navbarImage: string;
  price: number;
  slug: string;
  stock: number;
  type: string;
  _id: string;
}

interface ProductColor {
  color: string;
  colorHex?: string;
  imageDetail: string[];
  sizes: {
    size: string;
    quantity: number;
  }[];
}

export default function ProductCardDetail({ product, open, onClose, onGoToCart }: ProductCardDetailProps) {

  const accessToken = localStorage.getItem('accessToken') || null
  const user = accessToken ? jwtDecode(accessToken) as { userId: string } : null

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [activeProductColor, setActiveProductColor] = useState<ProductColor | null>(null)
  const [activeSize, setActiveSize] = useState<string | null>(null)

  const [currentImage, setCurrentImage] = useState<{ image: string; id: number } | null>(null)

  const tickSound = new Audio(dingSound)
  const addFavouriteSound = new Audio(tapSound)

  const [addProductStatus, setAddProductStatus] = useState<'idle' | 'loading' | 'success' | 'go-to-cart'>('idle')
  const [addFavouriteStatus, setAddFavouriteStatus] = useState(false)

  const handleClose = () => {
    const currentParams = Object.fromEntries(searchParams.entries())
    delete currentParams.productDetail
    setSearchParams(currentParams, { replace: false })
    onClose()
  }

  const handleAddToCart = async () => {
    if (!user) return navigate('/sign-in')

    if (!activeProductColor || !activeSize) return
    setAddProductStatus('loading')

    const productData = {
      productId: product._id,
      color: activeProductColor.color,
      size: parseInt(activeSize),
      quantity: 1,
    }

    try {
      const cart = await findCartByCustomerId(user.userId)
      if (cart) {
        await addProductToCartAPI(cart._id, productData)
      }
      tickSound.volume = 0.25
      tickSound.play()
      setAddProductStatus('success')
      // setTimeout(() => setAddProductStatus('success'), 250)
      setTimeout(() => setAddProductStatus('go-to-cart'), 1500)
      setTimeout(() => setAddProductStatus('idle'), 5000)

    } catch (error) {
      setAddProductStatus('idle')
    }
  }

  const handleOpenCart = () => {
    onGoToCart()
    handleClose()
  }

  useEffect(() => {
    setActiveSize(null)
  }, [activeProductColor])

  useEffect(() => {
    // Set URL param
    const currentParams = Object.fromEntries(searchParams.entries())

    setSearchParams(
      {
        ...currentParams,      // giữ lại params cũ
        productDetail: product.slug  // thêm / cập nhật param mới
      },
      { replace: true }
    )

    // First load
    const firstLoad = () => {
      const firstColor = product.colors[0]
      setActiveProductColor(firstColor)
      setCurrentImage({ image: firstColor.imageDetail[0], id: 0 })
    }
    firstLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!activeProductColor || !currentImage) return null

  return (
    <Modal
      className={styles.modal}
      open={open}
      onClick={handleClose}
    >
      <div className={styles.modal_backdrop}>
        <div
          className={`fade-in-up ${styles.modal_content}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className={styles.close_button} onClick={handleClose}>
            <img src={closeIcon} alt="Close" />
          </div>

          <div className={styles.content_wrapper}>
            <div className={styles.main_container}>

              {/* Left Images */}
              <div className={styles.left_sidebar}>
                {activeProductColor.imageDetail.map((img, index) => (
                  <div
                    className={styles.thumbnail_image}
                    key={index}
                    onClick={() => setCurrentImage({ image: img, id: index })}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>

              {/* Center - Main Image */}
              <div className={styles.center_section}>
                <div className={styles.main_image_container}>
                  <img src={currentImage.image} alt="Product" />

                  <div className={styles.image_controls}>
                    {/* Prev */}
                    <div
                      className={styles.image_nav_button}
                      onClick={() => {
                        const prevId = currentImage.id === 0
                          ? activeProductColor.imageDetail.length - 1
                          : currentImage.id - 1
                        setCurrentImage({
                          image: activeProductColor.imageDetail[prevId],
                          id: prevId
                        })
                      }}
                    >
                      <img src={leftIcon} alt="Prev" />
                    </div>

                    {/* Next */}
                    <div
                      className={styles.image_nav_button}
                      onClick={() => {
                        const nextId = currentImage.id === activeProductColor.imageDetail.length - 1
                          ? 0
                          : currentImage.id + 1
                        setCurrentImage({
                          image: activeProductColor.imageDetail[nextId],
                          id: nextId
                        })
                      }}
                    >
                      <img src={rightIcon} alt="Next" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className={styles.right_section}>

                {/* Info */}
                <div className={styles.product_info_section}>
                  <p className={styles.stock_status}>
                    {product.stock > 0 ? 'Just in' : 'Sold out'}
                  </p>

                  <p className={styles.product_name}>{product.name}</p>

                  <p className={styles.product_type}>
                    {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                  </p>

                  <p className={styles.product_price}>
                    {product.price.toLocaleString('vi-VN')}đ
                  </p>

                  <p className={styles.color_label}>
                    {activeProductColor.color.charAt(0).toUpperCase() +
                      activeProductColor.color.slice(1)}
                  </p>
                </div>

                {/* Color List */}
                <div className={styles.color_image_list}>
                  {product.colors.map((c, index) => {
                    const isOutOfStock = c.sizes.every(size => size.quantity === 0)

                    return (
                      <div
                        key={index}
                        className={`${styles.color_image}
                          ${activeProductColor.color === c.color ? styles.active : ''}
                          ${isOutOfStock ? styles.out_of_stock : ''}`}
                        onClick={() => {
                          setActiveProductColor(c)
                          setCurrentImage({ image: c.imageDetail[0], id: 0 })
                        }}
                      >
                        <img src={c.imageDetail[0]} alt={c.color} />

                        {isOutOfStock && <div className={styles.sold_out_line} />}
                      </div>
                    )
                  })}
                </div>

                {/* Sizes */}
                <div className={styles.size_section}>
                  <p className={styles.size_label}>Select Size</p>

                  <div className={styles.size_options}>
                    {activeProductColor.sizes.map((s, idx) => (
                      <div
                        key={idx}
                        className={`
                          ${styles.size_option} 
                          ${activeSize === s.size ? styles.active : ''}
                          ${s.quantity === 0 ? styles.out_of_stock : ''}
                        `}
                        onClick={() => s.quantity > 0 && setActiveSize(s.size)}
                      >
                        <p>{s.size}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add to Cart */}
                <div className={styles.actions_section}>
                  <div
                    className={`
                      ${styles.action_button} 
                      ${!activeSize && user ? styles.disabled : ''}
                    `}
                    onClick={() =>
                      addProductStatus === 'idle' &&
                      handleAddToCart()
                    }
                  >
                    {addProductStatus === 'idle' && (
                      <p className='fade-in'>{user ? 'Add to Cart' : 'Sign in to shopping'}</p>
                    )}
                    {addProductStatus === 'loading' && (
                      <span className='spinner-white' style={{ width: 28, height: 28 }}></span>
                    )}
                    {addProductStatus === 'success' && (
                      <span className='boom'>
                        <img src={checkIcon} alt="Success" style={{ width: 32, height: 32 }} />
                      </span>
                    )}
                    {addProductStatus === 'go-to-cart' && (
                      <div
                        className={`fade-in ${styles.go_to_cart}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenCart()
                        }}
                      >
                        <p>Go to Cart</p>
                        <img src={cartIcon} alt="Go to Cart" />
                      </div>
                    )}
                  </div>

                  {/* Favourite */}
                  <div
                    className={styles.favourite_button}
                    onClick={() => {
                      setAddFavouriteStatus(!addFavouriteStatus)
                      if (!addFavouriteStatus) {
                        addFavouriteSound.volume = 0.4
                        addFavouriteSound.play()
                      }
                    }}
                  >
                    <p>Add Favourite</p>

                    {addFavouriteStatus ? (
                      <img className='boom' src={heartColorIcon} alt="Favorite" />
                    ) : (
                      <div className={styles.heart_icon_boom}>
                        <img className='fade-in' src={heartIcon} alt="Add favorite" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Highlight & Desc */}
                <div>
                  {product.highLight && (
                    <div className={styles.highlight_section}>
                      <p>{product.highLight}</p>
                    </div>
                  )}

                  {product.desc && (
                    <div className={styles.description_section}>
                      <p className={styles.description_title}>Description:</p>
                      <p className={styles.description_text}>{product.desc}</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </Modal>
  )
}