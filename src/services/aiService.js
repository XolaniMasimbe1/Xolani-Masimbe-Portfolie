import { GoogleGenerativeAI } from "@google/generative-ai"

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables')
}

const ai = new GoogleGenerativeAI(API_KEY)

export async function generateAIResponse(prompt) {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' })
    
    const enhancedPrompt = `You are Xolani Masimbe's AI assistant, helping to answer questions about his portfolio, skills, and professional background. Be professional, helpful, and concise. If asked about Xolani, refer to his portfolio information:

Xolani Masimbe - Junior Software Developer
- ICT Application Development student at CPUT
- Software Developer Intern at Plum Systems
- Skills: React, React Native, Node.js, JavaScript, Python, Java, SQL, MySQL, Firebase, Git, AWS, Figma
- Projects: Candle Management System, Healthcare Management System, CPUT Schedule System
- Contact: xmasimbe965@gmail.com, +27 61 277 3329, LinkedIn: linkedin.com/in/xolani-masimbe-177890234

User question: ${prompt}`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating AI response:', error)
    return 'Sorry, I encountered an error while processing your request. Please try again.'
  }
}
