# Autonomy Enterprise HR Assistant

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Educational-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

**An intelligent HR Assistant application built with Next.js, Firebase, and Groq AI**

[Live Demo](https://scalovate-hr-ai.web.app) • [Documentation](#documentation) • [Report Bug](https://github.com/scalovate/autonomy-enterprise-hr/issues) • [Request Feature](https://github.com/scalovate/autonomy-enterprise-hr/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Trial Credentials](#trial-credentials)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Firebase Setup](#firebase-setup)
  - [Groq API Setup](#groq-api-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## 🎯 Overview

Autonomy Enterprise HR Assistant is a production-ready application that helps reduce HR team workload by providing instant, accurate responses to employee queries. Built with modern web technologies, it features an AI-powered chat interface, comprehensive leave management, multi-language support, and role-based access control.

**Key Highlights:**
- 🤖 AI-powered chat with Groq AI for instant HR assistance
- 📅 Complete leave management system
- 🌍 Multi-language support (7 languages)
- 👥 Role-based access (Employee, Manager, Admin)
- 📊 Analytics and reporting dashboard
- 🔒 Secure authentication with Firebase
- 📱 Fully responsive design

---

## ✨ Features

### Core Capabilities

- **🤖 AI-Powered Chat Interface** - Natural language conversations with Groq AI
- **📅 Leave Management** - Apply for leave, check balances, view history
- **💰 Payslip Access** - Download and view salary information
- **📊 Performance Reviews** - Track appraisals and goals
- **👥 Organizational Hierarchy** - View reporting structure
- **📚 Policy Documents** - Access HR policies and handbooks
- **🌍 Multi-Language Support** - 7 languages (English, Arabic, Hindi, Urdu, Tagalog, Malayalam, Tamil)
- **🎨 Modern UI** - Glass morphism design with smooth animations
- **📱 Mobile Responsive** - Works seamlessly on all devices

### Technical Features

- ⚡ **Next.js 14** with App Router
- 🔥 **Firebase** - Authentication, Firestore, Storage
- 🚀 **Groq AI** - Ultra-fast inference
- 🎯 **TypeScript** - Type-safe codebase
- 🎨 **Tailwind CSS** - Utility-first styling
- 📦 **Zustand** - State management
- 🔍 **RAG System** - Document retrieval and context

---

## 🔑 Trial Credentials

**⚠️ IMPORTANT:** These credentials are for testing purposes only. Replace with your own Firebase project and user accounts in production.

### Test User Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | `hradmin@company.com` | `admin123` | Full system access |
| **Manager** | `manager@company.com` | `manager123` | Team management, approvals |
| **Employee** | `employee@company.com` | `employee123` | Basic employee features |

### Default Passwords

If the above passwords don't work, try:
- `password123`
- `test123`
- `demo123`

**Note:** You may need to create these users in your Firebase Authentication console first. See [Firebase Setup](#firebase-setup) for instructions.

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/scalovate/autonomy-enterprise-hr.git
   cd autonomy-enterprise-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase and Groq API** (see [Configuration](#configuration))

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn/pnpm)
- **Firebase account** (free tier works)
- **Groq API key** (get one at [console.groq.com](https://console.groq.com))

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/scalovate/autonomy-enterprise-hr.git
   cd autonomy-enterprise-hr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Groq API Key (Required)
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   
   # Firebase Configuration (Optional - defaults provided for demo)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firebase** (see [Firebase Setup](#firebase-setup))

5. **Configure Groq API** (see [Groq API Setup](#groq-api-setup))

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## ⚙️ Configuration

### Firebase Setup

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Follow the setup wizard
4. Enable **Google Analytics** (optional)

#### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** authentication
4. Click **"Save"**

#### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

#### Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click **Web icon** (`</>`)
4. Register app with a nickname (e.g., "HR Assistant")
5. Copy the Firebase configuration object

#### Step 5: Update Configuration

**Option A: Update `lib/firebase/config.ts`**

Replace the `firebaseConfig` object with your Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

**Option B: Use Environment Variables**

Add to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Step 6: Deploy Firestore Rules

1. Install Firebase CLI (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already):
   ```bash
   firebase init
   ```

4. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

#### Step 7: Create Test Users

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Create users with these emails:
   - `hradmin@company.com` (Admin)
   - `manager@company.com` (Manager)
   - `employee@company.com` (Employee)
4. Set passwords (or use password reset emails)

#### Step 8: Set Up Storage (Optional)

1. Go to **Storage**
2. Click **"Get started"**
3. Start in **test mode** (for development)
4. Choose a location
5. Click **"Done"**

### Groq API Setup

#### Step 1: Get Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. Copy the API key (starts with `gsk_`)

#### Step 2: Configure API Key

**Option A: Environment Variable (Recommended)**

Add to `.env.local`:
```env
NEXT_PUBLIC_GROQ_API_KEY=gsk_your_api_key_here
```

**Option B: Update `lib/groq/client.ts`**

Replace the default API key in the Groq client initialization:
```typescript
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || 'gsk_your_api_key_here',
});
```

#### Step 3: Verify API Key

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Log in to the application
3. Try asking a question in the chat interface
4. If you see an error, check:
   - API key is correct
   - API key has proper permissions
   - No typos in environment variable name

---

## 📖 Usage

### For Employees

1. **Sign In** - Use your email and password
2. **Chat** - Ask questions about leave, payslips, policies, etc.
3. **Quick Actions** - Use quick action cards for common tasks
4. **Language** - Switch languages using the language selector
5. **Profile** - Update your profile information

### For Managers

1. Access the manager dashboard at `/manager`
2. View team members and their leave balances
3. Approve or reject leave applications
4. Monitor team performance
5. Access team analytics

### For Administrators

1. Access the admin dashboard at `/admin`
2. Monitor query volume and statistics
3. View top queries and resolution rates
4. Manage HR documents and policies
5. Configure AI settings
6. Manage users and roles
7. View analytics and reports

---

## 📁 Project Structure

```
autonomy-enterprise-hr/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── manager/           # Manager dashboard pages
│   ├── profile/           # User profile pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── manager/          # Manager components
│   ├── ChatInterface.tsx # Main chat component
│   ├── Header.tsx        # Header component
│   └── ...
├── lib/                   # Library code
│   ├── firebase/         # Firebase configuration
│   ├── groq/             # Groq AI client
│   ├── services/         # Firestore services
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── public/                # Static assets
├── scripts/               # Utility scripts
├── firebase.json          # Firebase configuration
├── firestore.rules        # Firestore security rules
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
└── README.md              # This file
```

---

## 🚢 Deployment

### Firebase Hosting (Recommended)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy --only hosting
   ```

Your app will be live at: `https://your-project.web.app`

### Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- **Netlify** - Static site hosting
- **AWS Amplify** - AWS hosting
- **Railway** - Container hosting
- **Self-hosted** - Docker/Node.js server

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License (Educational Use) - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2025 Scalovate Systems Solutions**

### License Terms

- ✅ **Educational Use**: This software is provided for **educational purposes only**
- ❌ **No Reselling**: Reselling or commercial distribution is **not allowed**
- 📧 **Customization**: For customization, modification, or additional development, please contact **support@scalovate.com**
- 📚 **Learning**: You may use, study, and learn from this software for educational purposes

---

## ⚠️ Disclaimer

**IMPORTANT:** This software is provided for **educational purposes only** and "as is" without warranty of any kind, express or implied.

### License Restrictions

- ⚠️ **Educational Use Only**: This software is intended for educational and learning purposes
- ⚠️ **No Reselling**: You may NOT sell, resell, or commercially distribute this software
- ⚠️ **Customization Required**: For any customization, modification, or additional development, you MUST contact **support@scalovate.com** to obtain proper licensing
- ⚠️ **Commercial Use**: Commercial use requires proper licensing from Scalovate Systems Solutions

### Configuration Requirements

- ⚠️ **Replace all demo credentials** before any use
- ⚠️ **Configure your own Firebase project** and Groq API keys
- ⚠️ **Configure proper Firestore security rules** for your use case
- ⚠️ **Set up proper authentication** and user management
- ⚠️ **Review and update API keys** regularly
- ⚠️ **Enable Firebase App Check** for production use
- ⚠️ **Set up monitoring and logging** for production use

### Demo Credentials

The Firebase configuration and Groq API keys included in this repository are for **demonstration and educational purposes only**. They should be replaced with your own credentials before any deployment.

### Support for Customization

For customization, modification, or additional development needs, please contact:
- **Email**: support@scalovate.com
- **Subject**: Autonomy HR Assistant - Customization Request

### No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/scalovate/autonomy-enterprise-hr/issues)
- **Email**: support@scalovate.com
- **Documentation**: See [docs/](docs/) folder

---

<div align="center">

**Built with ❤️ by [Scalovate Systems Solutions](https://scalovate.com)**

[⭐ Star this repo](https://github.com/scalovate/autonomy-enterprise-hr) • [📖 Documentation](#) • [🐛 Report Bug](https://github.com/scalovate/autonomy-enterprise-hr/issues)

</div>
