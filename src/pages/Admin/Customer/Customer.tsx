/* eslint-disable react-hooks/exhaustive-deps */
import { deleteCustomerAPI, fetchGetAllCustomerPageAPI } from '~/apis/adminAPI/customerAPI'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '~/components/Button/Button'
import searchIcon from '~/assets/search.png'
import avatarClient from '~/assets/avatar-manager.png'
import editIcon from '~/assets/info.png'
import ModalWarning from '~/components/ModalWarning/ModalWarning'
import trashIcon from '~/assets/trash.png'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import CustomerDetail from './CustomerDetail/CustomerDetail'
import { jwtDecode } from 'jwt-decode'
import styles from './Customer.module.scss'
import '~/App.scss'
import { Customer as CustomerInterface } from '~/interface/customer.interface'

function Customer() {

  const token = localStorage.getItem('accessTokenAdmin')
  const employee = token ? jwtDecode(token) as ({ role: string }) : null

  const [searchParams, setSearchParams] = useSearchParams()
  const [customerList, setCustomerList] = useState<CustomerInterface[]>([])

  const [totalPages, setTotalPages] = useState(0)
  const currentPage = parseInt(searchParams.get('page') || '1') || 1

  // Handle loading
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  // const [showWarning, setShowWarning] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)
  const [customerDetail, setCustomerDetail] = useState<string | null>(null)

  const filters = ['newest', 'oldest', 'A-Z', 'Z-A']
  const [filterSelected, setFilterSelected] = useState(-1)

  useEffect(() => {
  }, [customerList])

  const fetchCustomer = async () => {
    const allParams = Object.fromEntries(searchParams.entries())
    // eslint-disable-next-line no-unused-vars
    const { page, section, ...filters } = allParams
    await fetchGetAllCustomerPageAPI(currentPage, 12, filters).then(data => {
      setCustomerList(data.customers)
      setTotalPages(data.total / 12)
      setIsLoadingOrders(false)

    })
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

  const handleSearch = (data: string) => {
    const currentParams = Object.fromEntries(searchParams.entries())
    if (currentParams.search === data.trim()) return
    if (data.trim() === '') delete currentParams.search
    else currentParams.search = data
    setSearchParams(currentParams, { replace: false })
  }

  const handleDelete = async () => {
    if (customerToDelete) {
      await deleteCustomerAPI(customerToDelete)
    }
  }

  useEffect(() => {
    if (!customerToDelete) {
      setIsLoadingOrders(true)
      fetchCustomer()
    }
    fetchCustomer()
  }, [searchParams, customerToDelete])

  return (
    <div className={styles.container}>
      {/* Header */}
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
        {/* Filter */}
        <Button onClick={() => handleFilter()} className='boom-small' flex={2} height='100%' bgcolor='#ccc' content={
          searchParams.get('sort') ? (searchParams.get('sort')!.slice(0, 1).toUpperCase() + searchParams.get('sort')!.slice(1)) : 'Filter'
        } fontSize='18px' borderRadius='12px' color='#000' />
      </div>
      {/* Content */}
      <div>
        {isLoadingOrders ? (
          <div className={styles.spinnerContainer}>
            <div className='spinner-large'></div>
          </div>
        ) : (
          <div className={styles.content}>
            {customerList.length > 0 && (
              <div className={styles.customerList}>
                {customerList?.map((customer, idx) => (
                  <div key={idx} className={styles.customerRow}>
                    <div className={`${styles.customerCard} fade-in-up`}>
                      {/* Avatar and quatity */}
                      <div className={styles.avatar}>
                        <img src={avatarClient} alt="Avatar" />
                      </div>
                      {/* Information */}
                      <div className={styles.information}>
                        {/* Customer */}
                        <p className={styles.customerTitle}>
                          Customer #{customer.phone}
                        </p>
                        {/* Name */}
                        <p className={styles.infoText}>
                          {'Name: '}
                          <span className={styles.infoSpan}>
                            {`${customer.lastName} ${customer.firstName}`}
                          </span>
                        </p>
                        {/* Phone */}
                        <p className={styles.infoText}>
                          {'Email: '}
                          <span className={styles.infoEmail}>
                            {customer.email}
                          </span>
                        </p>
                        {/* Address */}
                        <p className={styles.infoText}>
                          {'Address: '}
                          <span className={styles.infoSpan}>
                            {customer.address}
                          </span>
                        </p>
                      </div>
                      {/* Active and Time */}
                      <div className={styles.statusSection}>
                        {/* Time */}
                        <p className={styles.timestamp}>
                          {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {/* Info and delete */}
                    <div className={styles.actions}>
                      <img
                        onClick={() => setCustomerDetail(customer._id)}
                        src={editIcon}
                        className={styles.actionIcon}
                        alt="Edit"
                      />
                      {employee?.role === 'manager' && (
                        <img
                        onClick={() => {
                          setCustomerToDelete(customer._id)
                        }}
                        src={trashIcon}
                          className={styles.actionIcon}
                          alt="Delete"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Button next and prev page */}
            <div className={styles.pagination}>
              {currentPage === 1 || totalPages < 1 ?
                (<div className={styles.paginationSpacer}></div>)
                :
                (<div className={styles.paginationButton} onClick={handlePrevPage}>
                  <img src={leftIcon} alt="Previous" />
                </div>)
              }

              <p className={styles.pageNumber}>{currentPage}</p>
              {currentPage === totalPages || totalPages < 1 ?
                (<div className={styles.paginationSpacer}></div>)
                :
                (<div className={styles.paginationButton} onClick={handleNextPage}>
                  <img src={rightIcon} alt="Next" />
                </div>)
              }
            </div>
          </div>
        )
        }
      </div>
      <ModalWarning open={Boolean(customerToDelete)} onClose={() => setCustomerToDelete(null)} cancel={() => setCustomerToDelete(null)} handleDelete={() => {
        handleDelete()
        // setShowWarning(false)
        setCustomerToDelete(null)
      }} />
      {
        Boolean(customerDetail) && (
          <CustomerDetail open={Boolean(customerDetail)} onClose={() => setCustomerDetail(null)} customerId={customerDetail || ''} />
        )
      }
    </div>
  )
}

export default Customer
