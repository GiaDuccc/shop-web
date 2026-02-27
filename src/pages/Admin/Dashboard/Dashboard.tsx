import { useEffect, useState } from 'react'
import { getAllCustomerQuantityAPI } from '~/apis/adminAPI/customerAPI'
import { getAllProductQuantityAPI } from '~/apis/adminAPI/productAPI'
import { getQuantityAndProfitAPI } from '~/apis/adminAPI/orderAPI'
import ChartYear from './ChartYear'
import { useSearchParams } from 'react-router-dom'
import '~/App.scss'
import styles from './Dashboard.module.scss'

const time = ['day', 'month', 'year']
function Dashboard() {

  const [searchParams, setSearchParams] = useSearchParams()
  const [timeFilter, setTimeFilter] = useState(searchParams.get('time') || 'year')

  const [allProduct, setAllProduct] = useState<number>(0)
  const [allCustomer, setAllCustomer] = useState<number>(0)
  const [orderQuantity, setOrderQuantity] = useState<number>(0)
  const [profit, setProfit] = useState<number>(0)

  const [isLoadingPage, setIsLoadingPage] = useState(false)

  const fetchData = async () => {
    try {
      const [products, customers, stats] = await Promise.all([
        getAllProductQuantityAPI(),
        getAllCustomerQuantityAPI(),
        getQuantityAndProfitAPI()
      ])

      setAllProduct(products)
      setAllCustomer(customers)
      setOrderQuantity(stats.quantity)
      setProfit(stats.profit)

      if (products || customers || stats) {
        setIsLoadingPage(false)
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

  if (isLoadingPage) {
    return (
      <div className={styles.spinnerContainer}>
        <div className='spinner-large'></div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Content */}
      <div className={styles.content}>
        {/* Chart and all (product, customer, order) */}
        <div className={styles.mainColumn}>
          {/* <div className={styles.filterWrapper}>
            <div className={styles.filterButtons}>
              {time.map((item, idx) => {
                const isActive = timeFilter === item.toLowerCase()
                return (
                  <button
                    type="button"
                    onClick={() => {
                      searchParams.set('time', item.toLowerCase())
                      setSearchParams(searchParams)
                      setTimeFilter(item)
                    }}
                    key={idx}
                    className={[
                      styles.filterButton,
                      idx === 0 ? styles.filterButtonFirst : '',
                      idx === time.length - 1 ? styles.filterButtonLast : '',
                      isActive ? styles.filterButtonActive : ''
                    ].join(' ').trim()}
                  >
                    {item.slice(0, 1).toUpperCase() + item.slice(1)}
                  </button>
                )
              })}
            </div>
          </div> */}
          {/* Chart */}
          <div className={styles.chartWrapper}>
            {timeFilter === 'year' && (<ChartYear />)}
          </div>
          {/* Stats */}
          <div className={styles.statList}>
            {/* Products */}
            <div className={styles.statCard}>
              <div className='boom-small' >
                <p className={styles.statTitle}>Products</p>
                <p className={styles.statValue}>{allProduct.toLocaleString('vi-VN')}</p>
                <p className={styles.statSub}>Are Selling</p>
              </div>
            </div>
            {/* Customer */}
            <div className={styles.statCard}>
              <div className='boom-small' >
                <p className={styles.statTitle}>Customers</p>
                <p className={styles.statValue}>{allCustomer.toLocaleString('vi-VN')}</p>
                <p className={styles.statSub}>Joined</p>
              </div>
            </div>
            {/* Order */}
            <div className={styles.statCard}>
              <div className='boom-small'>
                <p className={styles.statTitle}>Orders</p>
                <p className={styles.statValue}>{orderQuantity.toLocaleString('vi-VN')}</p>
                <p className={styles.statSub}>Completed</p>
              </div>
            </div>
            {/* Profit */}
            <div className={`${styles.statCard} ${styles.profitCard} boom-small`}>
              <div>
                <p className={styles.statTitle}>Profit</p>
                <p className={styles.profitValue}>{profit.toLocaleString('vi-VN')}</p>
                <p className={styles.statSub}>VNĐ</p>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Dashboard
