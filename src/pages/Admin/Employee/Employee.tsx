/* eslint-disable react-hooks/exhaustive-deps */
import { deleteEmployeeAPI, fetchGetAllEmployeePageAPI, updateEmployeeRoleAPI } from '~/apis/adminAPI/employeeAPI'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '~/components/Button/Button'
import searchIcon from '~/assets/search.png'
import avatarClient from '~/assets/avatar-manager.png'
import editIcon from '~/assets/info.png'
import ModalWarning from '~/components/ModalWarning/ModalWarning'
import trashIcon from '~/assets/trash.png'
import leftIcon from '~/assets/left.png'
import rightIcon from '~/assets/right.png'
import updateIcon from '~/assets/v-white.png'
import cancelIcon from '~/assets/x.png'
import { jwtDecode } from 'jwt-decode'
import styles from './Employee.module.scss'
import '~/App.scss'
import { Employee as EmployeeInterface } from '~/interface/employee.interface'
import AddEmployee from './AddEmployee/AddEmployee'
import EmployeeDetail from './EmployeeDetail/EmployeeDetail'

const roleList = ['manager', 'admin', 'staff']

function Employee() {

  const token = localStorage.getItem('accessTokenAdmin')
  const employeeRole = token ? jwtDecode(token) as ({ role: string }) : null

  const [searchParams, setSearchParams] = useSearchParams()
  const [employeeList, setEmployeeList] = useState<EmployeeInterface[]>([])

  const [totalPages, setTotalPages] = useState(0)
  const currentPage = parseInt(searchParams.get('page') || '1') || 1

  // Handle loading
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)

  const [searchValue, setSearchValue] = useState('')
  // const [showWarning, setShowWarning] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)
  const [employeeDetail, setEmployeeDetail] = useState<string | null>(null)
  const [isAddEmployee, setIsAddEmployee] = useState<boolean>(false)

  const [roleSelected, setRoleSelected] = useState<{ role: string, idx: number, oldRole: string | null }>({
    role: '',
    idx: -1,
    oldRole: null
  })

  const filters = ['newest', 'oldest', 'A-Z', 'Z-A']
  const [filterSelected, setFilterSelected] = useState(-1)

  useEffect(() => {
  }, [employeeList])

  const fetchEmployee = async () => {
    const allParams = Object.fromEntries(searchParams.entries())
    // eslint-disable-next-line no-unused-vars
    const { page, section, ...filters } = allParams
    await fetchGetAllEmployeePageAPI(currentPage, 12, filters).then(data => {
      setEmployeeList(data.employees)
      setTotalPages(data.total / 12)
      console.log(data)
      setIsLoadingEmployees(false)
    })
  }

  // Hàm handle khi next trang
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = (currentPage + 1).toString()
      setSearchParams(currentParams, { replace: false })
    }
  }

  // Hàm handle khi prev trang
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const currentParams = Object.fromEntries(searchParams.entries())
      currentParams.page = (currentPage - 1).toString()
      setSearchParams(currentParams, { replace: false })
    }
  }

  const handleFilter = () => {
    const currentParams = Object.fromEntries(searchParams.entries())
    if (filterSelected + 1 > filters.length - 1) {
      delete currentParams.sort
      setSearchParams(currentParams, { replace: false })
      setFilterSelected(-1)
      return
    }
    currentParams.sort = filters[filterSelected + 1]
    setSearchParams(currentParams, { replace: false })
    setFilterSelected(filterSelected + 1)
  }

  const handleSearch = (data: string) => {
    const currentParams = Object.fromEntries(searchParams.entries())
    if (currentParams.search === data.trim()) return
    if (data.trim() === '') delete currentParams.search
    else currentParams.search = data
    setSearchParams(currentParams, { replace: false })
  }

  const handleDelete = async () => {
    if (employeeToDelete) {
      await deleteEmployeeAPI(employeeToDelete)
    }
  }

  const handleChangeRole = (role: string, idx: number) => {
    // Nếu đang chọn employee khác thì reset
    if (roleSelected.idx !== idx) {
      const index = roleList.indexOf(role)
      const newRole = index + 1 >= roleList.length ? roleList[0] : roleList[index + 1]

      setRoleSelected({
        role: newRole,
        idx,
        oldRole: role
      })
      return
    }

    const index = roleList.indexOf(roleSelected.role)
    const newRole = index + 1 >= roleList.length ? roleList[0] : roleList[index + 1]

    setRoleSelected(prev => ({
      ...prev,
      role: newRole
    }))
  }

  const updateRole = async (employeeId: string, newRole: string) => {

    await updateEmployeeRoleAPI(employeeId, newRole)

    setRoleSelected({ role: '', idx: -1, oldRole: null })

    fetchEmployee()
  }

  const cancelChangeRole = () => {
    setRoleSelected({ role: '', idx: -1, oldRole: null })
  }


  useEffect(() => {
    if (!employeeToDelete) {
      setIsLoadingEmployees(true)
      fetchEmployee()
    }
    fetchEmployee()
  }, [searchParams, employeeToDelete])

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <input
            className={`slide-from-right ${styles.searchInput}`}
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={e => {
              // handleSearch(e.target.value)
              setSearchValue(e.target.value)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch(searchValue)
              }
            }}
            autoFocus
          />
          <div
            className={styles.searchButton}
            onClick={() => handleSearch(searchValue)}
          >
            <img src={searchIcon} alt="search" />
          </div>
        </div>
        <Button onClick={() => setIsAddEmployee(true)} className='boom-small' flex={2} height='100%' bgcolor='#000' content='Add' fontSize='18px' borderRadius='12px' color='#fff' />
        {/* Filter */}
        <Button onClick={() => handleFilter()} className='boom-small' flex={2} height='100%' bgcolor='#ccc' content={
          searchParams.get('sort') ? (searchParams.get('sort')!.slice(0, 1).toUpperCase() + searchParams.get('sort')!.slice(1)) : 'Filter'
        } fontSize='18px' borderRadius='12px' color='#000' />
      </div>
      {/* Content */}
      <div>
        {isLoadingEmployees ? (
          <div className={styles.spinnerContainer}>
            <div className='spinner-large'></div>
          </div>
        ) : (
          <div className={styles.content}>
            {employeeList.length > 0 && (
              <div className={styles.employeeList}>
                {employeeList?.map((employee, idx) => (
                  <div key={idx} className={styles.employeeRow}>
                    <div className={`${styles.employeeCard} fade-in-up`}>
                      {/* Avatar and quatity */}
                      <div className={styles.avatar}>
                        <img src={avatarClient} alt="Avatar" />
                      </div>
                      {/* Information */}
                      <div className={styles.information}>
                        {/* Customer */}
                        <p className={styles.customerTitle}>
                          Employee #{employee.phone}
                        </p>
                        {/* Name */}
                        <p className={styles.infoText}>
                          {'Name: '}
                          <span className={styles.infoSpan}>
                            {`${employee.lastName} ${employee.firstName}`}
                          </span>
                        </p>
                        {/* Phone */}
                        <p className={styles.infoText}>
                          {'Email: '}
                          <span className={styles.infoEmail}>
                            {employee.email}
                          </span>
                        </p>
                        {/* Address */}
                        <p className={styles.infoText}>
                          {'Address: '}
                          <span className={styles.infoSpan}>
                            {employee.address}
                          </span>
                        </p>
                      </div>
                      {/* Active and Time */}
                      <div className={styles.statusSection}>
                        <div
                          className={styles.statusWrapper}
                          onClick={() => handleChangeRole(employee.role, idx)}
                        >
                          {roleSelected.idx === idx && (
                            <>
                              <div
                                className={styles.updateRoleIconWrapper}
                                onClick={(e) => {
                                  e.stopPropagation()   // Không cho click lan lên trên
                                  updateRole(employee._id, roleSelected.role)
                                }}
                              >
                                <img src={updateIcon} alt="Update Role" />
                              </div>

                              <div
                                className={styles.cancelRoleIconWrapper}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  cancelChangeRole()
                                }}
                              >
                                <img src={cancelIcon} alt="Cancel Role Change" />
                              </div>
                            </>
                          )}

                          <p className={styles.role}>
                            {roleSelected.idx === idx ?
                              roleSelected.role.slice(0, 1).toUpperCase() + roleSelected.role.slice(1)
                              :
                              employee.role.slice(0, 1).toUpperCase() + employee.role.slice(1)
                            }
                          </p>
                        </div>

                        {/* Time */}
                        <p className={styles.timestamp}>
                          {new Date(employee.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {/* Info and delete */}
                    < div className={styles.actions} >
                      <img
                        onClick={() => setEmployeeDetail(employee._id)}
                        src={editIcon}
                        className={styles.actionIcon}
                        alt="Edit"
                      />
                      {employeeRole?.role === 'manager' && (
                        <img
                          onClick={() => {
                            setEmployeeToDelete(employee._id)
                          }}
                          src={trashIcon}
                          className={styles.actionIcon}
                          alt="Delete"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Button next and prev page */}
            <div className={styles.pagination}>
              {currentPage === 1 || totalPages < 1 ?
                (<div className={styles.paginationSpacer}></div>)
                :
                (<div className={styles.paginationButton} onClick={handlePrevPage}>
                  <img src={leftIcon} alt="Previous" />
                </div>)
              }

              <p className={styles.pageNumber}>{currentPage}</p>
              {currentPage === totalPages || totalPages < 1 ?
                (<div className={styles.paginationSpacer}></div>)
                :
                (<div className={styles.paginationButton} onClick={handleNextPage}>
                  <img src={rightIcon} alt="Next" />
                </div>)
              }
            </div>
          </div>
        )
        }
      </div >
      <ModalWarning open={Boolean(employeeToDelete)} onClose={() => setEmployeeToDelete(null)} cancel={() => setEmployeeToDelete(null)} handleDelete={() => {
        handleDelete()
        setEmployeeToDelete(null)
      }} />
      {isAddEmployee && (
        <AddEmployee open={isAddEmployee} onClose={() => setIsAddEmployee(false)} refresh={() => {
          setIsAddEmployee(false)
          fetchEmployee()
        }} />
      )}
      {
        Boolean(employeeDetail) && (
          <EmployeeDetail open={Boolean(employeeDetail)} onClose={() => setEmployeeDetail(null)} employeeId={employeeDetail || ''} employeeRole={employeeRole?.role || ''} />
        )
      }
    </div >
  )
}

export default Employee
