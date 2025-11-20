import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import searchIcon from '~/assets/search.png'
import closeIcon from '~/assets/x-white.png'
import closeIconBlack from '~/assets/x.png'
import logoIcon from '~/assets/logo2.png'
import { useEffect, useState } from 'react'
import ProductCardDetail from '~/pages/ProductPage/ProductList/ProductCardDetail/ProductCardDetail'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import '~/App.scss'
import styles from './Search.module.scss'

interface Product {
  _id: string
  name: string
  colors: Array<{
    color: string
    imageDetail: string[]
  }>
  stock: number
  type: string
  price: number
  [key: string]: any
}

interface SearchProps {
  open: boolean
  toggleDrawer: () => void
  productList: Product[]
}

function Search({ open, toggleDrawer, productList }: SearchProps) {

  const [searchValue, setSearchValue] = useState<string>('')
  const [searchProduct, setSearchProduct] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchRecent, setSearchRecent] = useState<string[]>(JSON.parse(localStorage.getItem('searchRecent') || '[]'))
  const [, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (product: Product) => {
    let updatedRecent = [...searchRecent]

    // Xoá nếu đã tồn tại (để không bị trùng)
    updatedRecent = updatedRecent.filter(item => item !== searchValue)

    // Thêm mới vào đầu
    updatedRecent.unshift(searchValue)

    if (searchRecent.length > 5) {
      updatedRecent.pop()
    }
    localStorage.setItem('searchRecent', JSON.stringify(updatedRecent))
    setSearchRecent(updatedRecent)

    const selectedProduct = {
      ...product,
      colors: product.colors.map(color => ({
        ...color,
        imageDetail: color.imageDetail.map(image =>
          `${image}`
        )
      })),
      id: product._id
    }
    setSelectedProduct(selectedProduct)
    toggleDrawer()
    navigate(`/NiceStore/product-list/${product._id}/${product.colors[0].color}`, { state: { product: selectedProduct } })
  }

  const handleEnter = (data: string) => {
    let updatedRecent = [...searchRecent]

    // Xoá nếu đã tồn tại (để không bị trùng)
    updatedRecent = updatedRecent.filter(item => item !== searchValue)

    // Thêm mới vào đầu
    updatedRecent.unshift(searchValue)

    if (searchRecent.length > 5) {
      updatedRecent.pop()
    }
    localStorage.setItem('searchRecent', JSON.stringify(updatedRecent))
    setSearchRecent(updatedRecent)

    if (location.pathname === '/NiceStore/product-list') {
      const newParams = new URLSearchParams()
      newParams.set('search', data)
      setSearchParams(newParams, { replace: false })
      return
    }
    navigate(`/NiceStore/product-list?search=${encodeURIComponent(data)}`)
  }

  useEffect(() => {
    setSearchValue('')
  }, [open])

  useEffect(() => {
    const searchProduct = productList.filter(product => {
      if (searchValue.length < 2) return false
      return product.name.toLowerCase().includes(searchValue.toLowerCase())
    })
    setSearchProduct(searchProduct.slice(0, 5))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        transitionDuration={150}
        ModalProps={{
          BackdropProps: {
            sx: {
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }
          }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100vw',
            bgcolor: 'white',
            overflow: 'hidden',
            height: '60%',
            boxShadow: '4px 4px 15px rgb(80, 80, 80)'
          }
        }}
      >
        <div className={`fade-in ${styles.container}`}>
          {/* Header */}
          <div className={styles.header}>
            {/* Logo */}
            <div className={styles.logoSection}>
              <img className='boom-small' src={logoIcon} style={{ width: '70px', height: '70px' }} />
            </div>
            {/* Search */}
            <div className={styles.searchSection}>
              <TextField
                placeholder='Search'
                type="text"
                value={searchValue}
                className='slide-from-right'
                onChange={e => setSearchValue(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleEnter((e.target as HTMLInputElement).value)
                    toggleDrawer()
                  }
                }}
                autoFocus
                sx={{
                  width: '100%',
                  height: '40px',
                  input: {
                    color: 'black',
                    width: 'calc(100% - 45px)',
                    fontSize: '18px',
                    paddingRight: '8px',
                    py: 0
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none'
                    },
                    '&:hover fieldset': {
                      border: 'none'
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none'
                    }
                  }
                }}
                InputProps={{
                  sx: {
                    bgcolor: 'rgba(242, 242, 242, 0.9)',
                    borderRadius: 40,
                    padding: 0,
                    '&:hover ': {
                      bgcolor: 'rgb(228, 228, 228)'
                    }
                  },
                  endAdornment: (
                    <div
                      onClick={() => {
                        handleEnter(searchValue)
                        toggleDrawer()
                      }}
                      className={styles.searchButton}
                    >
                      <img src={searchIcon} alt="search" className={styles.searchIcon} />
                    </div>
                  )
                }}
              />
            </div>
            {/* Close button */}
            <div className={styles.closeSection}>
              <div
                className={`boom-small ${styles.closeButton}`}
                onClick={toggleDrawer}
              >
                <img src={closeIcon} className={styles.closeIcon} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.mainContent}>
              {searchValue.length >= 2 ? (
                <div className={`fade-in-up ${styles.recentSection}`}>
                  <h3 className={styles.sectionTitle}>Recent Searches</h3>
                  {searchRecent.map((value, idx) => (
                    <div
                      key={idx}
                      className={styles.recentItem}
                    >
                      <span
                        className={styles.recentText}
                        onClick={() => setSearchValue(value)}
                      >{value}</span>
                      <img
                        onClick={() => {
                          const updatedRecent = [...searchRecent]
                          updatedRecent.splice(idx, 1)
                          localStorage.setItem('searchRecent', JSON.stringify(updatedRecent))
                          setSearchRecent(updatedRecent)
                        }}
                        src={closeIconBlack}
                        className={styles.deleteIcon}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyRecentSection}></div>
              )}

              <div className={`${styles.resultsContainer} ${searchValue.length >= 2 ? styles.row : styles.column}`}>
                {searchValue.length >= 2 ? (
                  searchProduct.map((product, idx) => (
                    <div
                      className={`fade-in-right ${styles.productCard}`}
                      onClick={() => {
                        handleClick(product)
                        toggleDrawer()
                      }}
                      key={idx}
                    >
                      {/* img */}
                      <div className={styles.productImageContainer}>
                        <img
                          src={product.colors[0].imageDetail[0]}
                          className={styles.productImage}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <div className={styles.productDetails}>
                          {/* stock */}
                          <div>
                            <span className={styles.stockText}>
                              {product.stock > 0 ? 'Just in' : 'Sold out'}
                            </span>
                          </div>
                          {/* Name */}
                          <div>
                            <h4 className={styles.productName}>
                              {product.name}
                            </h4>
                          </div>
                          {/* Type */}
                          <div>
                            <span className={styles.productType}>
                              {product.type.slice(0, 1).toUpperCase() + product.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        {/* Price */}
                        <div>
                          <span className={styles.productPrice}>
                            {Number(product.price).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  )))
                  :
                  (
                    <div className='fade-in-up'>
                      <h3 className={styles.sectionTitle}>Recent Searches</h3>
                      {searchRecent.map((value, idx) => (
                        <div
                          key={idx}
                          className={styles.recentItem}
                        >
                          <span
                            className={styles.recentText}
                            onClick={() => setSearchValue(value)}
                          >{value}</span>
                          <img
                            onClick={() => {
                              const updatedRecent = [...searchRecent]
                              updatedRecent.splice(idx, 1)
                              localStorage.setItem('searchRecent', JSON.stringify(updatedRecent))
                              setSearchRecent(updatedRecent)
                            }}
                            src={closeIconBlack}
                            className={styles.deleteIcon}
                          />
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
              <div className={`${styles.rightSpacer} ${searchValue.length >= 2 ? 'hidden' : ''}`}></div>
            </div>
          </div>
        </div>
      </Drawer>
      {selectedProduct && (
        <ProductCardDetail
          product={selectedProduct}
          open={Boolean(selectedProduct)}
          onClose={() => {
            setSelectedProduct(null)
          }}
        />
      )}
    </>
  )
}

export default Search