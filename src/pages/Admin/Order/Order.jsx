/* eslint-disable react-hooks/exhaustive-deps */
import { deleteOrderAPI, fetchGetAllOrderPageAPI, updatedOrderStatusAPI } from '~/apis/orderApi'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
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
import OrderDetail from '~/components/OrderDetail/OrderDetail'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import '~/App.scss'

function Order({ userId, userRole }) {

  const [searchParams, setSearchParams] = useSearchParams()
  const [orderList, setOrderList] = useState([])

  const [totalPages, setTotalPages] = useState(0)
  const currentPage = parseInt(searchParams.get('page')) || 1

  const [searchValue, setSearchValue] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [orderDetail, setOrderDetail] = useState(false)

  const filters = ['newest', 'oldest', 'high-low', 'low-high']
  const [filterSelected, setFilterSelected] = useState(-1)

  // Handle loading
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  const statusColors = {
    pending: '#ffa706',
    delivering: '#0066ff',
    completed: '#4cd137',
    canceled: '#ff4f4f'
  }
  // const [statusBeforeEdit, setStatusBeforeEdit] = useState(null)
  const status = ['pending', 'delivering', 'completed', 'canceled']
  const [statusSelected, setStatusSelected] = useState(null)

  const handleChangeStatus = (oldStatus, idx) => {
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
  const handleUpdateStatus = async (orderId) => {
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
    await fetchGetAllOrderPageAPI(currentPage, 12, filters).then(data => {
      setOrderList(data.products)
      setTotalPages(data.total / 12)
      setIsLoadingOrders(false)
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

  const handleSearch = (data) => {
    const currentParams = Object.fromEntries(searchParams.entries())
    if (currentParams.search === data.trim()) return
    if (data.trim() === '') delete currentParams.search
    else currentParams.search = data
    setSearchParams(currentParams, { replace: false })
  }

  const handleDelete = async () => {
    await deleteOrderAPI(orderToDelete)
    fetchOrder()
  }

  useEffect(() => {
    setIsLoadingOrders(true)
    fetchOrder()
  }, [searchParams])

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', p: '32px'
    }}>
      {/* Header */}
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
        {/* Filter */}
        <Button onClick={() => handleFilter()} className='boom-small' flex={2} height='100%' bgcolor='#ccc' content={
          searchParams.get('sort') ? searchParams.get('sort').slice(0, 1).toUpperCase() + searchParams.get('sort').slice(1) : 'Filter'
        } fontSize='18px' borderRadius='12px' color='#000' />
      </Box>
      {/* Content */}
      <Box>
        {isLoadingOrders ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '40vh' }}>
            <Box className='spinner-large'></Box>
          </Box>
        ) : (
          <Box sx={{ mt: '24px' }}>
            {orderList.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {orderList?.map((order, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      className='fade-in-up'
                      sx={{
                        display: 'flex',
                        height: 'fit-content',
                        gap: 2,
                        bgcolor: '#f6f6f6',
                        p: '20px',
                        borderRadius: '16px',
                        flex: 1
                      }}
                    >
                      {/* Img and quatity */}
                      <Box
                        sx={{
                          // flex: 2,
                          display: 'flex',
                          gap: 1,
                          width: '120px',
                          height: '120px',
                          flexWrap: 'wrap'
                        }}
                      >
                        {order.items.length <= 4 && order.items.slice(0, 4).map((product, idx) => (
                          <img
                            key={idx}
                            src={product.image}
                            style={{
                              width: order.items.length === 1 ? '100%' : '55px',
                              height: order.items.length === 1 ? '100%' : '55px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        ))}
                        {order.items.length > 4 && order.items.slice(0, 4).map((product, idx) => (
                          idx == 3 ? (
                            <Box
                              key={idx}
                              sx={{
                                width: '55px',
                                height: '55px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px'
                              }}
                            >
                              <img src={dotIcon} style={{ width: '20px' }} />
                            </Box>
                          ) : (
                            <img
                              key={idx}
                              src={product.image}
                              style={{
                                width: order.items.length === 1 ? '100%' : '55px',
                                height: order.items.length === 1 ? '100%' : '55px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          )
                        ))}
                      </Box>
                      {/* Information */}
                      <Box
                        sx={{
                          flex: 5,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5
                        }}
                      >
                        {/* Order */}
                        <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>
                          Order #{order._id.slice(0, order._id.length / 2)}
                        </Typography>
                        {/* Info */}
                        <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                          {'Info: '}
                          <span style={{ paddingBottom: '0.5px', color: '#000' }} >
                            {order.name + ' - ' + order.phone}
                          </span>
                        </Typography>
                        {/* Status */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                              {'Status: '}
                            </Typography>
                            <Box
                              onClick={() => setTimeout(() => {
                                handleChangeStatus(order.status, idx)
                              }, 100)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: '8px',
                                borderRadius: '8px',
                                transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                                '&:hover': {
                                  bgcolor: '#fff',
                                  cursor: 'pointer'
                                },
                                '&:hover p': {
                                  borderBottom: '1px solid rgba(0,0,0,0)'
                                }
                              }}>
                              <Typography
                                sx={{
                                  fontSize: '16px',
                                  userSelect: 'none',
                                  borderBottom: '1px solid black',
                                  color: (statusSelected && idx === statusSelected.idx) ? statusColors[statusSelected.status] : statusColors[order.status]
                                }} >
                                {(statusSelected && idx === statusSelected.idx) ? statusSelected.status : order.status}
                              </Typography>
                              <img src={updateIcon} style={{ width: '12px', display: (statusSelected && idx === statusSelected.idx) ? 'none' : 'block' }} />
                            </Box>
                          </Box>
                          <Box sx={{
                            display: (statusSelected && idx === statusSelected.idx) ? 'flex' : 'none',
                            gap: 1,
                            '& div': {
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)'
                            },
                            '& div:hover': {
                              opacity: .5
                            }
                          }}>
                            {/* Cancel */}
                            <Box
                              onClick={() => {
                                setStatusSelected(null)
                              }}
                              className='boom-small' sx={{ bgcolor: '#ccc' }}>
                              <img src={xIcon} style={{ width: '13px' }} />
                            </Box>
                            {/* OK */}
                            <Box onClick={() => handleUpdateStatus(order._id)} className='boom-small' sx={{ bgcolor: '#000' }}>
                              <img src={vIcon} style={{ width: '13px' }} />
                            </Box>
                          </Box>
                        </Box>
                        {/* Address */}
                        <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                          {'Address: '}
                          <span style={{ borderBottom: '1px solid black', paddingBottom: '0.5px', color: 'black' }}>
                            {order.address}
                          </span>
                        </Typography>

                      </Box>
                      {/* Total and Time*/}
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
                          {(Number(order.totalPrice)).toLocaleString('vi-VN')}đ
                        </Typography>
                        <Typography sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          fontStyle: 'italic',
                          color: 'rgba(0,0,0,.45)'
                        }}>
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
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
                        onClick={() => setOrderDetail(order._id)}
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
                          setOrderToDelete(order._id)
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
              </Box>
            )}
            {/* Button next and prev page */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', mt: '16px' }}>
              {currentPage === 1 || totalPages < 1 ?
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
              {currentPage === totalPages || totalPages < 1 ?
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
      </Box>
      {showWarning && userRole === 'manager' && (
        <ModalWarning open={showWarning} onClose={() => setShowWarning(false)} cancel={() => setShowWarning(false)} handleDelete={() => {
          handleDelete()
          setShowWarning(false)
        }} />
      )}
      {orderDetail && (
        <OrderDetail open={Boolean(orderDetail)} onClose={() => setOrderDetail(null)} orderId={orderDetail} />
      )}
    </Box>
  )
}

export default Order
