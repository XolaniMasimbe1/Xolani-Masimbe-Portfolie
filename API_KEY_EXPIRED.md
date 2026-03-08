# 🚨 API Key Expired - Action Required

## Problem
Your Google Gemini API key has expired and needs to be renewed.

## 🔧 Solution Steps

### 1. Generate New API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the new API key
4. **Delete the expired key** for security

### 2. Update Your .env File
Replace the expired API key in your `.env` file:

```env
# Remove this line (expired):
GEMINI_API_KEY=AIzaSyAfQFn8yx0YcxaeGB4ycnyiEccbRLKRAuw

# Add new line:
GEMINI_API_KEY=your_new_api_key_here
```

### 3. Restart Server
```bash
# Stop current server (Ctrl+C)
# Restart with new key
node server.js
```

## 🔄 Quick Fix Command
Once you have your new API key, run:
```bash
powershell -Command "(Get-Content .env) -replace 'GEMINI_API_KEY=AIzaSyAfQFn8yx0YcxaeGB4ycnyiEccbRLKRAuw', 'GEMINI_API_KEY=your_new_key_here' | Set-Content .env"
```

## ⚠️ Important Notes
- API keys can expire for security reasons
- Regular key rotation is good practice
- Never commit API keys to git
- Always keep keys in environment variables

## 🎯 Next Steps
1. Get new API key from Google AI Studio
2. Update .env file with new key
3. Restart server
4. Test your voice-enabled AI chatbot

Your secure AI chatbot will work again once the API key is renewed!
