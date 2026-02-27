import { useEffect, useState } from 'react'
import { getTypeAndNavbarImageFromBrand } from '~/apis/clientAPI/productApi'
import '~/App.scss'
import FadeInSection from '../FadeInSection/FadeInSection60'
import styles from './NavBar.module.scss'

interface TypeAndNavbarImage {
  type: string
  navbarImage: string
}

interface NavBarProps {
  scrollToSection: (type: string) => void
  setTypes: (types: string[]) => void
  brand: string
}

function NavBar({ scrollToSection, setTypes, brand }: NavBarProps) {

  const [typesAndNavbarImages, setTypesAndNavbarImages] = useState<TypeAndNavbarImage[]>([])

  const fetchTypeAndNavbarImage = async () => {
    await getTypeAndNavbarImageFromBrand(brand).then(data => {
      setTypesAndNavbarImages(data.sort())
      setTypes(data.map((type: TypeAndNavbarImage) => type.type))
    })
  }

  useEffect(() => {
    fetchTypeAndNavbarImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`fade-in-up ${styles.navbar_container}`}>
      {typesAndNavbarImages.length > 0 ? typesAndNavbarImages.map((item, index) => (
        <FadeInSection key={index} delay={index * 100}>
          <div
            onClick={() => scrollToSection(item.type)}
            className={styles.navbar_item}
          >
            <div className={styles.navbar_image_wrapper}>
              <img
                src={item.navbarImage}
                alt={item.type}
              />
            </div>
            <span className={styles.navbar_label}>{item.type.slice(0, 1).toUpperCase() + item.type.slice(1)}</span>
          </div>
        </FadeInSection>
      )) : (
        <div className={styles.loading_wrapper}>
          <div className={`spinner-black ${styles.loading_spinner}`}></div>
        </div>
      )}
    </div>
  )
}

export default NavBar