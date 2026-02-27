/* eslint-disable react-hooks/exhaustive-deps */
import { deleteOrderAPI, fetchGetAllOrderPageAPI, updatedOrderStatusAPI } from '~/apis/adminAPI/orderAPI'
import { fetchProductDetailsAPI } from '~/apis/adminAPI/productAPI'
import { useEffect, useState } from 'react'
import Button from '~/components/Button/Button'
import searchIcon from '~/assets/search.png'
import dotIcon from '~/assets/3dot.png'
import xIcon from '~/assets/x.png'
import vIcon from '~/assets/v-white.png'
import { useSearchParams } from 'react-router-dom'
import editIcon from '~/assets/info.png'
import updateIcon from '~/assets/update.png'
import ModalWarning from '~/components/ModalWarning/ModalWarning'
import trashIcon from '~/assets/trash.png'
import OrderDetail from '~/components/OrderDetail/OrderDetailAdmin'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import { jwtDecode } from 'jwt-decode'
import styles from './Order.module.scss'
import '~/App.scss'
import { Order as OrderType, OrderItems } from '~/interface/order.interface'

type OrderStatus = 'pending' | 'delivering' | 'completed' | 'canceled'

type OrderListResponse = {
  products: OrderType[]
  total: number
}

function Order() {

  const token = localStorage.getItem('accessTokenAdmin')
  const employee = token ? jwtDecode(token) as ({ role: string }) : null

  const [searchParams, setSearchParams] = useSearchParams()
  const [orderList, setOrderList] = useState<OrderType[]>([])

  const [totalPages, setTotalPages] = useState<number>(0)
  const pageParam = searchParams.get('page')
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1

  const [searchValue, setSearchValue] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [orderDetail, setOrderDetail] = useState<string | null>(null)

  const filters = ['newest', 'oldest', 'high-low', 'low-high']
  const [filterSelected, setFilterSelected] = useState(-1)

  // Handle loading
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  const statusColors: Record<OrderStatus, string> = {
    pending: '#ffa706',
    delivering: '#0066ff',
    completed: '#4cd137',
    canceled: '#ff4f4f'
  }
  // const [statusBeforeEdit, setStatusBeforeEdit] = useState(null)
  const status: OrderStatus[] = ['pending', 'delivering', 'completed', 'canceled']
  const [statusSelected, setStatusSelected] = useState<{ status: OrderStatus, idx: number } | null>(null)

  const handleChangeStatus = (oldStatus: OrderStatus, idx: number) => {
    // setStatusBeforeEdit(oldStatus)
    if (statusSelected) {
      if (idx !== statusSelected.idx) {
        if (status.indexOf(oldStatus) + 1 >= status.length - 1) {
          setStatusSelected({ status: status[0], idx: idx })
        } else setStatusSelected({ status: status[status.indexOf(oldStatus) + 1], idx: idx })
      }
      else {
        // eslint-disable-next-line no-lonely-if
        if (status.indexOf(statusSelected.status) >= status.length - 1) {
          setStatusSelected({ status: status[0], idx: idx })
        } else setStatusSelected({ status: status[status.indexOf(statusSelected.status) + 1], idx: idx })
      }
      return
    }
    if (status.indexOf(oldStatus) + 1 >= status.length - 1) {
      setStatusSelected({ status: status[0], idx: idx })
    } else setStatusSelected({ status: status[status.indexOf(oldStatus) + 1], idx: idx })

  }
  const handleUpdateStatus = async (orderId: string) => {
    if (!statusSelected) return
    setOrderList(prev =>
      prev.map((item, idx) =>
        idx === statusSelected.idx
          ? { ...item, status: statusSelected.status }
          : item
      )
    )
    setStatusSelected(null)
    await updatedOrderStatusAPI(orderId, statusSelected.status).then(data => {
      // eslint-disable-next-line no-console
      console.log(data)
    })
  }

  const fetchOrder = async () => {
    const allParams = Object.fromEntries(searchParams.entries())
    // eslint-disable-next-line no-unused-vars
    const { page, section, ...filters } = allParams
    const orders = await fetchGetAllOrderPageAPI(currentPage, 12, filters) as OrderListResponse
    setOrderList(orders.products)
    setTotalPages(orders.total / 12)
    const allOrderItems = await Promise.all(
      orders.products.map(async (order) => {
        const orderItems = await Promise.all(
          order.items.map(async (item): Promise<OrderItems> => {
            const productData = await fetchProductDetailsAPI(item.productId)
            return { productId: item.productId, ...productData }
          })
        )
        return {
          ...order,
          items: orderItems
        }
      })
    )
    setOrderList(allOrderItems)
    console.log(allOrderItems)
    setIsLoadingOrders(false)
  }

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
    if (!orderToDelete) return
    await deleteOrderAPI(orderToDelete)
    fetchOrder()
  }

  useEffect(() => {
    setIsLoadingOrders(true)
    fetchOrder()
  }, [searchParams])

  const sortParam = searchParams.get('sort')

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
          sortParam ? sortParam.slice(0, 1).toUpperCase() + sortParam.slice(1) : 'Filter'
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
            {orderList.length > 0 && (
              <div className={styles.orderList}>
                {orderList?.map((order, idx) => (
                  <div key={idx} className={styles.orderRow}>
                    <div className={`${styles.orderCard} fade-in-up`}>
                      {/* Img and quatity */}
                      <div className={styles.orderImages}>
                        {order.items.length <= 4 && order.items.slice(0, 4).map((product, idx) => (
                          <img
                            key={idx}
                            src={product.adImage}
                            alt="Product"
                            className={`${styles.productImage} ${order.items.length === 1 ? styles.productImageSingle : styles.productImageMultiple}`}
                          />
                        ))}
                        {order.items.length > 4 && order.items.slice(0, 4).map((product, idx) => (
                          idx == 3 ? (
                            <div key={idx} className={styles.dotIconWrapper}>
                              <img src={dotIcon} alt="More" />
                            </div>
                          ) : (
                            <img
                              key={idx}
                              src={product.adImage}
                              alt="Product"
                              className={`${styles.productImage} ${order.items.length === 1 ? styles.productImageSingle : styles.productImageMultiple}`}
                            />
                          )
                        ))}
                      </div>
                      {/* Information */}
                      <div className={styles.orderInfo}>
                        {/* Order */}
                        <p className={styles.orderTitle}>
                          Order #{order._id.slice(0, order._id.length / 2)}
                        </p>
                        {/* Info */}
                        <p className={styles.orderText}>
                          {'Info: '}
                          <span className={styles.orderTextSpan}>
                            {order.name + ' - ' + order.phone}
                          </span>
                        </p>
                        {/* Status */}
                        <div className={styles.statusRow}>
                          <div className={styles.statusInner}>
                            <p className={styles.statusLabel}>
                              {'Status: '}
                            </p>
                            <div
                              onClick={() => setTimeout(() => {
                                handleChangeStatus(order.status, idx)
                              }, 100)}
                              className={styles.statusButton}
                            >
                              <p
                                className={styles.statusText}
                                style={{
                                  color: (statusSelected && idx === statusSelected.idx) ? statusColors[statusSelected.status] : statusColors[order.status]
                                }}
                              >
                                {(statusSelected && idx === statusSelected.idx) ? statusSelected.status : order.status}
                              </p>
                              <img
                                src={updateIcon}
                                className={styles.updateIcon}
                                style={{ display: (statusSelected && idx === statusSelected.idx) ? 'none' : 'block' }}
                                alt="Update"
                              />
                            </div>
                          </div>
                          <div className={`${styles.statusActions} ${(statusSelected && idx === statusSelected.idx) ? '' : styles.statusActionsHidden}`}>
                            {/* Cancel */}
                            <div
                              onClick={() => {
                                setStatusSelected(null)
                              }}
                              className={`${styles.cancelButton} boom-small`}
                            >
                              <img src={xIcon} alt="Cancel" />
                            </div>
                            {/* OK */}
                            <div onClick={() => handleUpdateStatus(order._id)} className={`${styles.confirmButton} boom-small`}>
                              <img src={vIcon} alt="Confirm" />
                            </div>
                          </div>
                        </div>
                        {/* Address */}
                        <p className={styles.orderText}>
                          {'Address: '}
                          <span className={styles.orderAddress}>
                            {order.address}
                          </span>
                        </p>
                      </div>
                      {/* Total and Time*/}
                      <div className={styles.orderPricing}>
                        <p className={styles.orderPrice}>
                          {(Number(order.totalPrice)).toLocaleString('vi-VN')}đ
                        </p>
                        <p className={styles.orderDate}>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <img
                        onClick={() => setOrderDetail(order._id)}
                        src={editIcon}
                        className={styles.actionIcon}
                        alt="Edit"
                      />
                      {employee?.role === 'manager' && (
                        <img
                          onClick={() => {
                            setShowWarning(true)
                            setOrderToDelete(order._id)
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
        )}
      </div>
      {showWarning && employee?.role === 'manager' && (
        <ModalWarning open={showWarning} onClose={() => setShowWarning(false)} cancel={() => setShowWarning(false)} handleDelete={() => {
          handleDelete()
          setShowWarning(false)
        }} />
      )}
      {orderDetail && (
        <OrderDetail open={Boolean(orderDetail)} onClose={() => setOrderDetail(null)} orderId={orderDetail} />
      )}
    </div>
  )
}

export default Order
