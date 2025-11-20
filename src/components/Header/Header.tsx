import { useEffect, useState } from 'react'
import logoIcon from '~/assets/logo2.png'
import shoppingBagIcon from '~/assets/cart.png'
import signInIcon from '~/assets/login.png'
import searchIcon from '~/assets/search.png'
import TextField from '@mui/material/TextField'
import Cart from '../Cart/Cart'
import Search from '../Search/Search'
import { fetchAllProductAPI } from '~/apis/productApi'
import { jwtDecode } from 'jwt-decode'
import styles from './Header.module.scss'
import RightIcon from '~/assets/right-icon.svg?react'
import { updateCartAPI } from '~/apis/cartApi'

// const headerHeight = (theme) => theme.shop.headerHeight // fallback, dùng biến css nếu có'
const headerHeight = '46px'


function Header() {
  const accessToken = localStorage.getItem('accessToken')
  const token = accessToken ? jwtDecode(accessToken) : null
  const [openCart, setOpenCart] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [productList, setProductList] = useState([])
  const [isOpenMobileAndTabletNav, setIsOpenMobileAndTabletNav] = useState(false)

  useEffect(() => {
    (async () => {
      const data = await fetchAllProductAPI()
      setProductList(data)
    })()
  }, [])

  useEffect(() => {
    const updateCart = async () => {
      const cartData = JSON.parse(sessionStorage.getItem('cart') || 'null')
      if (cartData && !openCart) {
        await updateCartAPI(cartData._id, {
          items: cartData.items
        })
      }
    }
    updateCart()
  }, [openCart])

  return (
    <div className={styles.header} style={{ '--header-height': headerHeight } as React.CSSProperties}>
      <a href="/" className={`${isOpenMobileAndTabletNav ? styles.nonDisplay : styles.logoLink}`} >
        <img src={logoIcon} alt="logo" className={styles.logoImg} />
      </a>
      <a href="/product" className={`${isOpenMobileAndTabletNav ? styles.nonDisplay : styles.navLink}`}>Product</a>

      <div className={`${styles.isMobileAndTabletNav} ${styles.navLink}`}
        onClick={() => setIsOpenMobileAndTabletNav(!isOpenMobileAndTabletNav)}
        style={{
          transform: isOpenMobileAndTabletNav ? 'translateX(20px)' : undefined
        }}
      >
        <p style={{ margin: 0, padding: '0 4px' }}>Brand</p>
        <RightIcon width={12} height={12} />
      </div>

      <nav className={`${styles.nav} ${isOpenMobileAndTabletNav ? styles.display : ''}`}
        style={{
          transform: isOpenMobileAndTabletNav ? 'translateX(10px)' : 'translateX(0px)',
          transition: 'all 0.5s ease'
        }}
      >
        <a href="/nike" className={styles.navLink}>Nike</a>
        <a href="/adidas" className={styles.navLink}>Adidas</a>
        <a href="/puma" className={styles.navLink}>Puma</a>
        <a href="/new-balance" className={styles.navLink}>NewBalance</a>
        <a href="/vans" className={styles.navLink}>Vans</a>
        <a href="/balenciaga" className={styles.navLink}>Balenciaga</a>
      </nav>


      <TextField placeholder='Search' type="text"
        onClick={() => {
          setOpenSearch(!openSearch)
        }}
        className={`${isOpenMobileAndTabletNav ? styles.nonDisplay : styles.textFieldRoot}`}
        InputProps={{
          className: styles.textFieldInputProps,
          classes: {
            root: styles.textFieldOutlinedRoot,
            input: styles.textFieldInput
          },
          endAdornment: (
            <div className={styles.textFieldEndAdornment}>
              <img src={searchIcon} alt="search" style={{ height: '14px', width: 'auto' }} />
            </div>
          ),
          readOnly: true
        }}
      />
      <Search open={openSearch} toggleDrawer={() => setOpenSearch(!openSearch)} productList={productList} />
      <div className={`${isOpenMobileAndTabletNav ? styles.nonDisplay : styles.cartIconBox}`} onClick={() => setOpenCart(!openCart)}>
        <img src={shoppingBagIcon} alt="cart" className={styles.cartIcon} />
      </div>
      <Cart open={openCart} toggleDrawer={() => setOpenCart(!openCart)} />
      <a href={token ? '/profile' : '/sign-in'} className={`${isOpenMobileAndTabletNav ? styles.nonDisplay : styles.signInLink}`}>
        <img src={signInIcon} alt="sign-in" className={styles.signInIcon} />
      </a>
    </div>
  )
}

export default Header