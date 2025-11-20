/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { fetchAllProductPageAPI, deleteProductAPI } from '~/apis/productApi'
import editIcon from '~/assets/edit.png'
import trashIcon from '~/assets/trash.png'
import searchIcon from '~/assets/search.png'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import { useSearchParams } from 'react-router-dom'
import '~/App.scss'
import Button from '~/components/Button/Button'
import ModalWarning from './ModalWarning/ModalWarning'
import EditProduct from './EditProduct/EditProduct'
import AddProduct from './AddProduct/AddProduct'
import theme from '~/theme'
import { jwtDecode } from 'jwt-decode'

function Product({ userId, userRole }) {
  // set param trên URL
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page')) || 1

  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const filters = ['newest', 'oldest', 'high-low', 'low-high']
  const [filterSelected, setFilterSelected] = useState(-1)
  const [showWarning, setShowWarning] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [productToEdit, setProductToEdit] = useState(null)
  const [isAddProduct, setIsAddProduct] = useState(false)
  // handleLoading
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  const fetchProducts = async () => {
    const allParams = Object.fromEntries(searchParams.entries())
    const { page, section, ...filters } = allParams
    await fetchAllProductPageAPI(currentPage, 12, filters).then(data => {
      setProducts(data.data.products)
      setTotalPages(Math.ceil(data.data.total / 12))
      setIsLoadingProducts(false)
    })
  }

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

  const handleSearch = (data) => {
    const currentParams = Object.fromEntries(searchParams.entries())
    if (currentParams.search === data.trim()) return
    if (data.trim() === '') delete currentParams.search
    else currentParams.search = data
    setSearchParams(currentParams, { replace: false })
  }

  const handleDelete = async () => {
    await deleteProductAPI(productToDelete).then(() => {
      setIsLoadingProducts(true)
      setTimeout(() => {
        setIsLoadingProducts(false)
      }, 500)
      fetchProducts()
    })
  }

  const handleFilter = () => {
    const currentParams = Object.fromEntries(searchParams.entries())
    if (filterSelected + 1 > filters.length - 1) {
      delete currentParams.sort
      setSearchParams(currentParams, { replace: false })
      setFilterSelected(-1)
      return
    }
    currentParams.sort = filters[filterSelected + 1]
    setSearchParams(currentParams, { replace: false })
    setFilterSelected(filterSelected + 1)
  }

  useEffect(() => {
    setIsLoadingProducts(true)
    fetchProducts()
  }, [searchParams])

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      p: '32px'
    }}>
      {/* hearder */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '40px', mr: '44px' }}>
        {/* Search */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', flex: '8' }}
        >
          <TextField
            placeholder='Search'
            type="text"
            value={searchValue}
            className='slide-from-right'
            onChange={e => {
              handleSearch(e.target.value)
              setSearchValue(e.target.value)
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
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    bgcolor: 'rgba(242, 242, 242, 0.9)',
                    borderRadius: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '&:hover': {
                      cursor: 'pointer',
                      bgcolor: 'rgb(202, 202, 202)'
                    }
                  }} >
                  <img src={searchIcon} alt="search" style={{ height: '16px', width: 'auto' }} />
                </Box>
              )
            }}
          />
        </Box>
        {/* Add */}
        <Button onClick={() => setIsAddProduct(true)} className='boom-small' flex={2} height='100%' bgcolor='#000' content='Add' fontSize='18px' borderRadius='12px' color='#fff' />
        {/* Filter */}
        <Button onClick={() => handleFilter()} className='boom-small' flex={2} height='100%' bgcolor='#ccc' content={searchParams.get('sort') ? searchParams.get('sort').slice(0, 1).toUpperCase() + searchParams.get('sort').slice(1) : 'Filter'} fontSize='18px' borderRadius='12px' color='#000' />
      </Box>
      {isLoadingProducts ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '40vh' }}>
          <Box className='spinner-large'></Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {products?.map((product, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                className='fade-in-up'
                key={idx}
                sx={{
                  flex: 1,
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
                    src={product.colors[0].imageDetail[0]}
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
                  <Typography sx={{ fontSize: '16px', color: '#696969' }}>{product.type.slice(0, 1).toUpperCase() + product.type.slice(1)}</Typography>
                  <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                    {'Color: '}
                    <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: 'black' }} >
                      {product.colors.length}
                    </span>
                  </Typography>
                  <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                    {'Quantity: '}
                    <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: 'black' }}>
                      {product.stock}
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
                    {(Number(product.price)).toLocaleString('vi-VN')}đ
                  </Typography>
                  <Typography sx={{
                    fontSize: '14px',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    color: 'rgba(0,0,0,.45)'
                  }}>
                    {new Date(product.importAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  pl: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  '& img:hover': {
                    cursor: 'pointer',
                    opacity: .5
                  }
                }}>
                <Box
                  onClick={() => {
                    setProductToEdit(product)
                  }}
                  component='img'
                  src={editIcon}
                  sx={{
                    width: '24px',
                    height: '24px'
                  }}
                />
                <Box
                  onClick={() => {
                    setShowWarning(true)
                    setProductToDelete(product._id)
                  }}
                  component='img'
                  src={trashIcon}
                  sx={{
                    width: '24px',
                    height: '24px'
                  }}
                />
              </Box>
            </Box>
          ))}
          {/* Button */}
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
                    color: '#fff',
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
      )}
      {showWarning && userRole === 'manager' && (
        <ModalWarning open={showWarning} onClose={() => setShowWarning(false)} cancel={() => setShowWarning(false)} handleDelete={() => {
          handleDelete()
          setShowWarning(false)
        }} />
      )}
      {productToEdit && userRole === 'manager' && (
        <EditProduct open={Boolean(productToEdit)} onClose={() => setProductToEdit(null)} product={productToEdit} refresh={() => {
          setIsLoadingProducts(true)
          fetchProducts()
        }} />
      )}
      {isAddProduct && userRole === 'manager' && (
        <AddProduct open={Boolean(isAddProduct)} onClose={() => setIsAddProduct(false)} refresh={() => {
          setIsLoadingProducts(true)
          fetchProducts()
        }} />
      )}
    </Box>
  )
}

export default Product
