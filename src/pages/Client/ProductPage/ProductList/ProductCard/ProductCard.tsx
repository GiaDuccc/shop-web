import { useState } from 'react'
import styles from './ProductCard.module.scss'
import { Product } from '~/interface/product.interface'
 
interface ProductCardProps {
  product: Product
  index: number
  onClick: () => void
}

function ProductCard({ product, index, onClick }: ProductCardProps) {

  const [hoveredObject, setHoveredObject] = useState({ hoveredItem: null as number | null, hoveredColor: 0 })

  return (
    <div
      key={index}
      onClick={onClick}
      onMouseEnter={() => setHoveredObject(prev => ({ ...prev, hoveredItem: index }))}
      className={styles.product_card}
    >
      <div className={styles.image_container}>

        {/* Ảnh khi chưa click color */}
        <img src={product.colors[hoveredObject.hoveredColor].imageDetail[0]}
          className={hoveredObject.hoveredItem === index ? styles.image_hidden : styles.image_default}
          alt={product.name} />

        {/* Ảnh khi hover color */}
        {hoveredObject.hoveredItem === index && (
          <img
            src={product.colors[hoveredObject.hoveredColor].imageDetail[0]}
            className={styles.image_default}
            alt={product.name}
          />
        )}

      </div>
      <div className={styles.content_section}>
        {/* Màu sắc... */}
        <div className={styles.colors_container}>
          {product.colors.map((color, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredObject(prev => ({ ...prev, hoveredColor: idx }))}
              className={styles.color_dot}
              style={{ backgroundColor: color.colorHex }}
            ></div>
          ))}
        </div>
        <div className={styles.product_info}>
          {/* Stock */}
          <p className={styles.stock_status}>{product.stock > 0 ? 'Just in' : 'Sold Out'}</p>
          {/* Tên sản phẩm */}
          <p className={styles.product_name}>{product.name}</p>
          <p className={styles.product_type}>{product.type.slice(0, 1).toUpperCase() + product.type.slice(1)}</p>
          {/* Price */}
          <p className={styles.product_price}>{Number(product.price).toLocaleString('vi-VN')}đ</p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
