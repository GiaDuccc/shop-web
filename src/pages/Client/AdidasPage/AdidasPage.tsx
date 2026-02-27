import HeroSection from '~/components/HeroSection/HeroSection'
import Slider from '~/components/Slider/Slider'
import video from '~/assets/videoHeroSection/Epic Adidas shoe commercial concept - product video B-ROLL.mp4'
import { useOutletContext } from 'react-router-dom'

interface BrandContext {
  brand: string
  types: string[]
}

function AdidasPage() {
  const { brand, types } = useOutletContext<BrandContext>()
  return (
    <div>
      <HeroSection video={video} title={'Adidas'} descTitle={'Impossible is Nothing.'} type='video' />
      {types?.map((type) => (
        <Slider brand={brand} key={type} id={type} name={type.slice(0, 1).toUpperCase() + type.slice(1)} type={type} />
      ))}
    </div>
  )
}

export default AdidasPage