// Secure AI Service - Uses backend proxy to hide API key
console.log('[MODULE LOAD] aiService.js loaded with secure backend proxy')

export async function generateAIResponse(prompt) {
  try {
    console.log('[DEBUG] Sending request to secure AI proxy')
    
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('[DEBUG] Successfully received response from AI proxy')
      return data.response
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('[DEBUG] AI proxy error:', errorData)
      
      // Handle specific error cases
      if (response.status === 429) {
        return "I've reached my usage limit for now. Please try again in a few minutes, or contact me directly at xmasimbe965@gmail.com for immediate assistance."
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error('[DEBUG] Error in secure AI service:', error)
    
    // Return user-friendly error message
    if (error.message.includes('Failed to fetch')) {
      return "I'm having trouble connecting to my AI service. Please check your internet connection and try again."
    }
    
    return "Sorry, I encountered an error while processing your request. Please try again later."
  }
}
