<div align="center">

# 🏠 Multi-Agent Real Estate Assistant

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

<p align="center">
  <strong>A sophisticated AI-powered real estate assistant with specialized agents for property troubleshooting and tenancy guidance.</strong>
</p>

<p align="center">
  <a href="#key-features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#live-demo">Live Demo</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#deployment">Deployment</a>
</p>

</div>

## 🌟 Overview

The Multi-Agent Real Estate Assistant is a premium web application that leverages advanced AI technology to provide specialized assistance for real estate needs. The system features two dedicated AI agents powered by Google's Gemini API:

- **🔍 Issue Detection & Troubleshooting Agent**: Analyzes property images to identify visual issues like mold, cracks, water damage, etc., and provides detailed repair recommendations.

- **📝 Tenancy FAQ Agent**: Offers expert guidance on rental laws, agreements, and tenant/landlord rights with location-specific legal information.

## ✨ Key Features

<table>
  <tr>
    <td>
      <strong>🤖 Multi-Agent System</strong><br>
      Intelligently routes queries to the appropriate specialized agent based on content
    </td>
    <td>
      <strong>🌙 Dark Mode Support</strong><br>
      Elegant dark theme with seamless transitions for comfortable viewing
    </td>
  </tr>
  <tr>
    <td>
      <strong>🖼️ Image Analysis</strong><br>
      Upload property images for AI-powered issue detection with visual feedback
    </td>
    <td>
      <strong>🔄 Persistent Memory</strong><br>
      Conversation history stored securely using Upstash Redis
    </td>
  </tr>
  <tr>
    <td>
      <strong>📱 Responsive Design</strong><br>
      Mobile-friendly interface with modern UI components and premium typography
    </td>
    <td>
      <strong>✨ Animated UI</strong><br>
      Sophisticated transitions and animations using Framer Motion
    </td>
  </tr>
  <tr>
    <td>
      <strong>🔍 Interactive Tutorial</strong><br>
      Helpful onboarding overlay that appears once per session
    </td>
    <td>
      <strong>⚡ Performance Optimized</strong><br>
      Fast loading times with Next.js App Router and Edge Runtime
    </td>
  </tr>
</table>

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Backend & AI
- **AI Model**: Google Gemini API (multimodal)
- **Database**: Upstash Redis
- **API Routes**: Next.js API Routes
- **Runtime**: Edge Runtime
- **Deployment**: Vercel

## 🚀 Live Demo

Experience the application live: [Multi-Agent Real Estate Assistant](https://real-estate-agent-demo.vercel.app/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Google Gemini API key
- Upstash Redis account

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
GOOGLE_API_KEY="your_google_api_key"
UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/multi-agent-realestate-bot.git
cd multi-agent-realestate-bot

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 📂 Project Structure

```
├── app/                  # Next.js App Router
│   ├── about/            # About page with animated sections
│   ├── api/              # API routes for AI and data handling
│   ├── chat/             # Chat interface with agent selection
│   └── page.tsx          # Home page with introduction
├── components/           # React components
│   ├── chat/             # Chat-related components
│   │   ├── chat-container.tsx  # Main chat interface
│   │   ├── chat-input.tsx      # Message input with image upload
│   │   └── chat-message.tsx    # Individual message display
│   └── ui/               # UI components from shadcn/ui
├── lib/                  # Utility functions
│   ├── gemini.ts         # Gemini API integration
│   ├── helpers.ts        # Helper functions for images and data
│   ├── redis.ts          # Redis integration for persistence
│   └── utils.ts          # General utility functions
├── public/               # Static assets and images
└── .env.local            # Environment variables
```

## 📦 Deployment

This application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the required environment variables in the Vercel dashboard
3. Deploy with a single click

```bash
# For manual builds
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Created with ❤️ by <a href="https://github.com/Pandurangmopgar">Pandurang Mopgar</a></p>
</div>
