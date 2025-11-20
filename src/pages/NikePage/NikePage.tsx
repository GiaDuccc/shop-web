import Header from '~/components/Header/Header'
import Slogan from '~/components/Slogan/Slogan'
import HeroSection from '~/components/HeroSection/HeroSection'
import nikeVideoHeroSection from '~/assets/videoHeroSection/Nike. Just Do It. Nike VN.mp4'
import NavBar from '~/components/NavBar/NavBar'
import Slider from '~/components/Slider/Slider'
import { useState } from 'react'
import Footer from '~/components/Footer/Footer'
import FadeInSection from '~/components/FadeInSection/FadeInSection60'
import '~/App.scss'

function NikePage() {
  const brand = window.location.pathname.slice(1)
  const [types, setTypes] = useState<string[]>([])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div>
      <Header />
      <NavBar brand={brand} scrollToSection={(id: string) => scrollToSection(id)} setTypes={(types: string[]) => setTypes(types)} />
      <FadeInSection>
        <Slogan />
      </FadeInSection>
      <HeroSection
        video={nikeVideoHeroSection} title={'NIKE'} descTitle={'Just do it.'} type='video'
      />

      {types?.map((type, idx) => (
        <Slider key={idx} brand={brand} id={type} name={type.slice(0, 1).toUpperCase() + type.slice(1)} type={type} />
      ))}

      <Footer />
    </div>
  )
}

export default NikePage