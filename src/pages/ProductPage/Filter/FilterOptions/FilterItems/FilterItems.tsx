import { Checkbox, FormControlLabel, FormGroup, Radio } from '@mui/material'
import doneIcon from '~/assets/v-white.png'
import { useSearchParams } from 'react-router-dom'
import styles from './FilterItems.module.scss'

interface FilterItemsProps {
  filterOption: { [key: string]: any[] }
  openFilterOption: { [key: string]: boolean }
  idx: string
}

function FilterItems({ filterOption, openFilterOption, idx }: FilterItemsProps) {

  const [searchParams, setSearchParams] = useSearchParams()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, filter: string, value: string) => {
    const checked = event.target.checked
    const isRadio = filter === 'sort'

    let newFilters
    if (isRadio) {
      const currentValue = searchParams.get(filter)

      if (currentValue === value) {
        searchParams.delete(filter)
      }
      else {
        searchParams.set(filter, value)
      }
    }
    else {
      const currentFilters = searchParams.get(`${filter}`)?.split(',') || []
      if (checked) {
        newFilters = [...currentFilters, `${value}`]
      }
      else {
        newFilters = currentFilters.filter(f => f !== `${value}`)
      }

      if (newFilters.length === 0) {
        searchParams.delete(filter)
      }
      else {
        searchParams.set(`${filter}`, newFilters.join(','))
      }
    }

    searchParams.set('page', '1')
    setSearchParams(searchParams)
  }

  const handleRadioToggle = (filter: string, value: string) => {
    const current = searchParams.get(filter);
    if (current === value) {
      searchParams.delete(filter);
    } else {
      searchParams.set(filter, value);
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  }

  return (
    <div className={`${styles.filter_items_container} ${openFilterOption[idx.toLowerCase()] ? styles.open : ''}`}>
      <FormGroup className={styles.form_group}>
        {filterOption[idx].map((item) => (
          <div key={item} className={styles.filter_item}>
            <FormControlLabel
              label={item.slice(0, 1).toUpperCase() + item.slice(1)}
              control={
                idx.toLowerCase() === 'sort' ? (
                  <Radio
                    checked={searchParams.get(idx.toLowerCase()) === item.toLowerCase()}
                    onClick={() => handleRadioToggle(idx.toLowerCase(), item.toLowerCase())}
                    disableRipple
                    disableTouchRipple
                    icon={<div className={styles.custom_icon} />}
                    checkedIcon={
                      <div className={styles.custom_checked_icon}>
                        <img src={doneIcon} alt="Selected" />
                      </div>
                    }
                    className={styles.custom_control}
                  />
                ) : (
                  <Checkbox
                    checked={searchParams.get(idx.toLowerCase())?.split(',').includes(item.toLowerCase()) || false}
                    onChange={e => handleChange(e, idx.toLowerCase(), item.toLowerCase())}
                    disableRipple
                    icon={<div className={styles.custom_icon} />}
                    checkedIcon={
                      <div className={styles.custom_checked_icon}>
                        <img src={doneIcon} alt="Selected" />
                      </div>
                    }
                    className={styles.custom_control}
                  />
                )
              }
              labelPlacement="start"
              className={styles.form_control_label}
            />
          </div>
        ))}
      </FormGroup>
    </div>
  )
}

export default FilterItems
