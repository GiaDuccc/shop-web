import Header from '~/components/Header/Header'
import HeroSection from '~/components/HeroSection/HeroSection'
import Slogan from '~/components/Slogan/Slogan'
import { useState } from 'react'
import NavBar from '~/components/NavBar/NavBar'
import Footer from '~/components/Footer/Footer'
import Slider from '~/components/Slider/Slider'
import video from '~/assets/videoHeroSection/Epic Adidas shoe commercial concept - product video B-ROLL.mp4'

function AdidasPage() {
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
      <HeroSection video={video} title={'Adidas'} descTitle={'Impossible is Nothing.'} type='video' />
      {types?.map((type, idx) => (
        <Slider brand={brand} key={idx} id={type} name={type.slice(0, 1).toUpperCase() + type.slice(1)} type={type} />
      ))}
      <Footer />
    </div>
  )
}

export default AdidasPage