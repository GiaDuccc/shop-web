import Header from '~/components/Header/Header'
import HeroSection from '~/components/HeroSection/HeroSection'
import Slogan from '~/components/Slogan/Slogan'
import { useState } from 'react'
import NavBar from '~/components/NavBar/NavBar'
import Footer from '~/components/Footer/Footer'
import video1 from '~/assets/videoHeroSection/Fresh Foam X 1080v14 Pre-Run Video - NewBalance.mp4'
import Slider from '~/components/Slider/Slider'

function NewBalance() {
  const brand = 'new balance'
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
      <HeroSection video={video1} title={'New Balance'} descTitle={'We Got Now.'} type='video'/>
      {types?.map((type, idx) => (
        <Slider brand={brand} key={idx} id={type} name={type.slice(0, 1).toUpperCase() + type.slice(1)} type={type} />
      ))}
      <Footer />
    </div>
  )
}

export default NewBalance