import HeroSection from '~/components/HeroSection/HeroSection'
import img from '~/assets/videoHeroSection/balenciaga.jpg'
import Slider from '~/components/Slider/Slider'
import { useOutletContext } from 'react-router-dom'

interface BrandContext {
  brand: string
  types: string[]
}

function BalenciagaPage() {
  const { brand, types } = useOutletContext<BrandContext>()

  return (
    <div>
      <HeroSection
        video={img}
        title="BALENCIAGA"
        descTitle="It's Different."
        type="img"
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

export default BalenciagaPage