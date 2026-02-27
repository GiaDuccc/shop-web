import HeroSection from '~/components/HeroSection/HeroSection'
import video1 from '~/assets/videoHeroSection/Fresh Foam X 1080v14 Pre-Run Video - NewBalance.mp4'
import Slider from '~/components/Slider/Slider'
import { useOutletContext } from 'react-router-dom'

interface BrandContext {
  brand: string
  types: string[]
}

function NewBalance() {
  const { brand, types } = useOutletContext<BrandContext>()

  return (
    <div>
      <HeroSection
        video={video1}
        title="New Balance"
        descTitle="We Got Now."
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

export default NewBalance