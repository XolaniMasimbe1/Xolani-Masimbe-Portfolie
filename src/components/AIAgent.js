import { useState, useEffect, useRef } from 'react'
import SectionTitle from './ui/SectionTitle'
import { generateAIResponse } from '../services/aiService'

export default function AIAgent() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m Xolani\'s AI assistant. I can help you learn more about his skills, projects, and professional background. What would you like to know?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check browser support for speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const SpeechSynthesis = window.speechSynthesis

    if (!SpeechRecognition || !SpeechSynthesis) {
      setSpeechSupported(false)
      console.warn('Speech APIs not supported in this browser')
      return
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const userMessage = event.results[0][0].transcript
      setInput(userMessage)
      setIsListening(false)
      
      // Auto-submit after voice input
      setTimeout(() => {
        handleSubmit(new Event('submit'))
      }, 500)
    }

    recognition.onerror = (error) => {
      console.error('Speech recognition error:', error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Text-to-speech function
  const speakText = (text) => {
    if (!window.speechSynthesis) return

    // If currently reading, stop it
    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      return
    }

    // Start reading the text
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1
    utterance.pitch = 1

    utterance.onstart = () => setIsReading(true)
    utterance.onend = () => setIsReading(false)
    utterance.onerror = () => setIsReading(false)

    window.speechSynthesis.speak(utterance)
  }

  // Start voice input
  const startVoiceInput = () => {
    if (!recognitionRef.current || isListening) return

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      setIsListening(false)
    }
  }

  // Stop voice input
  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(currentInput)
      const assistantMessage = { role: 'assistant', content: aiResponse }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in AI Agent:', error)
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="ai-agent">
      <SectionTitle>AI Assistant</SectionTitle>
      
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-content">
                {message.content}
              </div>
              {/* Add read-aloud button for assistant messages */}
              {message.role === 'assistant' && speechSupported && (
                <button
                  onClick={() => speakText(message.content)}
                  className={`read-aloud-button ${isReading ? 'reading' : ''}`}
                  title={isReading ? 'Stop reading' : 'Read this response aloud'}
                >
                  {isReading ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="message assistant-message">
              <div className="message-content loading">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about Xolani's skills, projects, or experience..."
              className="chat-input"
              disabled={isLoading}
            />
            
            {/* Voice Input Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`voice-button ${isListening ? 'listening' : ''}`}
                disabled={isLoading}
                title={isListening ? 'Stop recording' : 'Click to speak'}
              >
                {isListening ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="2" width="6" height="20" rx="2"/>
                    <path d="M12 17v3"/>
                    <path d="M8 11l-3 3h14l-3-3"/>
                    <circle cx="12" cy="7" r="1"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                    <path d="M17.5 7.5L19 4l-2.5 1.5M6.5 7.5L5 4l2.5 1.5"/>
                  </svg>
                )}
              </button>
            )}
            
            <button 
              type="submit" 
              className="send-button"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
          
          {/* Voice Status Indicator */}
          {isListening && (
            <div className="voice-status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px', display: 'inline-block'}}>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
              </svg>
              Listening... Speak now!
            </div>
          )}
        </form>
      </div>
      
      {/* Browser Support Notice */}
      {!speechSupported && (
        <div className="browser-support-notice">
          <p>⚠️ Voice features are not supported in your browser. Please use Chrome or Edge for the best experience.</p>
        </div>
      )}
    </section>
  )
}
