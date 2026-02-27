import ProductCard from './ProductCard/ProductCard'
import { useState } from 'react'
import ProductCardDetail from '~/components/ProductCardDetail/ProductCardDetail'
import Cart from '~/components/Cart/Cart'
import { Product } from '~/interface/product.interface'
import '~/App.scss'

interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeCart, setActiveCart] = useState(false)

  return (
    <div
      className='fade-in-up'
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        color: 'black',
        gap: '24px',
        height: '100%',
        padding: '24px 0',
      }}>
      {products?.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          index={index}
          onClick={() => {
            setSelectedProduct(product)
          }}
        />
      ))}
      {selectedProduct && (
        <ProductCardDetail
          product={selectedProduct}
          open={Boolean(selectedProduct)}
          onClose={() => {
            setSelectedProduct(null)
          }}
          onGoToCart={() => setActiveCart(true)}
        />
      )}
      {activeCart && (
        <Cart open={activeCart} toggleDrawer={() => setActiveCart(false)} />
      )}
    </div>
  )
}

export default ProductList