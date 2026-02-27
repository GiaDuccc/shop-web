import logo from '~/assets/logo-big.png'
import logoutIcon from '~/assets/logout.png'
import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import styles from './Admin.module.scss'
import { signOutAdminAPI } from '~/apis/adminAPI/authAPI'

function Admin() {

  const navigate = useNavigate()
  const [, setIsLoadingPage] = useState(false)

  const handleLogout = async () => {
    try {
      // Gọi API logout để invalidate token ở server
      await signOutAdminAPI()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Xóa tất cả user data và token
      localStorage.removeItem('accessTokenAdmin')
      navigate('/admin/sign-in')
    }
  }

  useEffect(() => {
    setIsLoadingPage(true)
    setTimeout(() => {
      setIsLoadingPage(false)
    }, 400)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.mainLayout}>
        {/* Option */}
        <div className={styles.sidebar}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <img src={logo} className={styles.logo} alt="Logo" />
          </div>
          <div className={`${styles.option} ${styles.optionList}`}>
            {/* Home */}
            <div className={styles.optionItem} onClick={() => navigate('/')}>
              <p>Home</p>
            </div>
            {/* Dashboard */}
            <Link
              to=""
              className={`${styles.optionItem}`}
            >
              <p>Dashboard</p>
            </Link>
            {/* Product */}
            <Link
              className={`${styles.optionItem}`}
              to="product"
            >
              <p>Product</p>
            </Link>
            {/* Customer */}
            <Link
              className={`${styles.optionItem}`}
              to="customer"
            >
              <p>Customer</p>
            </Link>
            {/* Order */}
            <Link
              className={`${styles.optionItem}`}
              to="order"
            >
              <p>Order</p>
            </Link>
            <Link
              className={`${styles.optionItem}`}
              to="employee"
            >
              <p>Employee</p>
            </Link>
          </div>
          <div className={styles.logoutButton} onClick={() => handleLogout()}>
            <p>Logout</p>
            <img src={logoutIcon} className={styles.logoutIcon} alt="Logout" />
          </div>
        </div>
        <div className={styles.sidebarSpacer}></div>
        {/* Content */}
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Admin