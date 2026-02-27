import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/Client/HomePage/HomePage'
import SignIn from './pages/Client/SignIn/SignIn'
import SignUp from './pages/Client/SignUp/SignUp'
import NikePage from './pages/Client/NikePage/NikePage'
import AdidasPage from './pages/Client/AdidasPage/AdidasPage'
import NewBalance from './pages/Client/NewBalancePage/NewBalance'
import PumaPage from './pages/Client/PumaPage/PumaPage'
import ProductPage from './pages/Client/ProductPage/ProductPage'
import Profile from './pages/Client/Profile/Profile'
import Checkout from './pages/Client/Checkout/Checkout'
import Admin from './pages/Admin/Admin'
import VansPage from './pages/Client/VansPage/VansPage'
import BalenciagaPage from './pages/Client/BalenciagaPage/BalenciagaPage'
import Chatbot from './components/Chatbot/Chatbot'
import About from './pages/Client/About/About'
import ClientPage from './pages/Client/ClientPage'
import { PublicRouteClient, PublicRouteAdmin } from './routes/PublicRoute'
import { ProtectedRouteClient, ProtectedRouteAdmin } from './routes/ProtectedRoute'
import SignInAdmin from './pages/Admin/SignIn/SignIn'
import Product from './pages/Admin/Product/Product'
import Order from './pages/Admin/Order/Order'
import Customer from './pages/Admin/Customer/Customer'
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import Employee from './pages/Admin/Employee/Employee'
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const AppRouter = () => {
    const location = useLocation()
    const notShowChatbot =
      location.pathname.startsWith('/admin') ||
      location.pathname === '/sign-in' ||
      location.pathname === '/sign-up' ||
      location.pathname === '/checkout'

    return (
      <>
        {!notShowChatbot && <Chatbot />}
        <Routes>
          <Route element={<PublicRouteClient />}>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
          </Route>
          <Route element={<ProtectedRouteClient />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/checkout' element={<Checkout />} />
          </Route>
          <Route element={<ClientPage />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/product' element={<ProductPage />} />
            <Route path='/nike' element={<NikePage />} />
            <Route path='/adidas' element={<AdidasPage />} />
            <Route path='/puma' element={<PumaPage />} />
            <Route path='/newbalance' element={<NewBalance />} />
            <Route path='/vans' element={<VansPage />} />
            <Route path='/balenciaga' element={<BalenciagaPage />} />
            <Route path='/about' element={<About />} />
          </Route>
          <Route element={<PublicRouteAdmin />}>
            <Route path='/admin/sign-in' element={<SignInAdmin />} />
          </Route>
          <Route element={<ProtectedRouteAdmin />}>
            <Route path='/admin' element={<Admin />}>
              <Route index element={<Dashboard />} />
              <Route path='product' element={<Product />} />
              <Route path='order' element={<Order />} />
              <Route path='customer' element={<Customer />} />
              <Route path='employee' element={<Employee />} />
            </Route>
          </Route>
        </Routes>
      </>
    )
  }

  return (
    <Router>
      <AppRouter />
      <ToastContainer
        position='bottom-right'
        pauseOnHover
        toastClassName='custom-toast'
        theme='colored'
        transition={Flip}
      />
    </Router>
  )
}

export default App
