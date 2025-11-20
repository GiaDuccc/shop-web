import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import crownIcon from '~/assets/crown.png'
import { useEffect, useState } from 'react'
import { getAllCustomerQuantityAPI, getAllProductQuantityAPI, getQuantityAndProfitAPI, getTopBestSeller } from '~/apis'
import ChartYear from './ChartYear'
import { useSearchParams } from 'react-router-dom'
import '~/App.scss'

const time = ['day', 'month', 'year']
const fontSizeTitle = '24px'
const fontSizeStat = '48px'
const fontSizeSub = '16px'

function Dashboard() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [timeFilter, setTimeFilter] = useState(searchParams.get('time') || 'year')

  const [allProduct, setAllProduct] = useState(null)
  const [allCustomer, setAllCustomer] = useState(null)
  const [orderQuantity, setOrderQuantity] = useState(null)
  const [profit, setProfit] = useState(null)
  const [topSeller, setTopSeller] = useState([])

  const [isLoadingPage, setIsLoadingPage] = useState(false)

  const fetchData = async () => {
    try {
      const [products, customers, stats, topSeller] = await Promise.all([
        getAllProductQuantityAPI(),
        getAllCustomerQuantityAPI(),
        getQuantityAndProfitAPI(),
        getTopBestSeller()
      ])

      setAllProduct(products)
      setAllCustomer(customers)
      setOrderQuantity(stats.quantity)
      setProfit(stats.profit)
      setTopSeller(topSeller)

      if (products || customers || stats || topSeller) {
        setTimeout(() => {
          setIsLoadingPage(false)
        }, 500)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Lỗi khi fetch dữ liệu:', error);
    }
  }

  useEffect(() => {
    setIsLoadingPage(true)
    fetchData()
  }, [])

  // useEffect(() => {
  //   console.log(allProduct, allCustomer, orderQuantity, profit)
  // }, [allProduct, allCustomer, orderQuantity, profit])
  if (isLoadingPage) return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '40vh' }}>
    <Box className='spinner-large'></Box>
  </Box>)
  else
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%', width: '100%',
          gap: 1,
          p: '32px'
        }}
      >
        {/* Content */}
        <Box sx={{
          // flex: 11,
          display: 'flex',
          gap: 3,
          height: '100%', width: '100%'
        }}>
          {/* Chart and all (product, customer, order) */}
          <Box sx={{ flex: 7.5, display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <Box sx={{
              flex: 1.5,
              height: 'fit-content', width: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                bgcolor: '#f6f6f6',
                width: 'fit-content',
                borderRadius: '16px'
              }}>

                {time.map((item, idx) => (
                  <Typography
                    onClick={() => {
                      searchParams.set('time', item.toLowerCase())
                      setSearchParams(searchParams)
                      setTimeFilter(item)
                    }}
                    key={idx}
                    sx={{
                      fontSize: '16px',
                      fontWeight: '600',
                      p: '12px 24px',
                      transition: 'all 0.25s cubic-bezier(0.42, 0, 0.58, 1)',
                      bgcolor: timeFilter === item.toLowerCase() && '#000000c4',
                      color: timeFilter === item.toLowerCase() && '#fff',
                      borderRadius:
                        idx === 0 ? '16px 0 0 16px' : idx === time.length - 1 ? '0 16px 16px 0' : 'none',
                      '&:hover': {
                        bgcolor: timeFilter === item.toLowerCase() ? 'none' : '#000000c4',
                        color: '#fff',
                        cursor: 'pointer'
                      }
                    }}
                  >{item.slice(0, 1).toUpperCase() + item.slice(1)}</Typography>
                ))}
              </Box>
            </Box>
            {/* Chart */}
            <Box sx={{ flex: 8, width: '100%' }}>
              {timeFilter === 'year' && (<ChartYear />)}
            </Box>
            {/* Stats */}
            <Box sx={{ flex: 2.5, display: 'flex', gap: 2 }}>
              {/* Products */}
              <Box sx={{
                flex: 1,
                p: '12px 24px',
                borderRadius: '20px',
                // boxShadow: '2px 2px 15px #ccc',
                bgcolor: '#f6f6f6'
              }}>
                <Box className='boom-small' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{
                    fontSize: fontSizeTitle,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Products</Typography>
                  <Typography sx={{
                    fontSize: fontSizeStat,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>{allProduct}</Typography>
                  <Typography sx={{
                    fontSize: fontSizeSub,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Are Selling</Typography>
                </Box>
              </Box>
              {/* Customer */}
              <Box sx={{
                flex: 1,
                p: '12px 24px',
                borderRadius: '20px',
                bgcolor: '#f6f6f6'
              }}>
                <Box className='boom-small' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{
                    fontSize: fontSizeTitle,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Customers</Typography>
                  <Typography sx={{
                    fontSize: fontSizeStat,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>{allCustomer}</Typography>
                  <Typography sx={{
                    fontSize: fontSizeSub,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Joined</Typography>
                </Box>
              </Box>
              {/* Order */}
              <Box className='boom-small' sx={{
                flex: 1,
                p: '12px 24px',
                borderRadius: '20px',
                bgcolor: '#f6f6f6'
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{
                    fontSize: fontSizeTitle,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Orders</Typography>
                  <Typography sx={{
                    fontSize: fontSizeStat,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>{orderQuantity}</Typography>
                  <Typography sx={{
                    fontSize: fontSizeSub,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Completed</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Best seller & profit */}
          <Box sx={{ flex: 4.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Best seller */}
            <Box sx={{ flex: 8.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Title */}
              <Typography className='fade-in-up' sx={{
                fontSize: '36px',
                fontWeight: '600',
                position: 'relative',
                width: 'fit-content'
              }}>
                Top Seller
                <img src={crownIcon} style={{
                  width: '40px', position: 'absolute', rotate: '45deg',
                  top: 0,
                  right: '-50px'
                }} />
              </Typography>
              {/* Content */}
              <Box sx={{
                display: 'flex', flexDirection: 'column', gap: 2, flex: 1
              }}>
                {topSeller.map((product, idx) => (
                  <Box
                    className='fade-in-up'
                    key={idx}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      height: 'fit-content',
                      gap: 1.5,
                      bgcolor: '#f6f6f6',
                      background:
                        idx === 0 ? 'linear-gradient(40deg,rgb(255, 226, 131) , rgb(255, 238, 0), #ffba00)' :
                          idx === 1 ? 'linear-gradient(40deg,#ecf0f1 ,rgb(193, 203, 204) ,rgb(252, 252, 252))' :
                            'linear-gradient(40deg, rgb(255, 248, 229),rgb(194, 177, 151) ,rgb(201, 181, 160))',
                      p: '12px 20px',
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
                        maxWidth: 'fit-content',
                        justifyContent: 'center'
                      }}
                    >
                      <img
                        src={product.colors[0].imageDetail[0]}
                        style={{ width: '115px', height: '115px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </Box>
                    {/* Name */}
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>{product.name}</Typography>
                      </Box>
                      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end', alignItems: 'end', gap: 1.5 }}>
                        <Typography sx={{
                          fontSize: '32px',
                          fontWeight: '600',
                          fontStyle: 'italic',
                          lineHeight: '32px'
                        }}>{product.quantitySold}</Typography>
                        <span style={{ color: ' #5a5a5a' }}>{product.quantitySold > 1 ? 'Products sold' : 'Product sold'}</span>
                      </Box>
                    </Box>
                    {/* rank */}

                  </Box>
                ))}
              </Box>
            </Box>
            {/* Profit */}
            <Box className='boom-small' sx={{ flex: 2.5 }}>
              <Box sx={{
                p: '12px 24px',
                borderRadius: '20px',
                bgcolor: '#f6f6f6',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{
                    fontSize: fontSizeTitle,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>Profit</Typography>
                  <Typography sx={{
                    fontSize: '36px',
                    fontWeight: '600',
                    textAlign: 'center',
                    lineHeight: '72px'
                  }}>{Number(profit).toLocaleString('vi-VN')}</Typography>
                  <Typography sx={{
                    fontSize: fontSizeSub,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>VNĐ</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box >
      </Box >
    )
}

export default Dashboard
