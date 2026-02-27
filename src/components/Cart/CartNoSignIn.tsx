/* eslint-disable no-console */
import Drawer from '@mui/material/Drawer'
import closeIcon from '~/assets/x-white.png'
import styles from './Cart.module.scss'

interface ShoppingCartProps {
  open: boolean
  toggleDrawer: () => void
}

function CartNoSignIn({ open, toggleDrawer }: ShoppingCartProps) {

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      className={styles.drawer}
      ModalProps={{
        BackdropProps: {
          sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }
        }
      }}
    >
      <div className={styles.cart_container}>
        <div className={`${styles.close_button} ${styles.close_button_not_logged}`} onClick={toggleDrawer}>
          <img src={closeIcon} alt="Close" />
        </div>
        <p className={`${styles.cart_title} ${styles.cart_title_not_logged}`}>Your Cart</p>
        <div className={styles.not_logged_content}>
          <p className={styles.not_logged_message}>Sign In for Shopping.</p>
          <div className={styles.signin_button}>
            <a href="/sign-in">Sign In</a>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default CartNoSignIn