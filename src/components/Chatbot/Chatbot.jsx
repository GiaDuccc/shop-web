import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useEffect, useRef, useState } from 'react'
import closeIcon from '~/assets/x-white.png'
import logoIcon from '~/assets/logo-white2.png'
import sendIcon from '~/assets/send.png'
import sendFillIcon from '~/assets/send-fill.png'
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
    const text = 'Đây chỉ là bản thử nghiệm. Dùng để kiểm tra sản phẩm đang có ở store. Cú pháp cần bao gồm hãng, tên, màu sắc, kích thước'
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
    <Box
      onClick={() => setIsExpand(true)}
      sx={{
        position: 'fixed',
        bottom: 0, right: 0,
        m: '0 24px 12px 0',
        width: isExpand ? '400px' : '65px',
        height: isExpand ? '500px' : '65px',
        bgcolor: '#fff',
        transition: 'all 0.35s cubic-bezier(0.6, 0, 0.6, 1)',
        borderRadius: isExpand ? '5% 5% 0 5%' : '50%',
        boxShadow: '2px 2px 10px #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <Box
        sx={{
          width: isExpand ? '370px' : '55px',
          height: isExpand ? '470px' : '55px',
          borderRadius: isExpand ? '5%' : '50%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.4s cubic-bezier(0.42, 0, 0.58, 1)'
        }}
      >
        <p style={{
          position: 'absolute',
          top: 0, left: 4,
          margin: 0,
          fontSize: '32px', fontWeight: '600',
          display: isExpand ? 'block' : 'none',
          opacity: showConversation ? 1 : 0
        }}>Chatbot</p>

        {/* Toggle Button */}
        <Box
          onClick={(e) => {
            e.stopPropagation()
            setIsExpand(prev => !prev)
          }}
          sx={{
            width: isExpand ? '40px' : '55px',
            height: isExpand ? '40px' : '55px',
            borderRadius: '50%',
            bgcolor: '#000',
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <img
            className='fade-in'
            src={isExpand ? closeIcon : logoIcon}
            style={{ width: isExpand ? '20px' : '36px', userSelect: 'none', transform: isExpand ? 'none' : 'scaleX(-1)' }}
          />
        </Box>

        {/* Chat Box */}
        {isExpand && (
          <Box
            className='fade-in'
            sx={{
              mt: '52px',
              borderRadius: '16px',
              height: '90%',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              position: 'relative'
            }}
          >
            {/* Conversation */}
            <Box
              sx={{
                bgcolor: '#fafafa',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                p: '8px',
                gap: 1,
                borderRadius: '16px 16px 0 0',
                scrollbarWidth: 'none',
                transition: 'all 0.3s ease-out',
                opacity: showConversation ? 1 : 0,
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {conversation.map((message, idx) => (
                <Box key={idx} className='fade-in-up' sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <p style={{
                    alignSelf: message.sender === 'me' ? 'flex-end' : 'flex-start',
                    backgroundColor: message.sender === 'me' ? '#e9e9e9' : 'rgba(0,0,0,.85)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    margin: 0,
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                    color: message.sender === 'me' ? 'black' : 'white',
                    fontSize: '14px'
                  }}>{message.text}</p>
                  <p style={{
                    margin: 0,
                    fontSize: '10px',
                    alignSelf: message.sender === 'me' ? 'flex-end' : 'flex-start',
                    padding: '2px 6px',
                    backgroundColor: '#e9e9e9',
                    borderRadius: '10px'
                  }}>{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </Box>
              ))}
              <div ref={bottomRef} />
            </Box>

            {/* Input */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: '8px',
                bgcolor: '#fafafa',
                borderTop: '1px solid #e0e0e0',
                borderRadius: '0 0 16px 16px',
                opacity: showConversation ? 1 : 0
              }}
            >
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
                sx={{
                  flex: 1,
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    padding: '10px 12px',
                    '& fieldset': {
                      borderColor: 'rgb(200, 200, 200)',
                      borderWidth: '2px',
                      borderRadius: '16px'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgb(150, 150, 150)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.65)'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '16px',
                    color: 'rgba(0, 0, 0, 0.85)'
                  }
                }}
              />
              <Box
                className='boom-small'
                onMouseEnter={() => setIsHoverSend(true)}
                onMouseLeave={() => setIsHoverSend(false)}
                onClick={handleSend}
                sx={{
                  width: '30px',
                  height: '30px',
                  display: input.length >= 1 ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={isHoverSend ? sendFillIcon : sendIcon}
                  style={{ width: '24px', userSelect: 'none' }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Chatbot
