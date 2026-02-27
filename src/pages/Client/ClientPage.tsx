import Header from '~/components/Header/Header'
import Footer from '~/components/Footer/Footer'
import NavBar from '~/components/NavBar/NavBar'
import Slogan from '~/components/Slogan/Slogan'
import FadeInSection from '~/components/FadeInSection/FadeInSection60'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

function ClientPage() {
  const brandList = ['nike', 'adidas', 'puma', 'newbalance', 'vans', 'balenciaga']
  const [types, setTypes] = useState<string[]>([])
  let brand = window.location.pathname.slice(1)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Header />

      {/* NavBar chung nhưng nhận dữ liệu từ brand pages */}
      {brandList.includes(brand) && (
        <NavBar
          brand={brand}
          scrollToSection={scrollToSection}
          setTypes={(types: string[]) => setTypes(types)}
        />
      )}

      <FadeInSection>
        <Slogan />
      </FadeInSection>

      {/* Truyền xuống NikePage qua Outlet context */}
      <Outlet context={{ brand, types }} />

      <Footer />
    </div>
  )
}

export default ClientPage
