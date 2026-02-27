import Modal from '@mui/material/Modal'
import closeIcon from '~/assets/x-white.png'
import '~/App.scss'
import styles from './AddEmployee.module.scss'
import successIcon from '~/assets/check.png'
import { useState } from 'react'
import { addEmployeeAPI } from '~/apis/adminAPI/employeeAPI'
import { toast } from 'react-toastify'

interface AddEmployeeProps {
  open: boolean
  onClose: () => void
  refresh: () => void
}

const field = [
  { label: 'First Name', type: 'text', name: 'firstName' },
  { label: 'Last Name', type: 'text', name: 'lastName' },
  { label: 'Date of birth', type: 'text', name: 'dob' },
  { label: 'Email', type: 'email', name: 'email' },
  { label: 'Phone', type: 'text', name: 'phone' },
  { label: 'Address', type: 'text', name: 'address' },
  { label: 'Role', type: 'text', name: 'role' },
  { label: 'Salary', type: 'number', name: 'salary' },
]

export default function AddEmployee({ open, onClose, refresh }: AddEmployeeProps) {

  const [isLoadingAdd, setIsLoadingAdd] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleAddEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoadingAdd('loading')
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries());
    console.log(data)
    await addEmployeeAPI(data)
      .then(() => {
        setIsLoadingAdd('success')
        setTimeout(() => {
          refresh()
        }, 500)
      })
      .catch((error) => {
        setIsLoadingAdd('idle')
        toast.error(error.response?.data?.message)
      })
  }

  return (
    <Modal
      className="Modal "
      open={open}
      sx={{
        overflowY: 'scroll',
        transition: 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
    >
      <div className={styles.modalBackdrop}>
        <div
          className={`fade-in-up ${styles.modalContent}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div
            className={styles.closeButton}
            onClick={onClose}
          >
            <img src={closeIcon} className={styles.closeIcon} />
          </div>
          {/* Content */}
          <div className={styles.content}>
            <p className={styles.title}>ADD EMPLOYEE</p>
            {/* Form */}
            <form onSubmit={(e) => handleAddEmployee(e)} className={styles.form}>
              {field.map((item, index) => (
                <div className={styles.formGroup} key={index}>
                  <div className={styles.formItem}>
                    <label className={styles.label}>{item.label}:</label>
                    {item.name === 'role' ? (
                      <select name={item.name} className={styles.select}>
                        <option value="" disabled>Select Role</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    ) : (
                      <input type={item.type} name={item.name} className={styles.input} placeholder={`Enter ${item.label}`} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // ⛔ chặn submit khi nhấn Enter
                        }
                      }} />
                    )}
                  </div>
                </div>
              ))}
              {/* Button */}
              <button
                className={`${styles.submitButton}`}
                type="submit"
              >
                {isLoadingAdd === 'idle' && (<p>Add</p>)}
                {isLoadingAdd === 'loading' && (
                  <span className='spinner-white' style={{ width: '28px', height: '28px' }}></span>
                )}
                {isLoadingAdd === 'success' && (
                  <span className='boom' style={{ display: 'flex', alignItems: 'center' }} >
                    <img src={successIcon} className={styles.statusIcon} />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Modal >
  )
}
