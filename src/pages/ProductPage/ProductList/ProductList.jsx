import Box from '@mui/material/Box'
import ProductCard from './ProductCard/ProductCard'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCardDetail from './ProductCardDetail/ProductCardDetail'
import '~/App.scss'

function ProductList({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()

  // useEffect(() => {
  //   const slug = searchParams.get('slug')

  //   if (!slug) {
  //     setSelectedProduct(null)
  //     return
  //   }

  //   const foundProduct = products.find(p => p.slug === slug)
  //   setSelectedProduct(foundProduct || null)
  // }, [searchParams, products])

  return (
    <Box
      className='fade-in-up'
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        color: 'black',
        gap: 2.5,
        height: '100%',
        py: '24px'
      }}>
      {products?.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          index={index}
          onClick={() => {
            setSelectedProduct(product)

            // const currentParams = Object.fromEntries(searchParams.entries())
            // currentParams.slug = product.slug
            // setSearchParams(currentParams, { replace: false })
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
        />
      )}
    </Box>
  )
}

export default ProductList