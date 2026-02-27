/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import HeroSection from '~/components/HeroSection/HeroSection'
import Container from '@mui/material/Container'
import productHeroSection from '~/assets/videoHeroSection/Product2.mp4'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAllProductPageAPI } from '~/apis/clientAPI/productApi'
import ProductList from './ProductList/ProductList'
import Filter from './Filter/Filter'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import '~/App.scss'
import styles from './ProductPage.module.scss'
import {Product} from '~/interface/product.interface'


function ProductPage() {
  // state lưu danh sách sản phẩm
  const [productList, setProductList] = useState<Product[]>([])
  // Theo dõi biến ref (mục đích cho cuộn lên khi đổi trang)
  const contentRef = useRef<HTMLDivElement | null>(null)
  // lưu biến lần đầu load tránh vào lần đầu bị cuộn lên
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  // state lưu khi đang fetch
  const [isLoading, setIsLoading] = useState(true)
  // state lưu trang product (dùng để lưu trang product đã qua và trang product mới để khi đổi trang không bị khựng)
  const [productCache, setProductCache] = useState<Record<string, any>>({})

  // set param trên URL
  const [searchParams, setSearchParams] = useSearchParams()
  // Lấy ra page ở trên URL, nếu chưa có thì mặc định là 1 khi vừa vào trang lần đầu
  const [searchProduct, setSearchProduct] = useState(searchParams.get('search'))

  // set Current page bằng page trên param
  // const [currentPage, setCurrentPage] = useState(pageFromURL)
  const currentPage = parseInt(searchParams.get('page') || '1')

  // state lưu tổng trang để làm mục trang phía cuối
  const [totalPages, setTotalPages] = useState(0)

  // State lưu filterOptions

  const [brandFilter, setBrandFilter] = useState<string | null>(null)
  const [colorFilter, setColorFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [stockFilter, setStockFilter] = useState<string | null>(null)
  const [sortFilter, setSortFilter] = useState<string | null>(null)


  // Hàm handle khi next trang
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = String(currentPage + 1)
      setSearchParams(currentParams, { replace: false })
    }
  }

  // Hàm handle khi prev trang
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = String(currentPage - 1)
      setSearchParams(currentParams, { replace: false })
    }
  }

  // UseEffect load trang hiện tại
  useEffect(() => {
    setIsLoading(true)

    const allParams = Object.fromEntries(searchParams.entries())
    const { page, limit, slug, ...filters } = allParams
    const cacheKey = searchParams.toString()

    if (productCache[cacheKey]) {
      setProductList(productCache[cacheKey])
      setIsLoading(false)
    } else {
      fetchAllProductPageAPI(currentPage, 24, filters).then(data => {
        const products = data.data.products

        setProductList(products)
        setProductCache(prev => ({
          ...prev,
          [currentPage]: products
        }))
        setTotalPages(Math.ceil(data.data.total / 24))
        setIsLoading(false)
      })
    }
  }, [currentPage, brandFilter, colorFilter, typeFilter, stockFilter, sortFilter, searchProduct])

  // UseEffect load lần load đầu tiên
  useEffect(() => {
    setIsFirstLoad(false)
  }, []) // Chạy 1 lần duy nhất

  // Chạy khi đổi trang hoặc filter để scroll
  // Bug thay đổi filter chưa được áp hiệu ứng cuộn
  useEffect(() => {
    if (!isFirstLoad || searchProduct) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 250)
    }
  }, [currentPage, brandFilter, colorFilter, typeFilter, stockFilter, sortFilter, searchProduct])

  useEffect(() => {
    if (!isFirstLoad) {
      setSearchProduct(searchParams.get('search'))
      setBrandFilter(searchParams.get('brand'))
      setColorFilter(searchParams.get('color'))
      setTypeFilter(searchParams.get('type'))
      setStockFilter(searchParams.get('stock'))
      setSortFilter(searchParams.get('sort'))
    }
  }, [searchParams])

  return (
    <Container
      disableGutters
      maxWidth={false}
      className={styles.container}
    >
      <HeroSection video={productHeroSection} title={'My product'} descTitle={'More Than Just Shoes.'} type='video' />
      {/* Product list & Filter */}
      <div
        ref={contentRef}
        id="productContent"
        className={styles.content_section}
      >
        <div className={styles.title_container}>
          {searchProduct ? (
            <div>
              <p className={styles.main_title}>
                Search results for.
              </p>
              <p className={styles.sub_title}>
                {searchProduct.length > 30 ? `${searchProduct.slice(0, 30)}...` : searchProduct}
              </p>
            </div>
          ) : (
            <div>
              <p className={styles.main_title}>
                All products.
              </p>
              <p className={styles.sub_title}>Choose for you</p>
            </div>
          )}
        </div>

        <div
            className={`${styles.product_filter_wrapper} ProductList_Filter`}
          >

            {/* Filter */}
            <Filter currentPage={currentPage} />

            {isLoading ? (
              <div className={styles.loading_container}>
                <div className='spinner-large'></div>
              </div>
            ) : (
              <div className={`${styles.product_list_container} fade-in`}>
                <ProductList products={productList} />
                {/* button */}
                <div className={styles.pagination_controls}>
                  {currentPage === 1 || totalPages === 0 ?
                    (<div className={styles.pagination_spacer}></div>)
                    :
                    (<div
                      className={styles.pagination_button}
                      onClick={handlePrevPage}
                    >
                      <img src={leftIcon} alt="Previous" />
                    </div>)
                  }

                  <p className={styles.current_page}>{currentPage}</p>
                  {currentPage === totalPages || totalPages === 0 ?
                    (<div className={styles.pagination_spacer}></div>)
                    :
                    (<div
                      className={styles.pagination_button}
                      onClick={handleNextPage}
                    >
                      <img src={rightIcon} alt="Next" />
                    </div>)
                  }
                </div>
              </div>
            )}


          </div>
      </div>
    </Container>
  )
}

export default ProductPage