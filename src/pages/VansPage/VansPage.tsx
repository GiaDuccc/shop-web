import Header from '~/components/Header/Header'
import Slogan from '~/components/Slogan/Slogan'
import HeroSection from '~/components/HeroSection/HeroSection'
import video from '~/assets/videoHeroSection/This is Off the Wall - VANS.mp4'
import NavBar from '~/components/NavBar/NavBar'
import Slider from '~/components/Slider/Slider'
import { useState } from 'react'
import Footer from '~/components/Footer/Footer'
import '~/App.scss'

function VansPage() {
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
      <Slogan />
      <HeroSection
        video={video} title={'VANS'} descTitle={'Off The Wall.'} type='video'
      />

      {types?.map((type, idx) => (
        <Slider key={idx} brand={brand} id={type} name={type.slice(0, 1).toUpperCase() + type.slice(1)} type={type} />
      ))}

      <Footer />
    </div>
  )
}

export default VansPage