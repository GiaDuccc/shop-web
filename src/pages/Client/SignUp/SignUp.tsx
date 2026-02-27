import Header from '~/components/Header/Header'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import '~/App.scss'
import styles from './SignUp.module.scss'
import downIcon from '~/assets/down.png'
import { selectValue } from './selectValue'
import { fetchCreateCustomerAPI } from '~/apis/clientAPI/authApi'
import { useNavigate } from 'react-router-dom'
import warningIcon from '~/assets/danger.png'
import dingSound from '~/assets/ding-sound.mp3'
import checkIcon from '~/assets/check.png'
import errorIcon from '~/assets/error.png'

interface FieldState {
  value: string | { day: string; month: string; year: string }
  nameError: string
  error: boolean
}

interface FormValues {
  lastName: FieldState
  firstName: FieldState
  country: FieldState
  dob: {
    value: { day: string; month: string; year: string }
    nameError: string
    error: boolean
  }
  email: FieldState
  phone: FieldState
  password: FieldState
  confirmPassword: FieldState
}

type SubmitState = 'idle' | 'loading' | 'success' | 'failed'

function SignUp() {

  const [isSubmit, setIsSubmit] = useState<SubmitState>('idle')

  const navigate = useNavigate()

  const [formError, setFormError] = useState<boolean>(true)
  const tickSound = new Audio(dingSound)

  const [values, setValues] = useState<FormValues>({
    lastName: {
      value: '',
      nameError: '',
      error: false
    },
    firstName: {
      value: '',
      nameError: '',
      error: false
    },
    country: {
      value: '',
      nameError: '',
      error: false
    },
    dob: {
      value: {
        day: '',
        month: '',
        year: ''
      },
      nameError: '',
      error: false
    },
    email: {
      value: '',
      nameError: '',
      error: false
    },
    phone: {
      value: '',
      nameError: '',
      error: false
    },
    password: {
      value: '',
      nameError: '',
      error: false
    },
    confirmPassword: {
      value: '',
      nameError: '',
      error: false
    }
  })

  const handleFieldChange = (fieldName: string, newValue: string) => {
    if (fieldName.split('.')[0] === 'dob') {
      const [, key] = fieldName.split('.')

      const updateValue = {
        ...values.dob.value,
        [key]: newValue
      }
      setValues(prev => ({
        ...prev,
        dob: {
          ...prev.dob,
          value: updateValue
        }
      }))

      const { day, month, year } = updateValue
      if (day && month && year) {
        const date_raw = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        const date = new Date(date_raw)

        const isValid =
          date instanceof Date &&
          !isNaN(date.getTime()) &&
          date.getDate() == parseInt(day) &&
          date.getMonth() + 1 == parseInt(month) &&
          date.getFullYear() == parseInt(year)

        if (!isValid) {
          setValues(prev => ({
            ...prev,
            dob: {
              ...prev.dob,
              nameError: 'Date is invalid.',
              error: true
            }
          }))
        } else {
          const today = new Date();
          let age = today.getFullYear() - date.getFullYear();
          const monthDiff = today.getMonth() - date.getMonth();
          const dayDiff = today.getDate() - date.getDate();

          // Kiểm tra nếu chưa tới sinh nhật năm nay thì trừ đi 1 tuổi
          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
          }

          if (age < 18) {
            setValues(prev => ({
              ...prev,
              dob: {
                ...prev.dob,
                nameError: 'You must be at least 18 years old.',
                error: true
              }
            }))
          }
          else {
            setValues(prev => ({
              ...prev,
              dob: {
                ...prev.dob,
                error: false
              }
            }))
          }
        }
      }
    }
    else {
      setValues(prev => ({
        ...prev,
        [fieldName]: {
          ...(prev[fieldName as keyof FormValues] as FieldState),
          value: newValue,
          error: false,
          nameError: ''
        }
      }))
      if (fieldName === 'password') {
        handleError(fieldName, newValue, 'Password')
      }
      if (fieldName === 'confirmPassword') {
        handleError(fieldName, newValue, 'Confirm Password')
      }
    }
  }

  const handleError = (fieldName: string, value: string | { day: string; month: string; year: string }, label: string = '') => {

    if (fieldName === 'dob') {
      // const [, key] = fieldName.split('.')
      if (typeof value === 'string' && value.trim() === '') {
        setValues(prev => ({
          ...prev,
          dob: {
            ...prev.dob,
            nameError: 'Enter valid date of birth.',
            error: true
          }
        }))
      }
    } else if (typeof value === 'string' && value.trim() === '') {
      setValues(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName as keyof FormValues],
          error: true,
          nameError: !values[fieldName as keyof FormValues].error ? `Enter your ${label}` : values[fieldName as keyof FormValues].nameError
        }
      }))
    } else if (fieldName === 'email' && typeof value === 'string') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

      if (!isValid) {
        setValues(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            error: true,
            nameError: 'Enter valid Email.'
          }
        }))
      }
    } else if (fieldName === 'phone' && typeof value === 'string') {
      const isValid = /^\d{10,12}$/.test(value)
      if (!isValid) {
        setValues(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            error: true,
            nameError: 'Enter valid Phone Number.'
          }
        }))
      }
    } else if ((fieldName === 'password' || fieldName === 'confirmPassword') && typeof value === 'string') {
      let error = ''
      if (value.length < 8) error = 'At least 8 characters.'
      else if (!/[A-Z]/.test(value)) error = 'At least one uppercase letter.'
      else if (!/\d/.test(value)) error = 'At least one number.'
      else if (!/[\W_]/.test(value)) error = 'At leat one special character.'
      else if (fieldName === 'confirmPassword') {
        value !== values.password.value && (error = 'The passwords you entered does not match.')
      }
      if (error) {
        setValues(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            error: true,
            nameError: error
          }
        }))
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmit('loading')

    if (!formError) {
      const payload = {
        lastName: values.lastName.value,
        firstName: values.firstName.value,
        country: values.country.value,
        dob: `${values.dob.value.year}-${values.dob.value.month.padStart(2, '0')}-${values.dob.value.day.padStart(2, '0')}`,
        email: values.email.value,
        phone: values.phone.value,
        password: values.password.value
      }

      await fetchCreateCustomerAPI(payload)
        .then(() => {
          tickSound.volume = 0.25
          tickSound.play()
          setTimeout(() => {
            setIsSubmit('success')
            setTimeout(() => {
              navigate('/sign-in')
            }, 700)
          }, 200)
        })
        .catch((errors: any) => {
          setIsSubmit('failed')
          Object.entries(errors).forEach(([key, field]) => {
            setValues(prev => ({
              ...prev,
              [key]: {
                ...prev[key as keyof FormValues],
                error: true,
                nameError: field as string
              }
            }))
          })
        })
      // .finally(() => setIsSubmit(false))
    }
    setTimeout(() => {
      setIsSubmit('idle')
    }, 1500)
  }

  useEffect(() => {
    let error = true

    for (const [, field] of Object.entries(values)) {
      // console.log('key', key)
      if (typeof field.value === 'object') {
        for (const subVal of Object.values(field.value)) {
          if (subVal === '' || field.error) {
            error = true
            continue
          }
          error = false
        }
        if (error) break
      } else {
        if (field.value === '' || field.error) {
          error = true
          break
        }
        error = false
      }
    }
    // console.log('error:', error)
    // console.log('thoat khoi vong lap')
    setFormError(error)
  }, [values])

  // useEffect(() => {
  //   console.log(formError)
  // }, [values])

  return (
    <div className={styles.container}>
      <Header />
      <div className='fade-in-up'>
        {/* Title */}
        <div className={styles.titleSection}>
          <p className={styles.titleText}>Nice Store Account</p>
          <div className={styles.navLinks}>
            <a href="/sign-in">Sign In</a>
            <a href="#" className={styles.disabledLink}>Sign Up</a>
            <a href="#">FAQ</a>
          </div>
        </div>
        <hr className={styles.divider} />
        {/* Content */}
        <div className={`${styles.formContainer} ${formError ? 'shake' : ''}`}>
          <div className={styles.headerSection}>
            <p className={styles.mainTitle}>Create Your Account</p>
            <p className={styles.subtitle}>One Account is all you need to access all My services.</p>
            <div className={styles.signInPrompt}>
              <p>Already have an Account?</p>
              <div className={styles.signInLink}>
                <a href="/sign-in">Sign In</a>
              </div>
            </div>
          </div>

          {/* LastName & FirstName */}
          <div className={styles.nameFields}>
            {/* LastName */}
            <TextField
              className={values.lastName.error ? 'shake' : ''}
              autoFocus
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              onBlur={() => handleError('lastName', values.lastName.value, 'Last Name')}
              id="filledLastName"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {values.lastName.error && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                  {values.lastName.error ? values.lastName.nameError : 'Last Name'}
                </span>
              }
              variant="filled"
              InputProps={{
                disableUnderline: true
              }}
              sx={{
                flex: 1,
                backgroundColor: 'white',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  border: values.lastName.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                  '&.Mui-focused': {
                    border: values.lastName.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                    borderRadius: '16px',
                    backgroundColor: 'white'
                  },
                  '& input:-webkit-autofill': {
                    borderRadius: '16px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: values.lastName.error ? 'rgb(184, 53, 53)' : '#666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: values.lastName.error ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                }
              }}
            />
            {/* FirstName */}
            <TextField
              className={values.firstName.error ? 'shake' : ''}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              onBlur={() => handleError('firstName', values.firstName.value, 'Last Name')}
              id="filledFirstName"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {values.firstName.error && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                  {values.firstName.error ? values.firstName.nameError : 'First Name'}
                </span>
              }
              variant="filled"
              InputProps={{
                disableUnderline: true
              }}
              sx={{
                flex: 1,
                backgroundColor: 'white',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  border: values.firstName.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                  '&.Mui-focused': {
                    border: values.firstName.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                    borderRadius: '16px',
                    backgroundColor: 'white'
                  },
                  '& input:-webkit-autofill': {
                    borderRadius: '16px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: values.firstName.error ? 'rgb(184, 53, 53)' : '#666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: values.firstName.error ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                }
              }}
            />
          </div>
          {/* Country */}
          <div className={`${styles.selectWrapper} ${values.country.error ? 'shake' : ''}`}>
            <TextField
              onChange={(e) => handleFieldChange('country', e.target.value)}
              onBlur={() => handleError('country', values.country.value, 'Country/Region')}
              id="select_country"
              select
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {values.country.error && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                  {values.country.error ? values.country.nameError : 'Country/Region'}
                </span>
              }
              defaultValue=''
              SelectProps={{
                native: true,
                IconComponent: () => null
              }}
              InputProps={{
                disableUnderline: true
              }}
              variant="filled"
              sx={{
                width: '100%',
                backgroundColor: 'white',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  paddingRight: '10px',
                  color: values.country.value ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255,255,255, 0)',
                  border: values.country.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                  '&.Mui-focused': {
                    border: values.country.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                    borderRadius: '16px',
                    backgroundColor: 'white'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: values.country.error ? 'rgb(184, 53, 53)' : '#666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: values.country.error ? ' rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                },
                '& select': {
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: 'none',
                  paddingRight: '30px'
                },
                '& .MuiSelect-icon': {
                  display: 'none'
                }
              }}
            >
              <option value="" disabled style={{
                backgroundColor: '#e2e2e2',
                color: 'black'
              }}
              >
                Country/Region
              </option>
              {selectValue.countries.map((country, idx) => (
                <option
                  key={idx}
                  value={country.code}
                  style={{
                    backgroundColor: 'white',
                    color: 'black'
                  }}
                >
                  {country.name}
                </option>
              ))}
            </TextField>
            <img src={downIcon} className={styles.selectIcon} />
          </div>
          {/* Date */}
          <div className={styles.dateSection}>
            <div>
              <p className={styles.dateLabel}>Date of Birth</p>
            </div>
            <div className={styles.dateFields}>
              {/* Day */}
              <div className={`${styles.selectWrapper} ${styles.dateField} ${values.dob.error ? 'shake' : ''}`}>
                <TextField
                  onChange={(e) => handleFieldChange('dob.day', e.target.value)}
                  onBlur={() => handleError('dob', values.dob.value.day)}
                  id="select_day"
                  select
                  label="Day"
                  variant="filled"
                  defaultValue=''
                  SelectProps={{
                    native: true,
                    IconComponent: () => null
                  }}
                  InputProps={{
                    disableUnderline: true
                  }}
                  sx={{
                    width: '100%',
                    backgroundColor: 'white',
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      paddingRight: '10px',
                      color: values.dob.value.day ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255,255,255, 0)',
                      border: values.dob.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                      '&.Mui-focused': {
                        border: values.dob.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                        borderRadius: '16px',
                        backgroundColor: 'white'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: values.dob.error ? 'rgb(184, 53, 53)' : '#666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: values.dob.error ? ' rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                    }
                  }}
                >
                  <option value="" disabled style={{
                    backgroundColor: '#e2e2e2',
                    color: 'black'
                  }}
                  >
                    Day
                  </option>
                  {selectValue.days.map((day, idx) => (
                    <option key={idx} value={day} style={{
                      backgroundColor: 'white',
                      color: 'black'
                    }}>
                      {day}
                    </option>
                  ))}
                </TextField>
                <img src={downIcon} className={styles.selectIcon} />
              </div>
              {/* Month */}
              <div className={`${styles.selectWrapper} ${styles.dateField} ${values.dob.error ? 'shake' : ''}`}>
                <TextField
                  onChange={(e) => handleFieldChange('dob.month', e.target.value)}
                  onBlur={() => handleError('dob', values.dob.value.month)}
                  id="filled-select-currency-native"
                  select
                  label="Month"
                  variant="filled"
                  defaultValue=''
                  SelectProps={{
                    native: true,
                    IconComponent: () => null
                  }}
                  InputProps={{
                    disableUnderline: true
                  }}
                  sx={{
                    width: '100%',
                    backgroundColor: 'white',
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      paddingRight: '10px',
                      color: values.dob.value.month ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255,255,255, 0)',
                      border: values.dob.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                      '&.Mui-focused': {
                        border: values.dob.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                        borderRadius: '16px',
                        backgroundColor: 'white'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: values.dob.error ? 'rgb(184, 53, 53)' : '#666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: values.dob.error ? ' rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                    }
                  }}
                >
                  <option value="" disabled style={{
                    backgroundColor: '#e2e2e2',
                    color: 'black'
                  }}
                  >
                    Month
                  </option>
                  {selectValue.months.map((month, idx) => (
                    <option key={idx} value={month} style={{
                      backgroundColor: 'white',
                      color: 'black'
                    }}>
                      {month}
                    </option>
                  ))}
                </TextField>
                <img src={downIcon} className={styles.selectIcon} />
              </div>
              {/* Year */}
              <div className={`${styles.selectWrapper} ${styles.dateField} ${values.dob.error ? 'shake' : ''}`}>
                <TextField
                  onChange={(e) => handleFieldChange('dob.year', e.target.value)}
                  onBlur={() => handleError('dob', values.dob.value.year)}
                  id="filled-select-currency-native"
                  select
                  label="Year"
                  variant="filled"
                  defaultValue=''
                  SelectProps={{
                    native: true,
                    IconComponent: () => null
                  }}
                  InputProps={{
                    disableUnderline: true
                  }}
                  sx={{
                    width: '100%',
                    backgroundColor: 'white',
                    '& .MuiFilledInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      paddingRight: '10px',
                      color: values.dob.value.year ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255,255,255, 0)',
                      border: values.dob.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                      '&.Mui-focused': {
                        border: values.dob.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                        borderRadius: '16px',
                        backgroundColor: 'white'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: values.dob.error ? 'rgb(184, 53, 53)' : '#666'
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: values.dob.error ? ' rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                    }
                  }}
                >
                  <option value="" disabled style={{
                    backgroundColor: '#e2e2e2',
                    color: 'black'
                  }}
                  >
                    Year
                  </option>
                  {selectValue.years.map((year, idx) => (
                    <option key={idx} value={year} style={{
                      backgroundColor: 'white',
                      color: 'black'
                    }}>
                      {year}
                    </option>
                  ))}
                </TextField>
                <img src={downIcon} className={styles.selectIcon} />
              </div>
            </div>
            <div className={`${styles.errorMessage} ${values.dob.error ? styles.visible : ''}`}>
              <img src={warningIcon} className={styles.errorIcon} />
              <p>{values.dob.nameError}</p>
            </div>
          </div>
          <hr className={styles.sectionDivider} />
          {/* Email */}
          <div className={values.email.error ? 'shake' : ''}>
            <TextField
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleError('email', values.email.value, 'Email')}
              id="filledEmail"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {values.email.error && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                  {values.email.error ? values.email.nameError : 'Email'}
                </span>}
              variant="filled"
              InputProps={{
                disableUnderline: true
              }}
              sx={{
                flex: 1,
                backgroundColor: 'white',
                width: '100%',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  border: values.email.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                  '&.Mui-focused': {
                    border: values.email.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                    borderRadius: '16px',
                    backgroundColor: 'white'
                  },
                  '& input:-webkit-autofill': {
                    borderRadius: '16px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: values.email.error ? 'rgb(184, 53, 53)' : '#666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: values.email.error ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                }
              }}
            />
          </div>
          {/* Phone */}
          <div className={values.phone.error ? 'shake' : ''}>
            <TextField
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleError('phone', values.phone.value, 'Phone Number')}
              id="filledPhone"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {values.phone.error && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                  {values.phone.error ? values.phone.nameError : 'Phone Number'}
                </span>}
              variant="filled"
              InputProps={{
                disableUnderline: true
              }}
              sx={{
                flex: 1,
                backgroundColor: 'white',
                width: '100%',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  border: values.phone.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                  '&.Mui-focused': {
                    border: values.phone.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                    borderRadius: '16px',
                    backgroundColor: 'white'
                  },
                  '& input:-webkit-autofill': {
                    borderRadius: '16px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: values.phone.error ? 'rgb(184, 53, 53)' : '#666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: values.phone.error ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                }
              }}
            />
          </div>
          <hr className={styles.sectionDivider} />
          {/* Password */}
          <div>
            <TextField
              onChange={(e) => handleFieldChange('password', e.target.value)}
              // onBlur={() => handleError('password', values.password.value, 'Password')}
              id="filledPassword"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {values.password.error && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                  {values.password.error ? values.password.nameError : 'Password'}
                </span>}
              variant="filled"
              InputProps={{
                disableUnderline: true
              }}
              type='password'
              sx={{
                flex: 1,
                backgroundColor: 'white',
                width: '100%',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  border: values.password.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                  '&.Mui-focused': {
                    border: values.password.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                    borderRadius: '16px',
                    backgroundColor: 'white'
                  },
                  '& input:-webkit-autofill': {
                    borderRadius: '16px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: values.password.error ? 'rgb(184, 53, 53)' : '#666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: values.password.error ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                }
              }}
            />
          </div>
          {/* Confirm Password */}
          <div>
            <TextField
              onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
              onBlur={() => handleError('confirmPassword', values.confirmPassword.value, 'Confirm Password')}
              id="filledConfirmPassword"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {values.confirmPassword.error && <img src={warningIcon} style={{ width: '16px', height: '16px' }} />}
                  {values.confirmPassword.error ? values.confirmPassword.nameError : 'Confirm Password'}
                </span>}
              variant="filled"
              InputProps={{
                disableUnderline: true
              }}
              type='password'
              sx={{
                flex: 1,
                backgroundColor: 'white',
                width: '100%',
                '& .MuiFilledInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  border: values.confirmPassword.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgb(170, 170, 170)',
                  '&.Mui-focused': {
                    border: values.confirmPassword.error ? '2px solid rgb(184, 53, 53)' : '2px solid rgba(0, 0, 0, 0.65)',
                    borderRadius: '16px',
                    backgroundColor: 'white'
                  },
                  '& input:-webkit-autofill': {
                    borderRadius: '16px'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: values.confirmPassword.error ? 'rgb(184, 53, 53)' : '#666'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: values.confirmPassword.error ? 'rgb(184, 53, 53)' : 'rgba(0,0,0,.85)'
                }
              }}
            />
          </div>
          {/* Submit */}
          <div
            onClick={() => !formError && handleSubmit()}
            className={`${styles.submitButton} ${!formError ? styles.active : styles.disabled}`}
          >
            {isSubmit === 'idle' && (<p className='fade-in-up'>Sign up</p>)}
            {isSubmit === 'loading' && (<div className='spinner-white'></div>)}
            {isSubmit === 'success' && (<img className='boom-small' src={checkIcon} alt="success" />)}
            {isSubmit === 'failed' && (<img className='fade-in' src={errorIcon} alt="error" />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
