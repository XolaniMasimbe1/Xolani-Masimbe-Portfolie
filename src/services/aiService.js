import { GoogleGenAI } from "@google/genai"

console.log('Cache buster:', __CACHE_BUSTER__)
console.log('[MODULE LOAD] aiService.js loaded with @google/genai SDK')

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDpkTHPiKbnTWjrzv2kFwASWDM_5IjwPS4"

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
- Role: Was a Junior Software Developer Intern
- Education: 
  * ICT Application Development Diploma (completed 2025) at CPUT
  * Currently completing Adv Dip In ICT Application Development, Information Technology at Cape Peninsula University of Technology (Jan 2026 - present)
- Experience: Software Developer Intern at Plum Systems (March 1, 2025 - December 19, 2025) - completed
- Skills:
  - Frontend: React, React Native, JavaScript, HTML & CSS
  - Backend: Node.js, PHP, Python, Java
  - Database: SQL, MySQL, Firebase
  - Tools: Git & GitLab, AWS, Figma
- Projects: Candle Management System, Healthcare Management System, CPUT Schedule System, To-Do List App, Car Vote System
- Contact: xmasimbe965@gmail.com | +27 61 277 3329
- LinkedIn: https://linkedin.com/in/xolani-masimbe-177890234

Advanced Diploma Details:
The Advanced Diploma in ICT Application Development at Cape Peninsula University of Technology strengthens specialist theoretical and practical skills in application design, development, and implementation using current technologies and frameworks. Key competencies include advanced object-oriented programming, database design and management (SQL), web and mobile application development, and software architecture. The qualification emphasises problem-solving, system analysis, research, and the ability to translate complex requirements into scalable, high-quality software solutions, while developing professional and intellectual independence for industry or further postgraduate study.

Guidelines:
- For detailed questions about education, skills, or experience, suggest downloading Xolani's resume for comprehensive information
- Be helpful but concise in responses
- When appropriate, mention that more detailed information is available in the downloadable resume

User question: ${prompt}`

    // Use only the working model to avoid rate limits
    const modelNames = ["gemini-2.5-flash-lite"]
    console.log('[DEBUG] Will try models:', modelNames)
    let lastError = null
    
    // Try only v1 API (working version)
    const apiVersions = ['v1']
    
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
    
    // If all models failed, return a helpful error message
    if (lastError && lastError.message.includes('quota')) {
      return "I've reached my usage limit for now. Please try again in a few minutes, or contact me directly at xmasimbe965@gmail.com for immediate assistance."
    }
    throw lastError || new Error('No available models found')
  } catch (error) {
    console.error('[DEBUG] Error details:', error)
    console.error("Error generating AI response:", error)
    return "Sorry, I encountered an error while processing your request."
  }
}
