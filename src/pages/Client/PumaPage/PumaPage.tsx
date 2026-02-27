import HeroSection from '~/components/HeroSection/HeroSection'
import Slider from '~/components/Slider/Slider'
import video from '~/assets/videoHeroSection/PUMA. GO WILD..mp4'
import { useOutletContext } from 'react-router-dom'

interface BrandContext {
  brand: string
  types: string[]
}

function PumaPage() {
  const { brand, types } = useOutletContext<BrandContext>()

  return (
    <div>
      <HeroSection
        video={video}
        title="Puma"
        descTitle="Forever Faster."
        type="video"
      />

      {/* Không cần NavBar, ClientPage lo hết */}
      {/* Không cần Header/Footer */}

      {/* Slider */}
      {types.map((type) => (
        <Slider
          key={type}
          brand={brand}
          id={type}
          name={type.slice(0, 1).toUpperCase() + type.slice(1)}
          type={type}
        />
      ))}
    </div>
  )
}

export default PumaPage