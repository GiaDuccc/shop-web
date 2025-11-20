import Modal from '@mui/material/Modal'
import Button from '~/components/Button/Button'
import styles from './ModalWarning.module.scss'

interface ModalWarningProps {
  open: boolean
  onClose: () => void
  cancel: () => void
  handleDelete: () => void
}

function ModalWarning({ open, onClose, cancel, handleDelete }: ModalWarningProps) {
  return (
    <Modal
      className={styles.modal}
      open={open}
      onClick={onClose}
    >
      <div className={styles.modal_backdrop}>
        <div
          className={`${styles.modal_content} fade-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <p className={styles.modal_title}>Do you really want to delete this ?</p>
          {/* Button */}
          <div className={styles.modal_actions}>
            <Button content='Cancel' width='110px' height='35px' borderRadius='16px' bgcolor='#ccc' fontSize='18px' onClick={cancel} />
            <Button content='Delete' width='110px' height='35px' borderRadius='16px' bgcolor='#ff3737' fontSize='18px' color='#fff' onClick={handleDelete}/>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalWarning
