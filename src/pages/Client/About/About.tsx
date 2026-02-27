import Footer from '~/components/Footer/Footer'
import FadeInSection from '~/components/FadeInSection/FadeInSection60'

function About() {
  return (
    <div>
      <div style={{
        margin: '40px auto',
        background: '#fff',
        borderRadius: 12,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        minHeight: '100vh',
        padding: 32,
        maxWidth: 800
      }}>
        <FadeInSection>
          <h2>Giới thiệu về Shop</h2>
          <p>
            Chúng tôi cung cấp các sản phẩm chất lượng cao với giá cả hợp lý.
          </p>
        </FadeInSection>
        <FadeInSection>
          <h2>Sứ mệnh</h2>
          <p>
            Mang đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
          </p>
        </FadeInSection>
        <FadeInSection>
          <h2>Liên hệ</h2>
          <p>
            Email: contact@shop.com
          </p>
        </FadeInSection>
      </div>
      <Footer />
    </div>
  )
}

export default About
