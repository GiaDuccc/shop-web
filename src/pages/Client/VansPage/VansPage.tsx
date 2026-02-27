import HeroSection from '~/components/HeroSection/HeroSection'
import video from '~/assets/videoHeroSection/This is Off the Wall - VANS.mp4'
import Slider from '~/components/Slider/Slider'
import { useOutletContext } from 'react-router-dom'

interface BrandContext {
  brand: string
  types: string[]
}

function VansPage() {
  const { brand, types } = useOutletContext<BrandContext>()

  return (
    <div>
      <HeroSection
        video={video}
        title="VANS"
        descTitle="Off The Wall."
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

export default VansPage