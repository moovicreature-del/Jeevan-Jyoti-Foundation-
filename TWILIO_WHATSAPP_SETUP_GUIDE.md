# 📱 Twilio WhatsApp OTP Setup & Free Deployment Guide (Vercel & Render)

This document provides complete instructions on how to configure and deploy the **Twilio WhatsApp OTP Verification System** for **Jeevan Jyoti Foundation Ghazipur**.

---

## 1. 🔑 Where to Put Your Twilio Credentials

You need 3 credentials from your [Twilio Console](https://console.twilio.com/):

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `TWILIO_ACCOUNT_SID` | Your unique Twilio Account Identifier | `ACa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p` |
| `TWILIO_AUTH_TOKEN` | Secret authorization token | `1234567890abcdef1234567890abcdef` |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sender number | `whatsapp:+14155238886` *(Sandbox)* or your approved number |

### In Local Development / AI Studio:
Put them in `.env` (or copy from `.env.example`):
```env
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 2. 🧪 Testing with Twilio WhatsApp Sandbox (Free & Instant)

Before you get an approved WhatsApp Business Profile, Twilio provides a **free Sandbox**:

1. Go to **Twilio Console** > **Develop** > **Messaging** > **Try it out** > **Send a WhatsApp message**.
2. Note the Sandbox Number (usually `+1 415 523 8886`) and your unique sandbox join phrase (e.g., `join apple-banana`).
3. From your phone's WhatsApp, send that exact phrase to `+1 415 523 8886`.
4. Twilio will reply: *"You are all set! The sandbox can now send/receive messages from you."*
5. Now, use your phone number in our website modal — the 6-digit OTP will land directly in your WhatsApp inbox!

---

## 3. 🚀 Deploy Backend to Render (100% Free)

[Render.com](https://render.com) offers a free tier for hosting Node.js / Express web services.

### Step-by-Step Render Deployment:
1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Add Twilio WhatsApp OTP system"
   git push origin main
   ```
2. **Create New Web Service on Render**:
   - Log in to [dashboard.render.com](https://dashboard.render.com/).
   - Click **New +** > **Web Service**.
   - Connect your GitHub repository.
3. **Configure Settings**:
   - **Name**: `jeevan-jyoti-otp-backend`
   - **Environment / Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.ts`
   - **Plan**: `Free`
4. **Add Environment Variables**:
   In the **Environment** tab, click **Add Environment Variable**:
   - `TWILIO_ACCOUNT_SID` = `ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
   - `TWILIO_AUTH_TOKEN` = `your_twilio_auth_token`
   - `TWILIO_WHATSAPP_NUMBER` = `whatsapp:+14155238886`
   - `PORT` = `3000`
5. **Deploy**:
   Click **Create Web Service**. Within 2 minutes, your live backend URL will be ready (e.g. `https://jeevan-jyoti-otp-backend.onrender.com`).

---

## 4. ▲ Deploy to Vercel (100% Free)

[Vercel](https://vercel.com) provides instant serverless deployments with free SSL.

### Step-by-Step Vercel Deployment:
1. Install Vercel CLI (or connect via GitHub):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Or in the [Vercel Dashboard](https://vercel.com/dashboard):
   - Click **Add New** > **Project**.
   - Import your GitHub repository.
   - Framework Preset: **Vite**.
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. **Set Environment Variables in Vercel**:
   Go to **Project Settings** > **Environment Variables** and add:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`
4. Click **Deploy**. Vercel uses `vercel.json` to route `/api/*` to the serverless function.

---

## 5. 🔌 API Endpoints Reference

### 1. `POST /api/send-whatsapp-otp`
- **Request Body**:
  ```json
  {
    "phone": "9876543210",
    "websiteName": "Jeevan Jyoti Foundation Ghazipur"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "delivered": true,
    "channel": "twilio",
    "otp": "489215",
    "expiresIn": 300,
    "template": "Your verification code for Jeevan Jyoti Foundation Ghazipur is 489215. Valid for 5 minutes.",
    "twilioSid": "SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  }
  ```

### 2. `POST /api/verify-otp`
- **Request Body**:
  ```json
  {
    "phone": "9876543210",
    "otp": "489215"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "verified": true,
    "message": "✓ OTP सफल सत्यापन! (OTP Verified Successfully)",
    "phone": "+919876543210",
    "verificationToken": "JJF_VERIFIED_9876543210_1727076400000"
  }
  ```
