import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './slogan.module.scss'
import '~/App.scss'

const slogan = 'Explore our exclusive collection of authentic sneakers from Nike, Adidas, Converse,...'

const ColorChangeSlogan = () => {
  const [colorSlogan, setColorSlogan] = useState({ bgcolor: '#3498db', textColor: 'white', linkColor: 'white' })

  useEffect(() => {
    const timer = setTimeout(() => {
      setColorSlogan({ bgcolor: '#ecf0f1', textColor: 'rgba(0,0,0,.9)', linkColor: '#2980b9' })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={styles.sloganWrapper}
      style={{ backgroundColor: colorSlogan.bgcolor }}
    >
      <div className={styles.sloganInner}>
        <span
          className={styles.sloganText}
          style={{ color: colorSlogan.textColor }}
        >
          {slogan}
        </span>
        <Link
          to="#"
          className={styles.sloganLink}
          style={{ color: colorSlogan.linkColor }}
        >
          Learn more
        </Link>
      </div>
    </div>
  )
}

export default function Slogan() {
  return <ColorChangeSlogan />
}