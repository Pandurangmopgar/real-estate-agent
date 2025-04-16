import Link from 'next/link';
// Removed framer-motion import
import { Home, MessageCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="max-w-md">
        <h1 className="mb-6 text-9xl font-extrabold tracking-tight text-primary">404</h1>
        
        <h2 className="mb-4 text-3xl font-bold">Page Not Found</h2>
        
        <p className="mb-8 text-muted-foreground">
          Oops! It seems like the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          
          <Link 
            href="/chat"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessageCircle className="h-4 w-4" />
            Try the Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
