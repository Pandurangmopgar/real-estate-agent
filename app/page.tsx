import Link from "next/link";
import { MessageCircle, Info, Wrench, HomeIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* Hero Section */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-primary/5 dark:from-background dark:to-primary/10 px-4 py-24 text-center">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="container max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-primary">Multi-Agent</span>
            <span className="block">Real Estate Assistant</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Your AI-powered solution for property troubleshooting and tenancy guidance.
          </p>
          
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link 
              href="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-5 w-5" />
              Try the Assistant
            </Link>
            
            <Link 
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Info className="h-5 w-5" />
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Background Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background dark:bg-background transition-colors">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Specialized Agents for Your Real Estate Needs
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Troubleshooting Agent Card */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Wrench className="h-6 w-6" />
              </div>
              
              <h3 className="mb-2 text-xl font-bold">Issue Detection & Troubleshooting</h3>
              
              <p className="mb-4 text-muted-foreground">
                Upload property images and get AI-powered analysis of issues like mold, cracks, water damage, and more.
              </p>
              
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-1 text-primary">✓</span>
                  Image analysis for property issues
                </li>
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-1 text-primary">✓</span>
                  Repair and maintenance suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-1 text-primary">✓</span>
                  Follow-up questions for clarification
                </li>
              </ul>
            </div>
            
            {/* Tenancy FAQ Agent Card */}
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HomeIcon className="h-6 w-6" />
              </div>
              
              <h3 className="mb-2 text-xl font-bold">Tenancy FAQ Agent</h3>
              
              <p className="mb-4 text-muted-foreground">
                Get answers to your questions about rental laws, agreements, and tenant/landlord rights.
              </p>
              
              <ul className="mb-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-1 text-primary">✓</span>
                  Rental law guidance
                </li>
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-1 text-primary">✓</span>
                  Lease agreement explanations
                </li>
                <li className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 p-1 text-primary">✓</span>
                  Tenant and landlord rights information
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground dark:bg-primary/90 transition-colors">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to solve your real estate problems?
          </h2>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
            Our AI-powered agents are here to help with property issues and tenancy questions.
          </p>
          
          <Link 
            href="/chat"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-background px-6 py-3 text-lg font-medium text-foreground transition-colors hover:bg-background/90"
          >
            <MessageCircle className="h-5 w-5" />
            Start Chatting Now
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-8 bg-background dark:bg-background transition-colors">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Multi-Agent Real Estate Assistant. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground">
              Chat
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
