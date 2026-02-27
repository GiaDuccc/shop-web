/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { fetchAllProductPageAPI, deleteProductAPI } from '~/apis/adminAPI/productAPI'
import editIcon from '~/assets/edit.png'
import trashIcon from '~/assets/trash.png'
import searchIcon from '~/assets/search.png'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import { useSearchParams } from 'react-router-dom'
import styles from './Product.module.scss'
import '~/App.scss'
import Button from '~/components/Button/Button'
import ModalWarning from '~/components/ModalWarning/ModalWarning'
import EditProduct from './EditProduct/EditProduct'
import AddProduct from './AddProduct/AddProduct'
import { jwtDecode } from 'jwt-decode'
import { Employee } from '~/interface/employee.interface'
import { Product as ProductInterface } from '~/interface/product.interface'

function Product() {

  const accessToken = localStorage.getItem('accessTokenAdmin')
  const employee = accessToken ? jwtDecode<Employee>(accessToken) : null
  // set param trên URL
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1')

  const [products, setProducts] = useState<ProductInterface[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const filters = ['newest', 'oldest', 'high-low', 'low-high']
  const [filterSelected, setFilterSelected] = useState(-1)
  const [showWarning, setShowWarning] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [productToEdit, setProductToEdit] = useState<ProductInterface | null>(null)
  const [isAddProduct, setIsAddProduct] = useState(false)
  // handleLoading
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  const fetchProducts = async () => {
    const allParams = Object.fromEntries(searchParams.entries())
    const { page, section, ...filters } = allParams
    await fetchAllProductPageAPI(currentPage, 12, filters).then(data => {
      setProducts(data.products)
      setTotalPages(Math.floor(data.total / 12))
    })
    setIsLoadingProducts(false)
  }

  // Hàm handle khi next trang
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = (currentPage + 1).toString()
      setSearchParams(currentParams, { replace: false })
    }
  }

  // Hàm handle khi prev trang
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = (currentPage - 1).toString()
      setSearchParams(currentParams, { replace: false })
    }
  }

  const handleSearch = (data: string) => {
    const currentParams = Object.fromEntries(searchParams.entries())
    if (currentParams.search === data.trim()) return
    if (data.trim() === '') delete currentParams.search
    else currentParams.search = data.trim()
    setSearchParams(currentParams, { replace: false })
  }

  const handleDelete = async () => {
    if (!productToDelete) return
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
    <div className={styles.container}>
      {/* hearder */}
      <div className={styles.header}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <input
            className={`slide-from-right ${styles.searchInput}`}
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={e => {
              // handleSearch(e.target.value)
              setSearchValue(e.target.value)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch(searchValue)
              }
            }}
            autoFocus
          />
          <div
            className={styles.searchButton}
            onClick={() => handleSearch(searchValue)}
          >
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        {/* Add */}
        <Button onClick={() => setIsAddProduct(true)} className='boom-small' flex={2} height='100%' bgcolor='#000' content='Add' fontSize='18px' borderRadius='12px' color='#fff' />
        {/* Filter */}
        <Button onClick={() => handleFilter()} className='boom-small' flex={2} height='100%' bgcolor='#ccc' content={searchParams.get('sort') ? searchParams.get('sort')!.slice(0, 1).toUpperCase() + searchParams.get('sort')!.slice(1) : 'Filter'} fontSize='18px' borderRadius='12px' color='#000' />
      </div>
      {isLoadingProducts ? (
        <div className={styles.spinnerContainer}>
          <div className='spinner-large'></div>
        </div>
      ) : (
        <div className={styles.content}>
          {products?.map((product, idx) => (
            <div key={idx} className={styles.productRow}>
              <div className={`${styles.productCard} fade-in-up`}>
                {/* Img and quatity */}
                <div className={styles.productImageWrapper}>
                  <img
                    src={product.colors[0].imageDetail[0]}
                    className={styles.productImage}
                    alt={product.name}
                  />
                </div>
                {/* Name & color & size */}
                <div className={styles.productInfo}>
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productType}>{product.type.slice(0, 1).toUpperCase() + product.type.slice(1)}</p>
                  <p className={styles.productDetail}>
                    {'Color: '}
                    <span className={styles.productDetailValue}>
                      {product.colors.length}
                    </span>
                  </p>
                  <p className={styles.productDetail}>
                    {'Quantity: '}
                    <span className={styles.productDetailValue}>
                      {product.stock}
                    </span>
                  </p>
                </div>
                {/* Total and Quantity*/}
                <div className={styles.productPricing}>
                  <p className={styles.productPrice}>
                    {(Number(product.price)).toLocaleString('vi-VN')}đ
                  </p>
                  <p className={styles.productDate}>
                    {new Date(product.importAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <div className={styles.actions}>
                <img
                  onClick={() => {
                    setProductToEdit(product)
                  }}
                  src={editIcon}
                  className={styles.actionIcon}
                  alt="Edit"
                />
                {employee?.role === 'manager' && (
                <img
                  onClick={() => {
                    setShowWarning(true)
                    setProductToDelete(product._id)
                  }}
                  src={trashIcon}
                    className={styles.actionIcon}
                    alt="Delete"
                  />
                )}
              </div>
            </div>
          ))}
          {/* Button */}
          <div className={styles.pagination}>
            {/* Prev Button */}
            {currentPage === 1 ? (
              <div className={styles.paginationSpacer}></div>
            ) : (
              <div className={styles.paginationButton} onClick={handlePrevPage}>
                <img src={leftIcon} alt="Previous" />
              </div>
            )}

            <p className={styles.pageNumber}>{currentPage}</p>

            {/* Next Button */}
            {currentPage === totalPages || totalPages === 0 ? (
              <div className={styles.paginationSpacer}></div>
            ) : (
              <div className={styles.paginationButton} onClick={handleNextPage}>
                <img src={rightIcon} alt="Next" />
              </div>
            )}
          </div>

        </div>
      )}
      {showWarning && employee?.role === 'manager' && (
        <ModalWarning open={showWarning} onClose={() => setShowWarning(false)} cancel={() => setShowWarning(false)} handleDelete={() => {
          handleDelete()
          setShowWarning(false)
        }} />
      )}
      {productToEdit && employee?.role === 'manager' && (
        <EditProduct open={Boolean(productToEdit)} onClose={() => setProductToEdit(null)} product={productToEdit} refresh={() => {
          setIsLoadingProducts(true)
          fetchProducts()
        }} />
      )}
      {isAddProduct && employee?.role === 'manager' && (
        <AddProduct open={Boolean(isAddProduct)} onClose={() => setIsAddProduct(false)} refresh={() => {
          setIsLoadingProducts(true)
          fetchProducts()
        }} />
      )}
    </div>
  )
}

export default Product
