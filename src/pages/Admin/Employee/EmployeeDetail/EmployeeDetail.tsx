import Modal from '@mui/material/Modal'
import { useEffect, useState } from 'react'
import '~/App.scss'
import closeIcon from '~/assets/x-white.png'
import styles from './EmployeeDetail.module.scss'
import { fetchEmployeeDetailAPI } from '~/apis/adminAPI/employeeAPI'
import { Employee } from '~/interface/employee.interface'

interface EmployeeDetailProps {
  employeeId: string
  open: boolean
  onClose: () => void
  employeeRole: string
}

export default function EmployeeDetail({ employeeId, open, onClose, employeeRole }: EmployeeDetailProps) {

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false)

  const fetchEmployee = async () => {
    setIsLoadingEmployee(true)
    const employee = await fetchEmployeeDetailAPI(employeeId)
    setEmployee(employee)

    setIsLoadingEmployee(false)
  }

  useEffect(() => {
    fetchEmployee()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      open={open}
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div className={`${styles.modalBackdrop}`}>
        <div
          className={`${styles.modalContent} fade-in-up`}
          onClick={(e) => e.stopPropagation()}
        >
          {isLoadingEmployee ? (
            <div className={styles.spinnerContainer}>
              <div className='spinner-large'></div>
            </div>
          ) : (
            <div className={styles.contentWrapper}>
              {/* Close Button */}
              <div className={styles.closeButtonWrapper}>
                <div className={styles.closeButton} onClick={onClose}>
                  <img src={closeIcon} alt="Close" />
                </div>
              </div>
              <p className={styles.title}>
                {`Employee #${employee?.phone}`}
              </p>
              {/* Employee info */}
              <div className={styles.customerInfo}>
                {/* Name */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Name:</p>
                  <p className={styles.infoValue}>{employee?.lastName + ' ' + employee?.firstName}</p>
                </div>
                {/* Dob */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Date of birth:</p>
                  <p className={styles.infoValue}>{employee?.dob ? new Date(employee.dob).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
                {/* Email */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Email:</p>
                  <p className={styles.infoValue}>{employee?.email}</p>
                </div>
                {/* Phone */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Phone:</p>
                  <p className={styles.infoValue}>{employee?.phone}</p>
                </div>
                {/* Address */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Address:</p>
                  <p className={styles.infoValue}>{employee?.address}</p>
                </div>
                {/* Role */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Role:</p>
                  <p className={styles.infoValue}>{employee?.role}</p>
                </div>
                {/* Salary */}
                {employeeRole === 'manager' && (
                  <div className={styles.infoRow}>
                    <p className={styles.infoLabel}>Salary:</p>
                    <p className={styles.infoValue}>{employee?.salary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </div>
                )}
                {/* Join Date */}
                <div className={styles.infoRow}>
                  <p className={styles.infoLabel}>Join Date:</p>
                  <p className={styles.infoValue}>{employee?.createdAt ? new Date(employee.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
