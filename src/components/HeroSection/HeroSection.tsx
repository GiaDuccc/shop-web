import { useState, useEffect, useRef } from 'react'
import playIcon from '~/assets/play-white.png'
import pauseIcon from '~/assets/pause-white.png'
import FadeInSection from '../FadeInSection/FadeInSection40'
import styles from './heroSection.module.scss'

interface HeroSectionProps {
  video: string
  title: string
  descTitle: string
  type: 'video' | 'img'
}

export default function HeroSection({ video, title, descTitle, type }: HeroSectionProps) {
  const [scale, setScale] = useState(1)
  const [borderRadius, setBorderRadius] = useState('0px')
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [playVideo, setPlayVideo] = useState(true)

  const togglePlayVideo = () => {
    if (!videoRef.current) return
    
    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
    setPlayVideo(!playVideo)
  }

  const pathName = window.location.pathname

  useEffect(() => {
    if (type === 'img') return

    const videoObserver = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, { threshold: 0.6 })

    if (videoRef.current) {
      videoObserver.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        videoObserver.unobserve(videoRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (type === 'img') return

    const saved = sessionStorage.getItem('scrollY')
    let scroll = 0
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.pathName === pathName) {
          scroll = parseFloat(parsed.scrollY) || 0
        }
      } catch {
        scroll = parseFloat(saved) || 0
      }
    }
    let newScale = Math.max(0.88, 1 - scroll / 4.7 / 1000)
    let newBorderRadius = Math.min(52, scroll / 14)
    if (scroll < 30) {
      newScale = 1
      newBorderRadius = 0
    }
    setScale(newScale)
    setBorderRadius(`${newBorderRadius}px`)

    const handleScroll = () => {
      if (!isVisible) return

      const scrollY = window.scrollY
      sessionStorage.setItem('scrollY', JSON.stringify({
        pathName: pathName,
        scrollY: scrollY
      }))

      let newScale = Math.max(0.88, 1 - scrollY / 4.7 / 1000)
      let newBorderRadius = Math.min(52, scrollY / 14)

      setScale(newScale)
      setBorderRadius(`${newBorderRadius}px`)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isVisible, pathName])

  return (
    <div className={styles.heroSection}>
      <FadeInSection delay={500}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title.toUpperCase()}</h1>
          <span className={styles.descTitle}>{descTitle}</span>
        </div>
      </FadeInSection>
      <FadeInSection delay={800}>
        <div
          className={styles.mediaWrapper}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            borderRadius: borderRadius
            // transition: 'transform 0.2s cubic-bezier(0.42, 0, 0.58, 1), border-radius 0.2s cubic-bezier(0.42, 0, 0.58, 1)'
          }}
        >
          {/* Video */}
          {type === 'video' ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              src={video}
              className={styles.media}
              onClick={togglePlayVideo}
            />
          ) : (
            <img
              src={video}
              alt={title}
              className={styles.media}
            />
          )}
          <div
            className={styles.playPauseBtn}
            style={{ display: type === 'img' ? 'none' : 'flex' }}
            onClick={togglePlayVideo}
          >
            {playVideo ?
              <img src={pauseIcon} className={styles.playPauseIcon} alt="Pause" />
              :
              <img src={playIcon} className={styles.playPauseIcon} alt="Play" />
            }
          </div>
        </div>
      </FadeInSection>
    </div>
  )
}