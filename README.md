# Canopy Chatbot Demo

This is a minimal Next.js chatbot demo using OpenAI, ready to deploy on Vercel.

## Setup

1. Clone this repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your OpenAI API key:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and set OPENAI_API_KEY
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo into [Vercel](https://vercel.com/).
3. In Vercel dashboard, add the environment variable `OPENAI_API_KEY` with your OpenAI API key.
4. Deploy!

## Customizing
- The system prompt is set in `pages/index.js` and passed to the API.
- The chat API is in `pages/api/chat.js`. 