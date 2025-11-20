import tiktokIcon from '~/assets/tiktokIcon.jpeg'
import facebookIcon from '~/assets/facebookIcon.png'
import igIcon from '~/assets/ig.webp'
import xIcon from '~/assets/xIcon.png'
import styles from './Footer.module.scss'

const socialMedia = [
  { name: 'tiktok', icon: tiktokIcon, link: '#' },
  { name: 'facebook', icon: facebookIcon, link: 'https://www.facebook.com/gia.duc.nguyenw?locale=vi_VN' },
  { name: 'instagram', icon: igIcon, link: 'https://www.instagram.com/gia.duc.nguyenw/' },
  { name: 'x', icon: xIcon, link: '#' }
]

function Footer() {
  return (
    <div className={styles.footer_wrapper}>
      <div className={styles.footer_container}>
        <div className={styles.footer_content}>
          <div className={styles.footer_logo}>
            <h2>NICE STORE</h2>
          </div>

          <div className={styles.footer_section}>
            <p className={styles.footer_title}>Navigation</p>
            <div className={styles.footer_navigation}>
              <a href='/'>Home</a>
              <a href='/about'>About</a>
              <a href='#'>Services</a>
            </div>
          </div>

          <div className={styles.footer_section}>
            <p className={styles.footer_title}>Information</p>
            <div className={styles.footer_info}>
              <p>(+84) 123456789</p>
              <p>NiceStore@gmail.com</p>
            </div>
          </div>

          <div className={styles.footer_section}>
            <p className={styles.footer_title}>Opening Hours</p>
            <div className={styles.footer_hours}>
              <p>MonDay - Friday: 7:00-21:00</p>
              <p>Weekend: 9:00 - 21:00</p>
            </div>
          </div>
        </div>
        <div className={styles.footer_social}>
          { socialMedia.map((items, idx) => (
            <a href={items.link} key={idx}>
              <img src={items.icon} alt={items.name} />
            </a>
          ))}
        </div>
        <p className={styles.footer_copyright}>Copyright @2025 | Web make by Gia Duc</p>
      </div>
    </div>
  )
}

export default Footer