import TextField from '@mui/material/TextField'
import { useEffect, useRef, useState } from 'react'
import closeIcon from '~/assets/x-white.png'
import logoIcon from '~/assets/logo-white2.png'
import sendIcon from '~/assets/send.png'
import sendFillIcon from '~/assets/send-fill.png'
import styles from './Chatbot.module.scss'
import '~/App.scss'
import { chatbot } from '~/apis'

function Chatbot() {
  const [isExpand, setIsExpand] = useState(false)
  const [isHoverSend, setIsHoverSend] = useState(false)
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState(() => {
    const oldConversation = sessionStorage.getItem('conversation')
    return oldConversation ? JSON.parse(oldConversation) : []
  })
  const [showConversation, setShowConversation] = useState(false)

  const bottomRef = useRef(null)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = { text: input, time: new Date(), sender: 'me' }
    const updatedConversation = [...conversation, userMessage]
    setConversation(updatedConversation)
    setInput('')
    try {
      const res = await chatbot(input, conversation)
      const botMessage = { text: res.reply, time: new Date(), sender: 'chatbot' }
      setConversation(prev => [...prev, botMessage])
    } catch (error) {
      const errorMsg = { text: 'Lỗi khi kết nối chatbot.', time: new Date(), sender: 'chatbot' }
      setConversation(prev => [...prev, errorMsg])
    }
  }

  useEffect(() => {
    const text = 'Chatbot để kiểm tra sản phẩm đang có sẵn tại cửa hàng. Cú pháp cần bao gồm hãng, tên, màu sắc, kích thước'
    if (isExpand && !conversation.length) {
      setTimeout(() => {
        setConversation([{ text: text, time: new Date(), sender: 'chatbot' }])
      }, 300)
    }

    if (bottomRef.current) {
      // console.log('chay', bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    // console.log(conversation)
  }, [conversation, isExpand])

  useEffect(() => {
    sessionStorage.setItem('conversation', JSON.stringify(conversation))
  }, [conversation])

  useEffect(() => {
    setTimeout(() => {
      setShowConversation(isExpand)
    }, 400)
  }, [isExpand])

  return (
    <div
      onClick={() => setIsExpand(true)}
      className={`${styles.container} ${isExpand ? styles.containerExpanded : styles.containerCollapsed}`}
    >
      <div className={`${styles.innerContainer} ${isExpand ? styles.innerContainerExpanded : styles.innerContainerCollapsed}`}>
        <p className={`${styles.title} ${isExpand ? (showConversation ? styles.titleVisible : styles.titleHidden) : styles.titleHidden}`}>Chatbot</p>

        {/* Toggle Button */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            setIsExpand(prev => !prev)
          }}
          className={`${styles.toggleButton} ${isExpand ? styles.toggleButtonExpanded : styles.toggleButtonCollapsed}`}
        >
          <img
            className={`fade-in ${styles.toggleIcon} ${isExpand ? styles.toggleIconExpanded : styles.toggleIconCollapsed}`}
            src={isExpand ? closeIcon : logoIcon}
            alt="Toggle"
          />
        </div>

        {/* Chat Box */}
        {isExpand && (
          <div className={`${styles.chatBox} fade-in`}>
            {/* Conversation */}
            <div className={`${styles.conversationContainer} ${showConversation ? styles.conversationVisible : styles.conversationHidden}`}>
              {conversation.map((message, idx) => (
                <div key={idx} className={`${styles.messageWrapper} fade-in-up`}>
                  <p className={`${styles.messageBubble} ${message.sender === 'me' ? styles.messageBubbleMe : styles.messageBubbleBot}`}>
                    {message.text}
                  </p>
                  <p className={`${styles.messageTime} ${message.sender === 'me' ? styles.messageTimeMe : styles.messageTimeBot}`}>
                    {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className={`${styles.inputContainer} ${showConversation ? styles.inputContainerVisible : styles.inputContainerHidden}`}>
              <TextField
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                value={input}
                multiline
                maxRows={3}
                autoComplete='off'
                spellCheck={false}
                variant='outlined'
                className={styles.textField}
              />
              <div
                className={`boom-small ${styles.sendButton} ${input.length >= 1 ? '' : styles.sendButtonHidden}`}
                onMouseEnter={() => setIsHoverSend(true)}
                onMouseLeave={() => setIsHoverSend(false)}
                onClick={handleSend}
              >
                <img
                  src={isHoverSend ? sendFillIcon : sendIcon}
                  className={styles.sendIcon}
                  alt="Send"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatbot
