# Canopy Q&A Widget

A custom Q&A widget for Canopy's website that uses OpenAI API to answer user-submitted questions about Canopy's remote monitoring and management platform.

## 🚀 Features

- **Real-time Q&A**: Ask questions about Canopy's services and get instant AI-powered responses
- **Modern UI**: Beautiful, responsive chat interface with Canopy branding
- **Floating Widget**: Minimizable chat widget that can be embedded on any website
- **Smart Responses**: Contextual answers about Canopy's platform, features, and capabilities
- **Error Handling**: Robust error handling and user feedback
- **TypeScript**: Full TypeScript support for better development experience

## 📦 Project Structure

```
canopy-qa-widget/
├── frontend/          # Next.js frontend (Vercel deployment)
│   ├── src/
│   │   ├── app/       # Next.js app router
│   │   ├── components/ # React components
│   │   └── lib/       # API utilities
│   └── package.json
├── backend/           # Express.js backend (Render deployment)
│   ├── src/
│   │   └── index.ts   # Main server file
│   └── package.json
├── shared/            # Shared utilities (optional)
└── package.json       # Monorepo configuration
```

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **OpenAI API** - AI responses
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- OpenAI API key

### 1. Clone the repository
```bash
git clone https://github.com/sodapork/Canopy-GPT.git
cd Canopy-GPT
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 3. Environment Setup

#### Backend (.env)
```bash
cd backend
cp env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend (.env.local)
```bash
cd frontend
cp env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NODE_ENV=development
```

### 4. Start development servers

#### Option A: Start both servers (from root)
```bash
npm run dev
```

#### Option B: Start servers separately
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

## 🏗 Development

### Available Scripts

#### Root (Monorepo)
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
npm run build            # Build both projects
npm run install:all      # Install all dependencies
```

#### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

#### Backend
```bash
npm run dev              # Start development server with nodemon
npm run build            # Build TypeScript
npm run start            # Start production server
```

### API Endpoints

#### POST /ask
Ask a question about Canopy's services.

**Request:**
```json
{
  "question": "What is Canopy and how does it help with remote monitoring?"
}
```

**Response:**
```json
{
  "answer": "Canopy is a remote monitoring and management platform...",
  "question": "What is Canopy and how does it help with remote monitoring?",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect to Vercel:**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Set the root directory to `frontend`

2. **Environment Variables:**
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend Render URL

3. **Deploy:**
   - Vercel will automatically deploy on push to main branch

### Backend (Render)

1. **Create Render Service:**
   - Connect your GitHub repository
   - Set the root directory to `backend`
   - Choose Node.js as the runtime

2. **Build Command:**
   ```bash
   npm install && npm run build
   ```

3. **Start Command:**
   ```bash
   npm start
   ```

4. **Environment Variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `NODE_ENV`: production

5. **Deploy:**
   - Render will automatically deploy on push to main branch

## 🎨 Customization

### Styling
The widget uses Tailwind CSS and can be customized by modifying:
- `frontend/src/components/QAWidget.tsx` - Main widget styling
- `frontend/src/components/ChatBox.tsx` - Chat interface styling
- `frontend/src/components/InputBar.tsx` - Input field styling

### Branding
Update colors and branding in:
- Component files for UI elements
- `frontend/src/app/page.tsx` for the demo page
- Backend system prompt in `backend/src/index.ts`

### AI Responses
Customize the AI behavior by modifying the system prompt in `backend/src/index.ts`:

```typescript
const systemPrompt = `You are a helpful assistant for Canopy's website...`;
```

## 🔧 Configuration

### OpenAI Model
Change the model in `backend/src/index.ts`:
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4', // or 'gpt-3.5-turbo'
  // ... other options
});
```

### Response Length
Adjust `max_tokens` in the OpenAI API call:
```typescript
max_tokens: 500, // Increase for longer responses
```

### Temperature
Control response creativity:
```typescript
temperature: 0.7, // 0.0 = very focused, 1.0 = very creative
```

## 🛡 Security

- **CORS**: Configured to allow requests from specified frontend URL
- **Helmet**: Security headers enabled
- **Input Validation**: Question validation on backend
- **Rate Limiting**: Consider adding rate limiting for production
- **API Key Security**: OpenAI API key stored securely in environment variables

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions about this Q&A widget implementation, please contact the development team.

For questions about Canopy's services, visit [https://www.gocanopy.com/](https://www.gocanopy.com/) or use the widget! 