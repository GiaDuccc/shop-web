import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import SignIn from './pages/SignIn/SignIn'
import SignUp from './pages/SignUp/SignUp'
import NikePage from './pages/NikePage/NikePage'
import AdidasPage from './pages/AdidasPage/AdidasPage'
import NewBalance from './pages/NewBalancePage/NewBalance'
import PumaPage from './pages/PumaPage/PumaPage'
import ProductPage from './pages/ProductPage/ProducePage'
import Profile from './pages/Profile/Profile'
import Checkout from './pages/Checkout/Checkout'
import Admin from './pages/Admin/Admin'
import { fetchCustomerDetailAPI } from './apis'
import { useEffect } from 'react'
import VansPage from './pages/VansPage/VansPage'
import BalenciagaPage from './pages/BalenciagaPage/BalenciagaPage'
import Chatbot from './components/Chatbot/Chatbot'
import About from './pages/About/About'

function App() {

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    if (token && user) {
      const fetchCustomerDetail = async () => {
        try {
          const data = await fetchCustomerDetailAPI(user._id)
          if (data.role !== user.role) {
            // Role thay đổi, logout user
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
          }
        } catch (error: any) {
          // Chỉ logout nếu là lỗi authentication
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
          }
          // Các lỗi khác (network, server down) không logout
          console.error('Error checking user details:', error)
        }
      }
      fetchCustomerDetail()
    }
  }, [])

  const AppRouter = () => {
    const location = useLocation()
    const notShowChatbot = ['/admin', '/sign-in', '/sign-up', '/checkout'].includes(location.pathname)

    return (
      <>
        {!notShowChatbot && <Chatbot />}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/nike' element={<NikePage />} />
          <Route path='/adidas' element={<AdidasPage />} />
          <Route path='/puma' element={<PumaPage />} />
          <Route path='/new-balance' element={<NewBalance />} />
          <Route path='/vans' element={<VansPage />} />
          <Route path='/balenciaga' element={<BalenciagaPage />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </>
    )
  }

  return (
    <Router>
      <AppRouter />
    </Router>
  )
}

export default App
