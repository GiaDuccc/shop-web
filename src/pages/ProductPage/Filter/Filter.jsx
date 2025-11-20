/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box'
import FilterOptions from './FilterOptions/FilterOptions'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchAllProductAPI, fetchAllProductPageAPI } from '~/apis/productApi'
import '~/App.scss'

function Filter({ currentPage }) {

  const [filterOptions, setFilterOptions] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchProduct, setSearchProduct] = useState(searchParams.get('search'))

  useEffect(() => {
    const hasSearch = searchParams.get('search')

    const brandSet = new Set()
    const colorSet = new Set()
    const typeSet = new Set()
    const stockSet = ['Just in', 'Sold out']
    const sortBy = ['Newest', 'Oldest', 'Low-High', 'High-Low']

    if (hasSearch) {

      const allParams = Object.fromEntries(searchParams.entries())
      const { page, limit, slug, ...filters } = allParams

      fetchAllProductPageAPI(currentPage, 12, filters).then(data => {
        data.data.products.forEach(product => {
          brandSet.add(product.brand.toLowerCase())
          product.colors.forEach(c => colorSet.add(c.color.toLowerCase()))
          typeSet.add(product.type.toLowerCase())
        })
        setFilterOptions([
          { Brand: Array.from(brandSet).sort() },
          { Color: Array.from(colorSet).sort() },
          { Type: Array.from(typeSet).sort() },
          { Stock: Array.from(stockSet).sort() },
          { Sort: sortBy.sort() }
        ])
      })
    }
    else {
      fetchAllProductAPI().then(data => {
        data.forEach(product => {
          brandSet.add(product.brand.toLowerCase())
          product.colors.forEach(c => colorSet.add(c.color.toLowerCase()))
          typeSet.add(product.type.toLowerCase())
        })
        setFilterOptions([
          { Brand: Array.from(brandSet).sort() },
          { Color: Array.from(colorSet).sort() },
          { Type: Array.from(typeSet).sort() },
          { Stock: Array.from(stockSet).sort() },
          { Sort: sortBy.sort() }
        ])
      })
    }
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

      {/* Apply button */}
      {/* <Box sx={{ p: '0 12px 0 8px' }}>
        <Box
          onClick={apply}
          sx={{
            bgcolor: 'black',
            p: '6px 16px',
            borderRadius: '16px',
            textAlign: 'center',
            transition: 'all 0.35s cubic-bezier(0.42, 0, 0.58, 1)',
            boxShadow: '1px 1px 10px rgb(201, 200, 200)',
            '& p': {
              fontSize: '20px',
              fontWeight: '600',
              color: 'rgb(204, 204, 204)',
              transition: 'all 0.35s cubic-bezier(0.42, 0, 0.58, 1)'
            },
            '&:hover': {
              boxShadow: '1.5px 1.5px 10px rgb(122, 122, 122)',
              transform: 'scale(1.02)',
              transformOrigin: 'center',
              cursor: 'pointer'
            },
            '&:hover p': {
              color: 'rgb(255, 255, 255)'
            }
          }}>
          <Typography>Apply</Typography>
        </Box>
      </Box> */}
    </Box>
  )
}

export default Filter