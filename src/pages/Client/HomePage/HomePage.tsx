import HeroSection from '~/components/HeroSection/HeroSection'
import video1 from '~/assets/videoHeroSection/home.mp4'
import Slider from '~/components/Slider/Slider'
import FadeInSection from '~/components/FadeInSection/FadeInSection60'

const brand = ['nike', 'adidas', 'puma', 'newbalance', 'vans', 'balenciaga']

function HomePage() {

  return (
    <>
      {/* <FadeInSection> */}
      <HeroSection video={video1} title={'Nice store'} descTitle={'Every Step, Handled with Care.'} type='video' />
      {/* </FadeInSection> */}
      {brand.map((item, idx) => (
        <FadeInSection key={idx}>
          <Slider brand={item} id={item} name={item.slice(0, 1).toUpperCase() + item.slice(1)} type='' />
        </FadeInSection>
      ))}
    </>
  )
}

export default HomePage