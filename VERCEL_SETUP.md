# Setting Up OpenAI API Key in Vercel

To enable AI-powered content generation for presentations, you need to add your OpenAI API key to Vercel.

## Steps:

1. **Get your OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key or use an existing one

2. **Add to Vercel Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variable:
     - **Name**: `OPENAI_API_KEY`
     - **Value**: Your OpenAI API key (starts with `sk-`)
     - **Environment**: Select both "Production" and "Preview"

3. **Redeploy**
   - After adding the environment variable, redeploy your project
   - The AI content generation will now use real OpenAI calls

## Current Status:
- ✅ AI content generation code is implemented
- ✅ Fallback to enhanced placeholders when no API key
- ⚠️ OpenAI API key needs to be added in Vercel

## Testing:
1. Go to `/presentation-planner`
2. Enter a detailed prompt like:
   - "Create a 10-slide sales pitch for our AI-powered CRM system targeting enterprise clients"
   - "Generate a 15-slide quarterly review presentation for the board focusing on revenue growth"
3. Click "Generate Presentation"
4. View your AI-generated slides in the presentation viewer

Without the API key, you'll see enhanced placeholder content that's contextually relevant but not as detailed as real AI generation.