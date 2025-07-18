# PresentPro - AI-Powered Presentation Platform

An AI-powered presentation generation platform built with Next.js, designed to create executive-level presentations with professional precision.

<!-- Latest: AI Proposal Generator with McKinsey-style PDFs -->

## Features

- 🤖 AI-powered content generation
- 📊 Interactive chart creation (bar, line, pie, waterfall)
- 🎨 Professional templates
- ✏️ Real-time editing
- 🚀 Fast and responsive

## Deployment

### Deploy to Vercel

1. **Login to Vercel**:
   ```bash
   npx vercel login
   ```

2. **Deploy to production**:
   ```bash
   npx vercel --prod
   ```

### Environment Variables

Set these in your Vercel dashboard:

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_MODEL` - Model to use (default: gpt-4o-mini)

### Post-Deployment

1. Update `NEXT_PUBLIC_APP_URL` in vercel.json with your actual domain
2. Configure custom domain (optional)
3. Set up environment variables in Vercel dashboard

## Local Development

```bash
npm install
npm run dev
```

## Tech Stack

- Next.js 15.2.4
- TypeScript
- Tailwind CSS
- D3.js for charts
- OpenAI API

## License

Private