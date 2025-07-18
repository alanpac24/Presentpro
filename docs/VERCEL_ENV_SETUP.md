# Vercel Environment Variables Setup Guide

This guide will help you add the required environment variables to your Vercel deployment for the AI Proposal Generator to work.

## Step-by-Step Instructions

### 1. Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign in to your account
3. Click on your project: **Presentpro**

### 2. Navigate to Environment Variables
1. Click on the **"Settings"** tab at the top
2. In the left sidebar, click on **"Environment Variables"**

### 3. Add Required Variables

Add each of these variables by:
1. Typing the name in "Key"
2. Pasting the value in "Value"
3. Selecting both ✅ **Production** and ✅ **Preview**
4. Click **"Add"**

#### Required Variables (MUST ADD):

| Key | Value | Where to Get It |
|-----|--------|----------------|
| `OPENAI_API_KEY` | Your actual OpenAI API key | Copy from your `.env.local` file line 2 |
| `OPENAI_MODEL` | `gpt-4o-mini` | Use exactly as shown |

#### Recommended Variables:

| Key | Value | Purpose |
|-----|--------|---------|
| `OPENAI_MAX_RETRIES` | `3` | Retry failed API calls |
| `OPENAI_TIMEOUT` | `30000` | 30 second timeout |
| `MAX_TOKENS_PER_REQUEST` | `2000` | Limit API costs |
| `USE_MOCK_AI` | `false` | Use real AI (not mock) |

#### Optional Email Variables (skip if not using email):

| Key | Value | Notes |
|-----|--------|-------|
| `RESEND_API_KEY` | Your Resend API key | Only if you have Resend account |
| `RESEND_FROM_EMAIL` | `proposals@yourdomain.com` | Your verified email |
| `RESEND_FROM_NAME` | `SalesPro` | Display name |

### 4. Important Notes

⚠️ **Security Warning**: 
- Never commit API keys to Git
- Only add them through Vercel dashboard
- Your `.env.local` file is gitignored for safety

### 5. Verify Setup

After adding all variables:
1. Trigger a new deployment (push a commit)
2. Check the deployment logs for any errors
3. Test the AI Generate feature on your preview URL

### 6. Getting Your OpenAI API Key

If you don't have an OpenAI API key:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. Go to API Keys section
4. Create new secret key
5. Copy and save it securely

### Troubleshooting

If the AI generation fails:
- Check Vercel Function logs for errors
- Verify the OPENAI_API_KEY is correct
- Ensure you have credits in your OpenAI account
- Check that you selected both Production and Preview environments

## Quick Copy Reference

Here are all the environment variables you need to copy to Vercel:

```
OPENAI_API_KEY=[copy from .env.local]
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_RETRIES=3
OPENAI_TIMEOUT=30000
MAX_TOKENS_PER_REQUEST=2000
USE_MOCK_AI=false
```