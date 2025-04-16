import React from 'react';
import Link from 'next/link';
// Removed framer-motion import
import { ArrowLeft, Cpu, Database, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <Link 
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      
      <div className="mb-12 max-w-3xl">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          About the Project
        </h1>
        
        <p className="mb-6 text-xl text-muted-foreground">
          The Multi-Agent Real Estate Assistant is a modern web application designed to help users with property-related issues and tenancy questions using specialized AI agents.
        </p>
      </div>
      
      <div className="mb-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Project Purpose</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              This project aims to leverage AI to solve two common real estate challenges:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Property Issue Detection:</strong> Using image analysis to identify and troubleshoot property problems like mold, cracks, water damage, etc.
              </li>
              <li>
                <strong>Tenancy Guidance:</strong> Providing accurate information about rental laws, agreements, and tenant/landlord rights.
              </li>
            </ul>
            <p>
              By combining these capabilities into a single application with specialized agents, we create a comprehensive solution for property-related concerns.
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="mb-4 text-2xl font-bold">Architecture Overview</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The application uses a multi-agent system architecture:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Agent Manager:</strong> Routes queries to the appropriate specialized agent based on content and context.
              </li>
              <li>
                <strong>Issue Detection Agent:</strong> Processes images and text to identify property issues and suggest solutions.
              </li>
              <li>
                <strong>Tenancy FAQ Agent:</strong> Handles questions about rental agreements, laws, and rights.
              </li>
            </ul>
            <p>
              All agents are powered by Google&apos;s Gemini API, with conversation history stored in Upstash Redis for persistence.
            </p>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border bg-card p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">Tech Stack</h2>
        
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-semibold">Frontend</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Next.js 14 (App Router)</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui Components</li>
              <li>Framer Motion</li>
              <li>Lucide React Icons</li>
            </ul>
          </div>
          
          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-semibold">AI & Backend</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Google Gemini API</li>
              <li>Multimodal AI Processing</li>
              <li>Next.js API Routes</li>
              <li>Server Components</li>
              <li>Edge Runtime</li>
            </ul>
          </div>
          
          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="mb-2 font-semibold">Data & Deployment</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Upstash Redis</li>
              <li>Vercel KV</li>
              <li>Vercel Deployment</li>
              <li>Environment Variables</li>
              <li>Edge Caching</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 Multi-Agent Real Estate Assistant. All rights reserved.
        </p>
      </div>
    </div>
  );
}
