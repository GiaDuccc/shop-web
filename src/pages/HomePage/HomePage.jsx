import Header from '~/components/Header/Header'
import Slogan from '~/components/Slogan/Slogan'
import HeroSection from '~/components/HeroSection/HeroSection'
import video1 from '~/assets/videoHeroSection/home.mp4'
import Footer from '~/components/Footer/Footer'
import Slider from '~/components/Slider/Slider'
import FadeInSection from '~/components/FadeInSection/FadeInSection60'
import SlideDownSection from '~/components/SlideDownSection/SlideDownSection'
import styles from './HomePage.module.scss'

const brand = ['nike', 'adidas', 'puma', 'new balance', 'vans', 'balenciaga']

function HomePage() {

  return (
    <div className={styles.container}>
      <Header />
      <SlideDownSection>
        <Slogan />
      </SlideDownSection>
      {/* <FadeInSection> */}
      <HeroSection video={video1} title={'Nice store'} descTitle={'Every Step, Handled with Care.'} type='video' />
      {/* </FadeInSection> */}
      {brand.map((item, idx) => (
        <FadeInSection key={idx}>
          <Slider brand={item} id={item} name={item.slice(0, 1).toUpperCase() + item.slice(1)} type='' />
        </FadeInSection>
      ))}
      <Footer />
    </div>
  )
}

export default HomePage