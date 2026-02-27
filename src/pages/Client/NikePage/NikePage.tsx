import nikeVideoHeroSection from '~/assets/videoHeroSection/Nike. Just Do It. Nike VN.mp4'
import { useOutletContext } from 'react-router-dom'
import Slider from '~/components/Slider/Slider'
import HeroSection from '~/components/HeroSection/HeroSection'

interface BrandContext {
  brand: string
  types: string[]
}

function NikePage() {
  const { brand, types } = useOutletContext<BrandContext>()

  return (
    <div>
      <HeroSection
        video={nikeVideoHeroSection}
        title="NIKE"
        descTitle="Just do it."
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

export default NikePage
