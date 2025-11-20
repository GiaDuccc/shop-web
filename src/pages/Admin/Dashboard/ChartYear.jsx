import { Box } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS, defaults } from 'chart.js/auto'
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'
import { getCustomerChartByYear } from '~/apis/customerApi'
import { getOrderChartByYear } from '~/apis/orderApi'

defaults.maintainAspectRatio = false
defaults.responsive = true

defaults.plugins.title.display = true
defaults.plugins.title.align = 'start'
defaults.plugins.title.font.size = 20
defaults.plugins.title.color = 'black'

const allMonth = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

function ChartYear() {
  const [customerData, setCustomerData] = useState([])
  const [orderData, setOrderData] = useState([])
  const [productData, setProdutData] = useState([])

  const fetchData = async () => {
    await getOrderChartByYear().then(data => {
      setOrderData(data.fullDataOrder)
      setProdutData(data.fullDataProductQuantity)
      // console.log(data)
    })
    await getCustomerChartByYear().then(data => setCustomerData(data))
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box className='chart' sx={{ width: '100%', display: 'flex', alignItems: 'center', height: '100%', pb: '8px' }}>
      {/* <Bar
        data={{
          labels: allMonth.map(data => data),
          datasets: [
            {
              label: 'Customer',
              data: customerData.map(data => data.totalCustomers)
            },
            {
              label: 'Order',
              data: orderData.map(data => data.totalOrders)
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: { size: 16 }
              }
            }
          }
        }}
      /> */}
      <Line
        data={{
          labels: allMonth.map(data => data),
          datasets: [
            {
              label: 'Customers joined',
              data: customerData.map(data => data.totalCustomers),
              borderColor: '#000',
              backgroundColor: '#000'
            },
            {
              label: 'Orders completed',
              data: orderData.map(data => data.totalOrders),
              borderColor: '#aaa',
              backgroundColor: '#aaa'
            },
            {
              label: 'Products Sold',
              data: productData.map(data => data.totalQuantity),
              borderColor: '#c0392b',
              backgroundColor: '#c0392b'
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: { size: 16 },
                padding:  20
              }
            }
          },
          elements: {
            line: {
              tension: 0.4
            },
            point: { radius: 0 }
          },
          scales: {
            x: {
              grid: {
                display: false // Ẩn lưới trục X
              }
            },
            y: {
              grid: {
                display: false // Ẩn lưới trục Y
              }
            }
          }
        }}
      />
    </Box >
  )
}

export default ChartYear
