import { GoogleGenAI } from "@google/genai"

console.log('Cache buster:', __CACHE_BUSTER__)
console.log('[MODULE LOAD] aiService.js loaded with @google/genai SDK')

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not set in environment variables")
  console.error("Make sure your .env file is in the root directory and contains: VITE_GEMINI_API_KEY=your_key")
} else {
  console.log('[API KEY] Loaded successfully, length:', API_KEY.length)
  console.log('[API KEY] First 10 chars:', API_KEY.substring(0, 10) + '...')
}

// The client gets the API key from the environment variable VITE_GEMINI_API_KEY
// or can be passed directly via apiKey option
const ai = new GoogleGenAI({ apiKey: API_KEY })

// Helper function to get available models
async function getAvailableModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`)
    if (response.ok) {
      const data = await response.json()
      if (data.models && data.models.length > 0) {
        // Filter models that support generateContent
        const supportedModels = data.models
          .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
          .map(m => {
            // Extract model name (remove 'models/' prefix if present)
            const name = m.name?.replace('models/', '') || m.name
            return name
          })
        console.log('[DEBUG] Available models:', supportedModels)
        return supportedModels
      }
    }
  } catch (error) {
    console.error('[DEBUG] Error fetching available models:', error)
  }
  return []
}

export async function generateAIResponse(prompt) {
  try {
    const enhancedPrompt = `You are Xolani Masimbe's AI assistant, helping to answer questions about his portfolio, skills, and professional background. Be professional, helpful, and concise.

Profile:
- Name: Xolani Masimbe
- Role: Junior Software Developer
- Education: ICT Application Development Diploma (completed 2025) at CPUT
- Experience: Software Developer Intern at Plum Systems (March 1, 2025 - December 19, 2025) - completed
- Skills: React, React Native, Node.js, JavaScript, Python, Java, SQL, MySQL, Firebase, Git, AWS, Figma
- Projects: Candle Management System, Healthcare Management System, CPUT Schedule System, To-Do List App, Car Vote System
- Contact: xmasimbe965@gmail.com | +27 61 277 3329
- LinkedIn: https://linkedin.com/in/xolani-masimbe-177890234

User question: ${prompt}`

    // First, try to get available models
    let modelNames = await getAvailableModels()
    
    // If no models found, use fallback list
    if (modelNames.length === 0) {
      console.log('[DEBUG] No models found via API, using fallback list')
      modelNames = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
      ]
    }
    
    console.log('[DEBUG] Will try models:', modelNames)
    let lastError = null
    
    // Try both v1 and v1beta endpoints with each model
    const apiVersions = ['v1', 'v1beta']
    
    for (const modelName of modelNames) {
      for (const apiVersion of apiVersions) {
        try {
          console.log('[DEBUG] Trying direct API call with model:', modelName, 'API version:', apiVersion, 'at', new Date().toISOString())
          
          const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${API_KEY}`
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: enhancedPrompt
                }]
              }]
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated'
            console.log('[DEBUG] Successfully used model via direct API:', modelName, 'with', apiVersion)
            return result
          } else {
            const errorData = await response.json().catch(() => ({}))
            lastError = new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
            console.log('[DEBUG] Direct API call with', modelName, apiVersion, 'failed:', errorData.error?.message || response.statusText)
            // If it's a 404 or model not found error, try next API version or model
            if (response.status === 404 || (errorData.error?.message && errorData.error.message.includes('not found'))) {
              continue // Try next API version
            }
            // For 503 (overloaded), try next API version
            if (response.status === 503) {
              continue // Try next API version
            }
          }
        } catch (error) {
          lastError = error
          console.log('[DEBUG] Direct API call with', modelName, apiVersion, 'failed:', error.message)
          continue
        }
      }
    }
    
    // Fallback: Try SDK if direct API calls all failed
    console.log('[DEBUG] Falling back to SDK...')
    for (const modelName of modelNames) {
      try {
        console.log('[DEBUG] Trying SDK with model:', modelName, 'at', new Date().toISOString())
        
        const response = await ai.models.generateContent({
          model: modelName,
          contents: enhancedPrompt
        })
        
        console.log('[DEBUG] Successfully used model via SDK:', modelName)
        console.log('[DEBUG] Response structure:', Object.keys(response || {}))
        
        // Handle response - check if text is a property or method
        const responseText = typeof response.text === 'function' ? response.text() : response.text
        if (!responseText) {
          console.warn('[DEBUG] Response.text is empty or undefined, full response:', response)
        }
        return responseText || 'No response generated'
      } catch (error) {
        lastError = error
        console.log('[DEBUG] SDK model', modelName, 'failed:', error.message)
        // If it's a 404 or model not found error, try next model
        if (error.message && (error.message.includes('404') || error.message.includes('not found') || error.message.includes('not supported'))) {
          continue
        }
        // For other errors, try next model
        continue
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error('No available models found')
  } catch (error) {
    console.error('[DEBUG] Error details:', error)
    console.error("Error generating AI response:", error)
    return "Sorry, I encountered an error while processing your request."
  }
}
