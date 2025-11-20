/* eslint-disable react-hooks/exhaustive-deps */
import { changeRoleCustomerAPI, deleteCustomerAPI, fetchGetAllCustomerPageAPI } from '~/apis/customerApi'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '~/components/Button/Button'
import searchIcon from '~/assets/search.png'
import avatarClient from '~/assets/avatar-client.png'
import avatarManager from '~/assets/avatar-manager.png'
import editIcon from '~/assets/info.png'
import vIcon from '~/assets/v-white.png'
import xIcon from '~/assets/x.png'
import ModalWarning from '~/components/ModalWarning/ModalWarning'
import trashIcon from '~/assets/trash.png'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import CustomerDetail from './CustomerDetail/CustomerDetail'
import '~/App.scss'

function Customer({ userId, userRole }) {

  const [searchParams, setSearchParams] = useSearchParams()
  const [customerList, setCustomerList] = useState([])

  const [totalPages, setTotalPages] = useState(0)
  const currentPage = parseInt(searchParams.get('page')) || 1

  // Handle loading
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  // const [showWarning, setShowWarning] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [customerDetail, setCustomerDetail] = useState(null)

  const filters = ['newest', 'oldest', 'A-Z', 'Z-A']
  const [filterSelected, setFilterSelected] = useState(-1)

  const role = ['client', 'admin']
  const [roleSelected, setRoleSelected] = useState(null)

  const handleChangeRole = (oldRole, idx) => {
    if (oldRole === 'manager' || userRole === 'admin') return
    if (roleSelected) {
      if (idx !== roleSelected.idx) {
        if (role.indexOf(oldRole) + 1 >= role.length) {
          setRoleSelected({ role: role[0], idx: idx })
        } else setRoleSelected({ role: role[role.indexOf(oldRole) + 1], idx: idx })
      }
      else {
        // eslint-disable-next-line no-lonely-if
        if (role.indexOf(roleSelected.role) + 1 >= role.length) {
          setRoleSelected({ role: role[0], idx: idx })
        } else setRoleSelected({ role: role[role.indexOf(roleSelected.role) + 1], idx: idx })
      }
      return
    }
    if (role.indexOf(oldRole) + 1 >= role.length) {
      setRoleSelected({ role: role[0], idx: idx })
    } else {
      setRoleSelected({ role: role[role.indexOf(oldRole) + 1], idx: idx })
    }
  }

  const handleUpdateRole = async (customerId, role) => {
    setCustomerList(prev =>
      prev.map((customer, idx) =>
        idx === roleSelected.idx
          ? { ...customer, role: roleSelected.role }
          : customer
      )
    )
    setRoleSelected(null)
    // eslint-disable-next-line no-console
    await changeRoleCustomerAPI(customerId, role).then(() => console.log('Change role success'))
  }

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
    await deleteCustomerAPI(customerToDelete)
  }

  useEffect(() => {
    if (!customerToDelete) {
      setIsLoadingOrders(true)
      fetchCustomer()
    }
    fetchCustomer()
  }, [searchParams, customerToDelete])

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
            {customerList.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {customerList?.map((customer, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      className='fade-in-up'
                      sx={{
                        display: 'flex',
                        height: 'fit-content',
                        gap: 4,
                        background:
                          customer.role === 'manager' ? 'linear-gradient(40deg,rgb(243, 142, 47), rgb(255, 238, 0))' : '#f6f6f6',
                        p: '16px 28px',
                        borderRadius: '16px',
                        flex: 1
                      }}
                    >
                      {/* Avatar and quatity */}
                      <Box
                        sx={{
                          // flex: 2,
                          display: 'flex',
                          width: '120px',
                          height: '120px',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {/* Avatar */}
                        <img src={customer.role === 'manager' ? avatarManager : avatarClient} style={{ width: '90%', height: '90%' }} />
                      </Box>
                      {/* Information */}
                      <Box
                        sx={{
                          flex: 5,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          pt: '4px',
                          '& p': {
                            color: customer.role === 'manager' && '#fff'
                          },
                          '& span': {
                            color: customer.role === 'manager' ? '#474787' : '#000'
                          }
                        }}
                      >
                        {/* Customer */}
                        <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>
                          Customer #{customer.phone}
                        </Typography>
                        {/* Name */}
                        <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                          {'Name: '}
                          <span style={{ paddingBottom: '0.5px' }} >
                            {`${customer.lastName} ${customer.firstName}`}
                          </span>
                        </Typography>
                        {/* Phone */}
                        <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                          {'Email: '}
                          <span style={{ borderBottom: customer.role === 'manager' ? '#474787' : '1px solid black', paddingBottom: '0.5px' }} >
                            {customer.email}
                          </span>
                        </Typography>
                        {/* Address */}
                        <Typography sx={{ fontSize: '16px', color: '#696969' }}>
                          {'Address: '}
                          <span style={{ paddingBottom: '0.5px' }}>
                            {customer.address}
                          </span>
                        </Typography>

                      </Box>
                      {/* Active and Time */}
                      <Box
                        sx={{
                          flex: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'end'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            // onMouseLeave={() => setRoleSelected(null)}
                            sx={{
                              p: '2px 16px',
                              borderRadius: '16px',
                              transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              '&:hover': {
                                bgcolor: '#fff'
                              },
                              '&:hover p': {
                                color: customer.role === 'manager' && '#ffba00'
                              }
                            }}
                          >
                            {(roleSelected && idx === roleSelected.idx) && (
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75
                              }}>
                                {/* Ok */}
                                <Box className='boom-small'
                                  onClick={() => handleUpdateRole(customer._id, roleSelected.role)}
                                  sx={{
                                    bgcolor: '#000',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                                    '&:hover': {
                                      opacity: .5
                                    }
                                  }}
                                >
                                  <img src={vIcon} style={{ width: '15px', height: '15px' }} />
                                </Box>
                                {/* Cancel */}
                                <Box className='boom-small'
                                  onClick={() => setRoleSelected(null)}
                                  sx={{
                                    bgcolor: '#ccc',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                                    '&:hover': {
                                      opacity: .5
                                    }
                                  }}
                                >
                                  <img src={xIcon} style={{ width: '15px', height: '15px' }} />
                                </Box>
                              </Box>
                            )}
                            <Typography
                              onClick={() => handleChangeRole(customer.role, idx)}
                              sx={{ fontSize: '20px', fontWeight: '600', color: customer.role === 'manager' && '#fff', userSelect: 'none' }}>
                              {(roleSelected && idx === roleSelected.idx)
                                ?
                                roleSelected.role.slice(0, 1).toUpperCase() + roleSelected.role.slice(1)
                                :
                                `${customer.role.slice(0, 1).toUpperCase()}${customer.role.slice(1)}`
                              }
                            </Typography>
                          </Box>
                          {/* Active */}
                          <Box sx={{
                            width: '20px',
                            height: '20px',
                            bgcolor: customer.isActive ? '#57cf57' : '#ff2929',
                            borderRadius: '20px',
                            border: '1px solid #aaa'
                          }} />
                        </Box>
                        {/* Time */}
                        <Typography sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          fontStyle: 'italic',
                          color: customer.role === 'manager' ? '#474787' : 'rgba(0,0,0,.45)'
                        }}>
                          {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Info and delete */}
                    < Box
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
                        onClick={() => setCustomerDetail(customer._id)}
                        component='img'
                        src={editIcon}
                        sx={{
                          width: '24px',
                          height: '24px'
                        }}
                      />
                      <Box
                        onClick={(e) => {
                          if (userRole !== 'manager' || userRole === customer.role) e.preventDefault()
                          else setCustomerToDelete(customer._id)
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
        )
        }
      </Box >
      <ModalWarning open={Boolean(customerToDelete)} onClose={() => setCustomerToDelete(null)} cancel={() => setCustomerToDelete(null)} handleDelete={() => {
        handleDelete()
        // setShowWarning(false)
        setCustomerToDelete(null)
      }} />
      {
        Boolean(customerDetail) && (
          <CustomerDetail open={Boolean(customerDetail)} onClose={() => setCustomerDetail(null)} customerId={customerDetail} />
        )
      }
    </Box >
  )
}

export default Customer
