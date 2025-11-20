import styles from './Button.module.scss'

interface ButtonProps {
  onClick?: () => void
  className?: string
  width?: string | number
  flex?: string | number
  height?: string | number
  bgcolor?: string
  fontSize?: string | number
  content: string
  borderRadius?: string | number
  color?: string
}

function Button({ onClick, className, width, flex, height, bgcolor, fontSize, content, borderRadius, color }: ButtonProps) {
  return (
    <div
      className={`${styles.button} ${className || ''}`}
      onClick={onClick}
      style={{
        width: width,
        flex: flex,
        backgroundColor: bgcolor,
        height: height,
        borderRadius: borderRadius
      }}>
      <p style={{
        color: color,
        fontSize: fontSize
      }}>{content}</p>
    </div>
  )
}

export default Button
