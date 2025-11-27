/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box'
import FilterOptions from './FilterOptions/FilterOptions'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAllProductAPI, fetchAllProductPageAPI } from '~/apis/productApi'
import '~/App.scss'

interface FilterProps {
  currentPage: number
}

interface Product {
  adImage: string;
  brand: string;
  colors: {
    color: string;
    colorHex?: string;
    imageDetail: string[];
    sizes: {
      size: string;
      quantity: number;
    }[];
  }[];
  desc: string;
  highLight: string;
  name: string;
  navbarImage: string;
  price: number;
  slug: string;
  stock: number;
  type: string;
  _id: string;
}

interface FilterOption {
  [key: string]: any[]
}

function Filter({ currentPage }: FilterProps) {

  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchProduct, setSearchProduct] = useState(searchParams.get('search'))

  useEffect(() => {
    const fetchFilterOptions = async () => {

      const hasSearch = searchParams.get('search')

      const brandSet = new Set()
      // const colorSet = new Set()
      const typeSet = new Set()
      const stockSet = ['Just in', 'Sold out']
      const sortBy = ['Newest', 'Oldest', 'Low-High', 'High-Low']

      if (hasSearch) {

        const allParams = Object.fromEntries(searchParams.entries())
        const { page, limit, slug, ...filters } = allParams

        await fetchAllProductPageAPI(currentPage, 24, filters).then(data => {
          data.data.products.forEach((product: Product) => {
            // brandSet.add(product.brand.toLowerCase())
            // product.colors.forEach(c => colorSet.add(c.color.toLowerCase()))
            typeSet.add(product.type.toLowerCase())
          })
          setFilterOptions([
            // { Brand: Array.from(brandSet).sort() },
            // { Color: Array.from(colorSet).sort() },
            { Type: Array.from(typeSet).sort() },
            { Stock: Array.from(stockSet).sort() },
            { Sort: sortBy.sort() }
          ])
        })
      }
      else {
        await fetchAllProductAPI().then(data => {
          data.forEach((product: Product) => {
            brandSet.add(product.brand.toLowerCase())
            // product.colors.forEach(c => colorSet.add(c.color.toLowerCase()))
            typeSet.add(product.type.toLowerCase())
          })
          setFilterOptions([
            { Brand: Array.from(brandSet).sort() },
            // { Color: Array.from(colorSet).sort() },
            { Type: Array.from(typeSet).sort() },
            { Stock: Array.from(stockSet).sort() },
            { Sort: sortBy.sort() }
          ])
        })
      }
    }
    fetchFilterOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchProduct])

  return (
    <Box
      className="Filter fade-in-up"
      sx={{
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        color: 'rgba(0,0,0,.85)',
        flex: 2,
        height: '100%',
        pt: '16px'
      }}
    >
      {/* FilterOptions */}
      <FilterOptions filterOptions={filterOptions} />
    </Box>
  )
}

export default Filter