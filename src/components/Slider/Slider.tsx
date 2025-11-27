import { useEffect, useRef, useState } from 'react'
import { fetchLimitedProductsAPI } from '~/apis/productApi'
import rightIcon from '~/assets/right.png'
import leftIcon from '~/assets/left.png'
import ProductCardDetail from '~/pages/ProductPage/ProductList/ProductCardDetail/ProductCardDetail'
import { useSearchParams } from 'react-router-dom'
import '~/App.scss'
import styles from './Slider.module.scss'
import { Product } from '~/interface/product.interface'
import Cart from '../Cart/Cart'

interface SliderProps {
  id: string
  name: string
  type: string
  brand: string
}

function Slider({ id, name, type, brand }: SliderProps) {
  const [products, setProducts] = useState<Product[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  const [productSelected, setProductSelected] = useState<Product | null>(null)
  const [, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isActiveCart, setIsActiveCart] = useState<boolean>(false)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      const data = await fetchLimitedProductsAPI(brand, type)
      if (data) setIsLoading(false)
      setProducts(data)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]) // Gọi lại nếu type thay đổi

  const sliderNextItem = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: 424,
        behavior: 'smooth'
      })
    }
  }

  const sliderPrevItem = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -424,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div id={id} className={styles.slider_container}>
      <h2 className={styles.slider_title}>{name}</h2>
      <div ref={sliderRef} className={styles.slider_wrapper}>
        {isLoading && (
          <div className={styles.loading_wrapper}>
            <div className='spinner-large'></div>
          </div>
        )}
        {!isLoading && products.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setSearchParams({ slug: item.slug })
              setProductSelected(item)
            }}
            className={`${styles.product_card} ${products.length > 3 ? styles.with_margin : styles.no_margin}`}
            style={{ backgroundImage: `url("${item.adImage}")` }}
          >
            <div className={styles.product_info}>
              <p className={styles.product_name}>{item.name}</p>
              <p className={styles.product_price}>From {Number(item.price).toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        ))}
      </div>
      {products?.length > 3 && (
        <div className={styles.navigation_buttons}>
          <div className={styles.nav_button} onClick={sliderPrevItem}>
            <img src={leftIcon} alt="previous" />
          </div>
          <div className={styles.nav_button} onClick={sliderNextItem}>
            <img src={rightIcon} alt="next" />
          </div>
        </div>
      )}
      {productSelected && (
        <ProductCardDetail 
          open={Boolean(productSelected)} 
          onClose={() => setProductSelected(null)} 
          product={productSelected} 
          onGoToCart={() => setIsActiveCart(true)}
        />
      )}
      {isActiveCart && (
        <Cart open={isActiveCart} toggleDrawer={() => setIsActiveCart(false)} />
      )}
    </div>
  )
}

export default Slider