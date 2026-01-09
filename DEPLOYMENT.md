# Deployment Guide for Xolani Masimbe Portfolio

## 🚀 Quick Deploy

### Option 1: Local Production Server
```bash
# Set up production environment
cp .env.production .env

# Build and start production server
npm run deploy
```

### Option 2: Development with MongoDB
```bash
# Start backend server
yarn server

# In another terminal, start frontend
yarn dev
```

## 📦 Deployment Options

### 1. Vercel (Recommended)
- **Frontend**: Automatic deployment from GitHub
- **Backend**: Use Vercel Functions or separate server
- **MongoDB**: Already configured with Atlas

**Setup:**
1. Push to GitHub
2. Connect Vercel to your repo
3. Add environment variables in Vercel dashboard
4. Deploy

### 2. Railway/Render
- **Full-stack**: Deploy both frontend and backend
- **MongoDB**: Use Railway's MongoDB or your Atlas

**Setup:**
1. Connect Railway/Render to GitHub
2. Set build command: `npm run build`
3. Set start command: `npm run server`
4. Add environment variables

### 3. DigitalOcean App Platform
- **Full-stack**: Deploy complete application
- **MongoDB**: Use DigitalOcean's managed MongoDB

**Setup:**
1. Create app from GitHub repo
2. Configure build and run commands
3. Add environment variables

### 4. Traditional VPS (DigitalOcean, Linode)
```bash
# On server
git clone <your-repo>
cd Xolani-Masimbe-Portfolie
npm install
cp .env.production .env
# Edit .env with production values
npm run build
npm run server
```

## 🔧 Environment Variables

Required environment variables:

```bash
# AI Service
VITE_GEMINI_API_KEY=your_gemini_api_key

# MongoDB
VITE_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp

# Server
PORT=3001
NODE_ENV=production
```

## 🌐 MongoDB Setup

Your MongoDB is already configured with Atlas:
- **Cluster**: XolaniDb
- **User**: xmasimbe965_db_user
- **Database**: portfolio

For production, consider:
1. **IP Whitelisting**: Add your deployment server IP
2. **Index Optimization**: Add indexes for frequently queried fields
3. **Backup Strategy**: Enable automatic backups in Atlas

## 📋 Pre-Deployment Checklist

- [ ] Update `.env.production` with production API keys
- [ ] Test MongoDB connection: `http://localhost:3001/api/test-mongo`
- [ ] Build successful: `npm run build`
- [ ] All environment variables set
- [ ] MongoDB IP whitelist configured
- [ ] Domain pointed to deployment (if using custom domain)

## 🔄 CI/CD Pipeline

Create `.github/workflows/deploy.yml` for automatic deployment:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm start
```

## 🐳 Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "server"]
```

## 📊 Monitoring

Consider adding:
- **Health check**: `/api/health` endpoint
- **Error tracking**: Sentry or similar
- **Performance monitoring**: New Relic or DataDog
- **Uptime monitoring**: UptimeRobot

## 🔒 Security Notes

- MongoDB credentials are in environment variables
- Enable CORS for your domain only in production
- Use HTTPS in production
- Consider rate limiting for API endpoints
- Regular security updates for dependencies
