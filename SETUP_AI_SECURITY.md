# Secure AI API Setup Guide

## 🚨 IMPORTANT: Your API Key Was Exposed

Your Google Gemini API key was detected as leaked because it was exposed in client-side code. This guide will help you secure it properly.

## 🔧 Fix Steps

### 1. Get a New API Key
Since your current key was flagged as leaked, you need to generate a new one:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. **Delete the old leaked key**

### 2. Update Your .env File
Create or update your `.env` file in the project root:

```env
# Server-side environment variables (SECURE)
GEMINI_API_KEY=your_new_api_key_here

# MongoDB (keep existing)
VITE_MONGODB_URI=mongodb+srv://xmasimbe965_db_user:JKKjEOtxV17y4jcp@xolanidb.kf5qxbp.mongodb.net/?appName=XolaniDb
```

### 3. Remove Client-Side API Key
Delete any references to `VITE_GEMINI_API_KEY` from your code. The API key should ONLY be in the server environment.

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Secure Server
```bash
npm run start
```

## 🛡️ Security Benefits

### Before (Insecure):
- ❌ API key exposed in browser code
- ❌ Anyone can steal your API key
- ❌ Google flags your key as leaked
- ❌ Usage abuse possible

### After (Secure):
- ✅ API key hidden on server
- ✅ Client never sees the API key
- ✅ Backend proxy handles all AI requests
- ✅ Rate limiting and error handling on server
- ✅ Much more secure architecture

## 🔄 How It Works Now

1. **Client** sends request to `/api/ai/generate`
2. **Server** receives request and adds the secure API key
3. **Server** calls Google AI API
4. **Server** returns response to client
5. **API key never exposed to browser**

## 🚀 Development vs Production

### Development:
```bash
npm run dev          # Frontend only (for UI development)
npm run server       # Backend only (for API testing)
npm run start        # Both frontend and backend
```

### Production:
```bash
npm run build        # Build React app
npm run server       # Serve built app with backend
```

## 📝 Environment Variables

- `GEMINI_API_KEY`: **Server only**, never exposed to client
- `VITE_MONGODB_URI**: Client-side (safe to expose)
- `PORT`: Server port (defaults to 3001)

## 🔍 Testing the Fix

1. Start the server: `npm run start`
2. Visit: `http://localhost:3001`
3. Test the AI chatbot
4. Check browser network tab - you should see requests to `/api/ai/generate` instead of direct Google API calls

## ⚠️ Important Notes

- Never commit `.env` file to git
- Never use `VITE_` prefix for secret API keys
- Always keep API keys on server-side only
- Regularly rotate your API keys for security

Your AI chatbot will now work securely without exposing your API key!
