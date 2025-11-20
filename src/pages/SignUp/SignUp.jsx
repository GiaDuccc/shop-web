import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Header from '~/components/Header/Header'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import '~/App.scss'
import Link from '@mui/material/Link'
import downIcon from '~/assets/down.png'
import { selectValue } from './selectValue'
import { fetchCreateCustomerAPI } from '~/apis/authApi'
import { useNavigate } from 'react-router-dom'
import warningIcon from '~/assets/danger.png'
import dingSound from '~/assets/ding-sound.mp3'
import checkIcon from '~/assets/check.png'
import errorIcon from '~/assets/error.png'


function SignUp() {

  const [isSubmit, setIsSubmit] = useState('idle')

  const navigate = useNavigate()

  const [formError, setFormError] = useState(true)
  const tickSound = new Audio(dingSound)

  const [values, setValues] = useState({
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

  const handleFieldChange = (fieldName, newValue) => {
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
          ...prev[fieldName],
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

  const handleError = (fieldName, value, lable = '') => {

    if (fieldName === 'dob') {
      // const [, key] = fieldName.split('.')
      if (value.trim() === '') {
        setValues(prev => ({
          ...prev,
          dob: {
            ...prev.dob,
            nameError: 'Enter valid date of birth.',
            error: true
          }
        }))
      }
    } else if (value.trim() === '') {
      setValues(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          error: true,
          nameError: !values[fieldName].error ? `Enter your ${lable}` : values[fieldName].nameError
        }
      }))
    } else if (fieldName === 'email') {
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
    } else if (fieldName === 'phone') {
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
    } else if (fieldName === 'password' || fieldName === 'confirmPassword') {
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
        .catch(errors => {
          setIsSubmit('failed')
          Object.entries(errors).forEach(([key, field]) => {
            setValues(prev => ({
              ...prev,
              [key]: {
                ...prev[key],
                error: true,
                nameError: field
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
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        bgcolor: 'white',
        width: '100%',
        height: '1000px'
      }}
    >
      <Header />
      <Box className='fade-in-up'>
        {/* Title */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: '16px auto 0', width: '70%' }}>
          <Typography sx={{ color: 'rgba(0,0,0,.85)', fontWeight: '600', fontSize: '24px' }}>Dynamic Hype Club Account</Typography>
          <Box sx={{
            display: 'flex',
            gap: 4,
            '& a': {
              color: 'rgb(105, 105, 105)',
              textDecoration: 'none'
            },
            '& a:hover': {
              color: 'rgb(105, 105, 105)',
              textDecoration: 'underline'
            }
          }}>
            <Link href="/sign-in">Sign In</Link>
            <Link href="#" sx={{
              opacity: '0.5',
              cursor: 'not-allowed',
              '&:hover': {
                textDecoration: 'none !important'
              }
            }}>Sign Up</Link>
            <Link href="#">FAQ</Link>
          </Box>
        </Box>
        <hr style={{
          width: '70%',
          border: 'none',
          borderTop: '1px solid #ccc',
          margin: '4px auto'
        }} />
        {/* Content */}
        <Box className={values.formError ? 'shake' : ''} sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '35%',
          mx: 'auto',
          textAlign: 'center',
          gap: 2,
          mt: '48px'
        }}>
          <Box>
            <Typography sx={{
              color: 'rgb(78, 78, 78)',
              fontSize: '32px',
              fontWeight: '600'
            }}>
              Create Your Account
            </Typography>
            <Typography sx={{
              color: 'rgb(78, 78, 78)',
              fontSize: '18px',
              // fontWeight: '500',
              pb: '8px'
            }}>
              One Account is all you need to access all My services.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Typography sx={{
                color: 'rgb(78, 78, 78)',
                fontSize: '18px'
              }}>
                Already have an Account?
              </Typography>
              <Box sx={{
                color: '#06c',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.4,
                '& a': {
                  color: '#06c',
                  fontSize: '18px'
                },
                '& a:hover': {
                  textDecoration: 'underline'
                }
              }}>
                <Link href="/sign-in" underline='none' >Sign In</Link>
                {/* <CallMadeOutlinedIcon sx={{ fontSize: '16px' }} /> */}
              </Box>
            </Box>
          </Box>

          {/* LastName & FirstName */}
          <Box sx={{ display: 'flex', gap: 2 }}>
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
            {/* </Box> */}
          </Box>
          {/* Country */}
          <Box className={values.country.error ? 'shake' : ''} sx={{ position: 'relative' }}>
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
            <img src={downIcon} style={{
              position: 'absolute',
              top: '50%',
              right: '15px',
              pointerEvents: 'none',
              transform: 'translateY(-50%)',
              width: '12px', height: '12px',
              opacity: .5
            }} />
          </Box>
          {/* Date */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
            <Box>
              <Typography sx={{ fontSize: '16px', fontWeight: '600', color: 'rgb(78, 78, 78)' }}>Date of Birth</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                width: '100%'
              }}>
              {/* Day */}
              <Box className={values.dob.error ? 'shake' : ''} sx={{ position: 'relative', width: '100%' }}>
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
                <img src={downIcon} style={{
                  position: 'absolute',
                  top: '50%',
                  right: '15px',
                  pointerEvents: 'none',
                  transform: 'translateY(-50%)',
                  width: '12px', height: '12px',
                  opacity: .5
                }} />
              </Box>
              {/* Month */}
              <Box className={values.dob.error ? 'shake' : ''} sx={{ position: 'relative', width: '100%' }}>
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
                <img src={downIcon} style={{
                  position: 'absolute',
                  top: '50%',
                  right: '15px',
                  pointerEvents: 'none',
                  transform: 'translateY(-50%)',
                  width: '12px', height: '12px',
                  opacity: .5
                }} />
              </Box>
              {/* Year */}
              <Box className={values.dob.error ? 'shake' : ''} sx={{ position: 'relative', width: '100%' }}>
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
                <img src={downIcon} style={{
                  position: 'absolute',
                  top: '50%',
                  right: '15px',
                  pointerEvents: 'none',
                  transform: 'translateY(-50%)',
                  width: '12px', height: '12px',
                  opacity: .5
                }} />
              </Box>
            </Box>
            <Box sx={{
              display: values.dob.error ? 'flex' : 'none',
              alignItems: 'center',
              gap: 0.5,
              color: 'rgb(184, 53, 53)'
            }}>
              <img src={warningIcon} style={{ width: '18px', height: '18px' }} />
              <Typography>{values.dob.nameError}</Typography>
            </Box>
          </Box>
          <hr style={{
            border: 'none',
            borderTop: '1px solid #ccc',
            margin: '1px 0 12px'
          }} />
          {/* Email */}
          <Box className={values.email.error ? 'shake' : ''}>
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
          </Box>
          {/* Phone */}
          <Box className={values.phone.error ? 'shake' : ''}>
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
          </Box>
          <hr style={{
            border: 'none',
            borderTop: '1px solid #ccc',
            margin: '12px 0'
          }} />
          {/* Password */}
          <Box>
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
          </Box>
          {/* Confirm Password */}
          <Box>
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
          </Box>
          {/* Submit */}
          <Box
            onClick={() => !formError && handleSubmit()}
            sx={{
              bgcolor: 'rgba(0,0,0,.85)',
              width: '100%',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)',
              opacity: !formError ? '1' : '0.6',
              height: '50px',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              '&:hover': {
                transform: !formError ? 'scale(1.02)' : 'none',
                transformOrigin: 'center',
                cursor: !formError ? 'pointer' : 'not-allowed'
              }
            }} >
            {isSubmit === 'idle' && (<Typography className='fade-in-up' sx={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>Sign up</Typography>)}
            {isSubmit === 'loading' && (<Box className='spinner-white'></Box>)}
            {isSubmit === 'success' && (<img className='boom-small' src={checkIcon} style={{ width: '30px' }} />)}
            {isSubmit === 'failed' && (<img className='fade-in' src={errorIcon} style={{ width: '30px' }} />)}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default SignUp
