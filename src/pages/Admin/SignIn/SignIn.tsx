import Typography from '@mui/material/Typography'
import nextButton from '~/assets/next.png'
import { useEffect, useRef, useState } from 'react'
import Link from '@mui/material/Link'
import { useNavigate } from 'react-router-dom'
import warningIcon from '~/assets/danger.png'
import checkIcon from '~/assets/check.png'
import dangerIcon from '~/assets/danger.png'
import dingSound from '~/assets/ding-sound.mp3'
import styles from './SignIn.module.scss'
import '~/App.scss'
import { signInAdminAPI } from '~/apis/adminAPI/authAPI'

export default function SignInAdmin() {

  const [user, setUser] = useState(true)

  const [inputValue, setInputValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [isValid, setIsValid] = useState('')
  const [submitStatus, setSubmitStatus] = useState('idle')
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)

  const tickSound = new Audio(dingSound)

  const handleSubmit = async () => {
    setSubmitStatus('loading')
    const user = {
      username: inputValue,
      password: passwordValue
    }
    await signInAdminAPI(user.username, user.password)
      .then(async (data) => {
        console.log(data)
        // Lưu JWT token và refresh token
        localStorage.setItem('accessTokenAdmin', data.accessTokenAdmin)

        tickSound.volume = 0.4
        tickSound.play()
        setTimeout(() => {
          setSubmitStatus('success')
        }, 400)
        setTimeout(() => {
          navigate('/admin')
        }, 900)
      })
      .catch(error => {
        setSubmitStatus('failed')
        setIsValid(error.response?.data?.message || 'Login failed')
      })
  }

  setTimeout(() => {
    setUser(false)
  }, 700)

  useEffect(() => {
    if (showPassword && passwordRef.current) {
      passwordRef.current.focus(); // khi hiện thì focus
    }
  }, [showPassword])

  return (
    <div className={styles.signin_container}>
      <div className={styles.main_content}>
        {/* Title */}
        <h1 className={styles.title}>
          Sign in for ADMIN.
        </h1>

        {/* Content */}
        <div className={`fade-in-up ${styles.content_wrapper}`}>
          <div className={styles.form_container}>
            <h2 className={styles.form_title}>
              Sign in
            </h2>

            {/* UserName */}
            <div className={styles.input_group}>
              <div className={styles.inputWrapper}>
                <input
                  autoFocus
                  type="text"
                  value={inputValue}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' && inputValue) setShowPassword(true)
                  }}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setPasswordValue('')
                    setShowPassword(false)
                    setIsValid('')
                  }}
                  placeholder="Email or Phone Number"
                  className={styles.inputField}
                />
                {!showPassword && (
                  <div
                    onClick={() => inputValue && setShowPassword(true)}
                    className={`${styles.next_button} ${inputValue ? styles.active : styles.inactive}`}
                  >
                    <img src={nextButton} alt="next" />
                  </div>
                )}
              </div>

              {/* Password  */}
              {showPassword && (
                <div className={`slide-from-left ${styles.password_wrapper}`}>
                  <input
                    ref={passwordRef}
                    value={passwordValue}
                    onKeyUp={(e) => {
                      e.key === 'Enter' && (passwordValue && handleSubmit())
                    }}
                    onChange={(e) => {
                      showPassword ? setPasswordValue(e.target.value) : setPasswordValue('')
                      setIsValid('')
                      setSubmitStatus('idle')
                    }}
                    id="fieldPassword"
                    type='password'
                    placeholder="Password"
                    className={styles.inputField}
                  />
                  <div
                    onClick={() => (passwordValue && !isValid) && handleSubmit()}
                    className={`${styles.submit_button} ${passwordValue ? styles.active : styles.inactive}`}
                  >
                    {submitStatus === 'idle' ? (
                      <img src={nextButton} alt="submit" />
                    ) : submitStatus === 'loading' ? (
                      <div className='spinner-black'></div>
                    ) : submitStatus === 'success' ? (
                      <div className={styles.status_icon}>
                        <img src={checkIcon} alt="success" />
                      </div>
                    ) : submitStatus === 'failed' ? (
                      <div className={styles.status_icon}>
                        <img src={dangerIcon} alt="error" />
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Error */}
              <div className={`${styles.error_message} ${isValid ? 'shake' : styles.hidden}`}>
                <img src={warningIcon} alt="warning" />
                <Typography>{isValid}</Typography>
              </div>
            </div>

            {/* Forgot password */}
            <div className={styles.forgot_password}>
              <Link href="#" underline='none' >Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}