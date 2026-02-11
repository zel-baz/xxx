
# DroidNet Sentinel - Android CTF Suite

This project is a real-time network interception and analysis tool designed for Android CTF competitions.

## 🛠 Manual APK Build (Use this if GitHub Actions fails)

If your GitHub Actions are blocked due to billing/spending limits, follow these steps to build the APK on your own machine:

### Prerequisites
1. **Node.js** (v18+)
2. **Android Studio**
3. **Java JDK 17**

### Build Commands
```bash
# 1. Install dependencies
npm install

# 2. Build the web files
npm run build

# 3. Add and Sync the Android project
npx cap add android
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

Once Android Studio opens, click the **"Play"** button (Run) or go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate your file.

## 🚀 Features
- **Kernel Bridge**: Simulated real-time packet interception.
- **AI Audit**: Security analysis powered by Gemini 3 Pro.
- **Sentinel Engine**: Advanced connection tracking and telemetry.
