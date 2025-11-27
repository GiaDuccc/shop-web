import { useState } from 'react'
import FilterItems from './FilterItems/FilterItems'
import downIcon from '~/assets/down.png'
import styles from './FilterOptions.module.scss'

interface FilterOption {
  [key: string]: any[]
}

function FilterOptions({ filterOptions }: { filterOptions: FilterOption[] }) {

  const initFilterOption = filterOptions.reduce((acc, option) => {
    const key = Object.keys(option)[0].toLowerCase()
    acc[key] = false
    return acc
  }, {} as { [key: string]: boolean })

  const [openFilterOption, setOpenFilterOption] = useState(initFilterOption)

  return (
    <div className={styles.filter_container}>
      {/* Filter Options */}
      {filterOptions.map((filterOption, index) => {
        const key = Object.keys(filterOption)[0];
        return (
          <div
            className={`${styles.filter_option_wrapper} ${openFilterOption[key.toLowerCase()] ? styles.open : styles.closed}`}
            key={index}
          >
            <div
              onClick={() => setOpenFilterOption(prev => ({ ...prev, [key.toLowerCase()]: !prev[key.toLowerCase()] }))}
              className={styles.filter_option_header}
            >
              <p>{key}</p>
              <div className={styles.toggle_icon_wrapper}>
                <img
                  src={downIcon}
                  alt="Toggle"
                  className={openFilterOption[key.toLowerCase()] ? styles.open : styles.closed}
                />
              </div>
            </div>
            <FilterItems filterOption={filterOption} openFilterOption={openFilterOption} idx={key} />
          </div>
        )
      })}
    </div>
  )
}

export default FilterOptions
