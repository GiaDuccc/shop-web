import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import logo from '~/assets/logo-big.png'
import logoutIcon from '~/assets/logout.png'
import Product from './Product/Product'
import { useState, useEffect } from 'react'
import Dashboard from './Dashboard/Dashboard'
import Customer from './Customer/Customer'
import Order from './Order/Order'
import { useNavigate, useSearchParams } from 'react-router-dom'
import four from '~/assets/four.png'
import zero from '~/assets/zero.png'
import three from '~/assets/three.png'
import { fetchLogoutAPI } from '~/apis/authApi'
import { jwtDecode } from 'jwt-decode'

function Admin() {

  const accessToken = localStorage.getItem('accessToken')
  const token = accessToken ? jwtDecode(accessToken) : null

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(true)
  const [isLoadingPage, setIsLoadingPage] = useState(false)

  const openPage = searchParams.get('section') || 'dashboard' // Lấy giá trị của param 'page'

  // const [openPage, setOpenPage] = useState('dashboard')
  const handlePage = (section) => {
    // const currentParams = Object.fromEntries(searchParams.entries())
    setSearchParams({ section: section }, { replace: true })
  }

  const handleLogout = async () => {
    try {
      // Gọi API logout để invalidate token ở server
      await fetchLogoutAPI()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Xóa tất cả user data và token
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      navigate('/sign-in')
    }
  }

  useEffect(() => {
    setIsLoadingPage(true)
    setTimeout(() => {
      setIsLoadingPage(false)
    }, 400)
  }, [])

  useEffect(() => {
    if (!token) navigate('/sign-in')
    else if (token.role !== 'admin' && token.role !== 'manager') setIsAdmin(false)
  }, [token, navigate])

  if (!isAdmin) return (
    <Box
      className='fade-in'
      sx={{
        height: '98vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      {
        isLoadingPage ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <Box className='spinner-large'></Box>
          </Box >
        ) : (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src={four} style={{ width: '200px' }} />
              <img src={zero} style={{ width: '200px' }} />
              <img src={three} style={{ width: '200px' }} />
            </Box>
            <Typography sx={{
              fontSize: '44px',
              fontWeight: '700',
              width: '750px',
              textAlign: 'center',
              my: '40px',
              color: '#c90000'
            }}>
              Only administrators have permission to access this page.
            </Typography>
            <Box
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#c90000',
                p: '12px 32px',
                border: '4px solid #c90000',
                borderRadius: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
                '& p': {
                  color: 'white',
                  fontSize: '20px'
                },
                '&:hover': {
                  bgcolor: 'white'
                },
                '&:hover p': {
                  color: '#c90000'
                }
              }}
            >
              <Typography>{'Go to home >'}</Typography>
            </Box>
          </Box>
        )}

    </Box >
  )

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        bgcolor: 'white',
        width: '100%',
        height: '100vh'
        // height: '1000px'
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }} >
        {/* Option */}
        <Box sx={{
          bgcolor: '#f6f6f6',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'fixed',
          p: '16px',
          '& .option': {
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          },
          '& .option div': {
            p: '16px 20px',
            transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
            borderRadius: '16px'
          },
          '& .option div:hover': {
            cursor: 'pointer',
            bgcolor: '#fff',
            transform: 'scale(1.02)'
          },
          '& .option div p': {
            fontSize: '18px',
            fontWeight: '600'
          }
        }}>
          {/* Logo */}
          <Box sx={{
            height: '30%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pb: '16px'
          }}>
            <Box
              component='img'
              src={logo}
              sx={{
                width: '130px',
                height: '130px',
                bgcolor: '#fff',
                p: '20px',
                borderRadius: '150px'
              }}
            />
          </Box>
          <Box className='option' sx={{ flex: 1 }}>
            {/* Home */}
            <Box onClick={() => navigate('/')}>
              <Typography>Home</Typography>
            </Box>
            {/* Dashboard */}
            <Box sx={{ bgcolor: openPage === 'dashboard' && '#fff' }} onClick={() => handlePage('dashboard')}>
              <Typography>Dashboard</Typography>
            </Box>
            {/* Product */}
            <Box sx={{ bgcolor: openPage === 'product' && '#fff' }} onClick={() => handlePage('product')}>
              <Typography>Product</Typography>
            </Box>
            {/* Customer */}
            <Box sx={{ bgcolor: openPage === 'customer' && '#fff' }} onClick={() => handlePage('customer')} >
              <Typography>Customer</Typography>
            </Box>
            {/* Order */}
            <Box sx={{ bgcolor: openPage === 'order' && '#fff' }} onClick={() => handlePage('order')}>
              <Typography>Order</Typography>
            </Box>
          </Box>
          <Box
            onClick={() => handleLogout()}
            sx={{
              p: '16px 20px',
              transition: 'all 0.2s cubic-bezier(0.42, 0, 0.58, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              '&:hover': {
                cursor: 'pointer',
                bgcolor: '#fff',
                borderRadius: '16px'
              },
              '& p': {
                fontSize: '18px',
                fontWeight: '600'
              }
            }}>
            <Typography>Logout</Typography>
            <Box
              component='img'
              src={logoutIcon}
              sx={{
                width: '18px',
                height: '18px'
              }}
            />
          </Box>
        </Box>
        <Box sx={{ width: '300px' }}></Box>
        {/* Content */}
        <Box sx={{
          flex: 9
        }}>
          {openPage === 'dashboard' && (<Dashboard />)}
          {openPage === 'product' && (<Product userId={token.userId} userRole={token.role} />)}
          {openPage === 'customer' && (<Customer userId={token.userId} userRole={token.role} />)}
          {openPage === 'order' && (<Order userId={token.userId} userRole={token.role} />)}
        </Box>
      </Box>
    </Container>
  )
}

export default Admin

// thống kê
// số giày bán được trong 1 tháng, năm
// số người tham gia 1 tháng
// số đơn bán được


// Giày (CRUD)
// Customer (CROD)
// Order (CRUD)

