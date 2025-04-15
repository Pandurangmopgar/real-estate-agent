<<<<<<< HEAD
# Multi-Agent Real Estate Assistant

A modern, full-stack, responsive Next.js 14 web application featuring a multi-agent chatbot system designed to solve real estate-related issues. The application uses two specialized AI agents powered by Google's Gemini API:

1. **Issue Detection & Troubleshooting Agent**: Analyzes property images and text to detect visual issues (mold, cracks, water damage, etc.) and provides repair/troubleshooting suggestions.

2. **Tenancy FAQ Agent**: Handles questions related to rental laws, agreements, and tenant/landlord rights with city or country-specific legal guidance.

## Features

- **Multi-Agent System**: Automatically routes queries to the appropriate specialized agent
- **Image Analysis**: Upload property images for AI-powered issue detection
- **Conversation Memory**: Persistent chat history using Upstash Redis
- **Responsive Design**: Mobile-friendly interface with modern UI components
- **Animated UI**: Smooth transitions and animations using Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animation**: Framer Motion
- **Icons**: lucide-react
- **AI**: Google Gemini API
- **Database**: Upstash Redis
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Google Gemini API key
- Upstash Redis account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
GOOGLE_API_KEY="your_google_api_key"
UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── about/            # About page
│   ├── api/              # API routes
│   ├── chat/             # Chat interface page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── chat/             # Chat-related components
│   └── ui/               # UI components from shadcn/ui
├── lib/                  # Utility functions
│   ├── gemini.ts         # Gemini API integration
│   ├── helpers.ts        # Helper functions
│   ├── redis.ts          # Redis integration
│   └── utils.ts          # Utility functions
├── public/               # Static assets
└── .env.local            # Environment variables
```

## Deployment

This application is ready to be deployed on Vercel. Connect your GitHub repository to Vercel and set the required environment variables in the Vercel dashboard.

```bash
npm run build
```

## License

This project is licensed under the MIT License.
=======
# real-estate-agent
>>>>>>> b2748a07d5d80b724af76dc5b203c73fba4f4acf
