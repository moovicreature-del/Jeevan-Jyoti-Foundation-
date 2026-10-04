# 🤖 Jeevan Jyoti Foundation - Real-Time Admin Bot Integration Guide
# जीवन ज्योति फाउंडेशन - रियल-टाइम टेलीग्राम एवं स्लैक बॉट प्रशासनिक अलर्ट गाइड

This integration proactively pushes instant alerts to your **Telegram** or **Slack** group whenever:
1. 🚨 **New Volunteer Registration** is submitted (Full name, phone, guardian name, area, location).
2. 📜 **New Certificate Request / Issuance** is made (Certificate ID, citizen name, sector, phone).
3. 👔 **New Staff / Officer Application** is received.
4. 💰 **New Donation** is completed with bank transaction reference.

---

## Method 1: Instant Configuration via Super Admin Dashboard (Recommended)

No server restart or code editing needed!

1. Open the website and go to **Admin Login**.
2. From the Admin Navigation Bar, click **🤖 टेलीग्राम व स्लैक बॉट (Bot Alerts)**.
3. Configure **Telegram** and/or **Slack**:
   - Paste your **Telegram Bot Token** and **Telegram Chat ID**.
   - Or paste your **Slack Incoming Webhook URL**.
4. Click **"टेस्ट अलर्ट भेजें (Send Test)"** to verify receipt on your phone.
5. Click **"सेटिंग्स सुरक्षित करें (Save Settings)"**.

---

## Method 2: Production Environment Variables (.env / Vercel / Render)

You can also define these in your server environment:

```bash
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=7123456789:AAH_XxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx
TELEGRAM_CHAT_ID=-1001234567890

# Slack Webhook Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🚀 How to Set Up Telegram Bot (Free, 2 Minutes)

1. Open **Telegram** and search for **[@BotFather](https://t.me/botfather)**.
2. Send `/newbot`.
3. Choose a name (e.g. `Jeevan Jyoti Foundation Alert Bot`).
4. Choose a username ending in `bot` (e.g. `jjf_ghazipur_alert_bot`).
5. Copy the **HTTP API Token** (e.g. `7123456789:AAH_...`).
6. **To get your Chat ID**:
   - Send `/start` to your new bot.
   - Open **[@userinfobot](https://t.me/userinfobot)** and copy your **Id** (e.g. `123456789`).
   - *For an Admin Group*: Create a group, add your bot as an admin, and use the group chat ID (starting with `-100...`).
7. Enter Token and Chat ID into the Admin Panel, or set in `.env`.

---

## ⚡ How to Set Up Slack Webhook (Free, 2 Minutes)

1. Go to your **Slack Workspace** via browser or app.
2. Go to **Apps & Integrations** > Search **"Incoming WebHooks"**.
3. Choose the alert channel (e.g. `#jjf-admin-alerts`).
4. Click **Add Incoming WebHooks Integration**.
5. Copy the **Webhook URL** (starts with `https://hooks.slack.com/services/...`).
6. Paste the URL into the Admin Panel or `.env`.

---

## 🧪 Test Dispatched Message Format

### Telegram HTML:
```
🏛️ JEEVAN JYOTI FOUNDATION • ADMIN ALERT
🔔 नया स्वयंसेवक पंजीकरण (New Volunteer Registered)
━━━━━━━━━━━━━━━━━━━━━━
👤 Name: रमेश कुमार (Ramesh Kumar)
🆔 Record ID: VOL-2026-09-0012
👨‍👩‍👧 Guardian: Father: श्री राम प्रसाद
📞 Phone: +91XXXXXX1234
📂 Area/Sector: समाज सेवा व निःशुल्क शिक्षा
📍 Location: Ghazipur, Uttar Pradesh
━━━━━━━━━━━━━━━━━━━━━━
⏰ 23/09/2026, 11:15 AM
⚡ Admin action: Review in Super Admin Portal.
```

### Slack Blocks:
Interactive Rich Cards with colored status badges, record links, and timestamp.
