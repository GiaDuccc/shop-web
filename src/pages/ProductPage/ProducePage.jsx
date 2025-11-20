/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import Header from '~/components/Header/Header'
import HeroSection from '~/components/HeroSection/HeroSection'
import Slogan from '~/components/Slogan/Slogan'
import Container from '@mui/material/Container'
import productHeroSection from '~/assets/videoHeroSection/Product2.mp4'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAllProductPageAPI } from '~/apis/productApi'
import ProductList from './ProductList/ProductList'
import Filter from './Filter/Filter'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import '~/App.scss'
import Footer from '~/components/Footer/Footer'
import FadeInSection from '~/components/FadeInSection/FadeInSection60'

function ProductPage() {
  // state lưu danh sách sản phẩm
  const [productList, setProductList] = useState([])
  // Theo dõi biến ref (mục đích cho cuộn lên khi đổi trang)
  const contentRef = useRef(null)
  // lưu biến lần đầu load tránh vào lần đầu bị cuộn lên
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  // state lưu khi đang fetch
  const [isLoading, setIsLoading] = useState(true)
  // state lưu trang product (dùng để lưu trang product đã qua và trang product mới để khi đổi trang không bị khựng)
  const [productCache, setProductCache] = useState({})

  // set param trên URL
  const [searchParams, setSearchParams] = useSearchParams()
  // Lấy ra page ở trên URL, nếu chưa có thì mặc định là 1 khi vừa vào trang lần đầu
  const pageFromURL = parseInt(searchParams.get('page')) || 1
  const [searchProduct, setSearchProduct] = useState(searchParams.get('search'))

  // set Current page bằng page trên param
  // const [currentPage, setCurrentPage] = useState(pageFromURL)
  const currentPage = pageFromURL

  // state lưu tổng trang để làm mục trang phía cuối
  const [totalPages, setTotalPages] = useState(0)

  // State lưu filterOptions
  // const [filterOptions, setFilterOptions] = useState([])

  const [brandFilter, setBrandFilter] = useState(null)
  const [colorFilter, setColorFilter] = useState(null)
  const [typeFilter, setTypeFilter] = useState(null)
  const [stockFilter, setStockFilter] = useState(null)
  const [sortFilter, setSortFilter] = useState(null)


  // Hàm handle khi next trang
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = currentPage + 1
      setSearchParams(currentParams, { replace: false })
    }
  }

  // Hàm handle khi prev trang
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = currentPage - 1
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
        const products = data.data.products.map(product => ({
          colors: product.colors.map(color => ({
            ...color,
            color: color.color.toLowerCase()
          })),
          id: product._id,
          ...product
        }))

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

  // UseEffect load trang kế tiếp (trang hiện tại + 1)
  useEffect(() => {
    const allParams = Object.fromEntries(searchParams.entries())
    const { page, limit, ...filters } = allParams
    if (!productCache[currentPage + 1] && currentPage < totalPages) {
      fetchAllProductPageAPI(currentPage + 1, 24, filters).then(data => {
        const nextProducts = data.data.products.map(product => ({
          colors: product.colors.map(color => ({
            ...color,
            color: color.color.toLowerCase()
          })),
          id: product._id,
          ...product
        }))
        setProductCache(prev => ({
          ...prev,
          [currentPage + 1]: nextProducts
        }))
      })
    }
  }, [currentPage, brandFilter, colorFilter, typeFilter, stockFilter, sortFilter])

  // UseEffect load lần load đầu tiên
  useEffect(() => {
    setIsFirstLoad(false)
  }, []) // Chạy 1 lần duy nhất

  // Chạy khi đổi trang hoặc filter để scroll
  // Bug thay đổi filter chưa được áp hiệu ứng cuộn
  useEffect(() => {
    if (!isFirstLoad || searchProduct) {
      setTimeout(() => {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      sx={{
        bgcolor: 'white',
        width: '100%',
        height: 'fit-content'
      }}
    >
      <Header />
      <Slogan />
      <HeroSection video={productHeroSection} title={'My product'} descTitle={'More Than Just Shoes.'} type='video' />
      {/* Product list & Filter */}
      <Box
        ref={contentRef}
        id="productContent"
        sx={{
          p: '0 84px 64px',
          height: 'fit-content',
          width: '100%'
        }}
      >
        <Box>
          {searchProduct ? (
            <Box>
              <Typography sx={{ color: 'rgba(0,0,0,.85)', fontSize: '48px', fontWeight: '600', p: '24px 8px', display: 'inline-block' }} >
                Search results for.
              </Typography>
              <Typography sx={{ display: 'inline-block', color: '#7e7e85', fontSize: '48px', fontWeight: '600' }} >
                {searchProduct.length > 30 ? `${searchProduct.slice(0, 30)}...` : searchProduct}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography sx={{ color: 'rgba(0,0,0,.85)', fontSize: '48px', fontWeight: '600', p: '24px 8px', display: 'inline-block' }} >
                All products.
              </Typography>
              <Typography sx={{ display: 'inline-block', color: '#7e7e85', fontSize: '48px', fontWeight: '600' }} >Choose for you</Typography>
            </Box>
          )}
        </Box>

        {isLoading ?
          (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', flex: 8 }}>
            <Box className='spinner-large'></Box>
          </Box>)
          :
          (<Box
            // key={currentPage}
            className="ProductList_Filter"
            sx={{ display: 'flex', gap: 2, height: '100%' }}
          >

            {/* Filter */}
            <Filter currentPage={currentPage} />

            {/* Products list */}
            <Box
              className="fade-in"
              sx={{
                flex: 8,
                height: 'fit-content'
              }}
            >
              <ProductList products={productList} />
              {/* button */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                {currentPage === 1 || totalPages === 0 ?
                  (<Box sx={{ width: '40px', height: '40px', bgcolor: 'white' }}></Box>)
                  :
                  (<Box
                    sx={{
                      bgcolor: '#f3f3f3',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '36px',
                      transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                      transformOrigin: 'center',
                      color: 'rgba(0,0,0,.5)',
                      '&:hover': {
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,.85)',
                        cursor: 'pointer',
                        boxShadow: '0.5px 0.5px 10px rgb(220, 220, 220)'
                      },
                      '&:hover img': {
                        filter: 'invert(100%)'
                      }
                    }}
                    onClick={handlePrevPage}
                  >
                    <img src={leftIcon} style={{ width: '16px', height: '16px' }} />
                  </Box>)
                }

                <Typography sx={{ color: '#000', fontSize: '16px' }}>{currentPage}</Typography>
                {currentPage === totalPages || totalPages === 0 ?
                  (<Box sx={{ width: '40px', height: '40px', bgcolor: 'white' }}></Box>)
                  :
                  (<Box
                    sx={{
                      bgcolor: '#f3f3f3',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '36px',
                      transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                      transformOrigin: 'center',
                      color: 'rgba(0,0,0,.5)',
                      '&:hover': {
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,.85)',
                        cursor: 'pointer',
                        boxShadow: '0.5px 0.5px 10px rgb(220, 220, 220)'
                      },
                      '&:hover img': {
                        filter: 'invert(100%)'
                      }
                    }}
                    onClick={handleNextPage}
                  >
                    <img src={rightIcon} style={{ width: '16px', height: '16px' }} />
                  </Box>)
                }
              </Box>
            </Box>

          </Box>)
        }
      </Box>
      <Footer />
    </Container>
  )
}

export default ProductPage