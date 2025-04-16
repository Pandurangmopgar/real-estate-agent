"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Info, Wrench, HomeIcon, Building2, Shield, Star, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* Hero Section */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>
        
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background"></div>
          <div className="absolute inset-0 opacity-20 mix-blend-multiply dark:opacity-30">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)"/>
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        <div className="container max-w-5xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-8">
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent pb-3"
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  Multi-Agent
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="block text-5xl sm:text-6xl md:text-7xl font-bold"
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                >
                  Real Estate Assistant
                </motion.span>
              </div>
            </h1>
            
            <div className="overflow-hidden">
              <motion.p 
                className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground leading-relaxed font-body font-medium"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Your sophisticated AI-powered solution for premium property troubleshooting and expert tenancy guidance.
              </motion.p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link 
              href="/chat"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-4 text-lg font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10 overflow-hidden"
            >
              <span className="absolute right-full w-12 h-full bg-white/20 transform skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-[250%]"></span>
              <MessageCircle className="h-5 w-5" />
              <span>Try the Assistant</span>
            </Link>
            
            <Link 
              href="/about"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-background/80 backdrop-blur-sm px-7 py-4 text-lg font-medium transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 dark:border-primary/30 dark:hover:border-primary/50 dark:hover:bg-primary/10"
            >
              <Info className="h-5 w-5" />
              <span>Learn More</span>
            </Link>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, -30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 15,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl"
            animate={{ 
              x: [0, -40, 0], 
              y: [0, 40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl"
            animate={{ 
              x: [0, 50, 0], 
              y: [0, 30, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 18,
              ease: "easeInOut" 
            }}
          />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-background dark:bg-background transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 pointer-events-none"></div>
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-4 text-center text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Specialized Agents</span> for Your Real Estate Needs
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-muted-foreground font-body font-medium">
              Our AI-powered agents provide expert assistance for all your property and tenancy concerns.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Troubleshooting Agent Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group rounded-xl border border-primary/10 dark:border-primary/20 bg-card p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/40 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <Wrench className="h-8 w-8" />
                </div>
                
                <h3 className="mb-3 text-2xl md:text-3xl font-bold">Issue Detection & Troubleshooting</h3>
                
                <p className="mb-6 text-muted-foreground leading-relaxed font-medium">
                  Upload property images and get sophisticated AI-powered analysis of issues like mold, cracks, water damage, and more.
                </p>
              
                <ul className="mb-6 space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                      <Shield className="h-3 w-3" />
                    </span>
                    <span>Advanced image analysis for property issues</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                      <Shield className="h-3 w-3" />
                    </span>
                    <span>Expert repair and maintenance suggestions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                      <Shield className="h-3 w-3" />
                    </span>
                    <span>Intelligent follow-up questions for clarification</span>
                  </li>
                </ul>
                
                <Link href="/chat" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                  <span>Try this agent</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            
            {/* Tenancy FAQ Agent Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group rounded-xl border border-primary/10 dark:border-primary/20 bg-card p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/40 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                  <Building2 className="h-8 w-8" />
                </div>
                
                <h3 className="mb-3 text-2xl md:text-3xl font-bold">Tenancy FAQ Agent</h3>
                
                <p className="mb-6 text-muted-foreground leading-relaxed font-medium">
                  Get expert answers to your questions about rental laws, agreements, and tenant/landlord rights and responsibilities.
                </p>
                
                <ul className="mb-6 space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                      <Shield className="h-3 w-3" />
                    </span>
                    <span>Comprehensive rental law guidance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                      <Shield className="h-3 w-3" />
                    </span>
                    <span>Detailed lease agreement explanations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                      <Shield className="h-3 w-3" />
                    </span>
                    <span>Tenant and landlord rights information</span>
                  </li>
                </ul>
                
                <Link href="/chat" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                  <span>Try this agent</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 py-24 text-primary-foreground dark:from-primary/90 dark:via-primary/80 dark:to-primary/70 transition-colors overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-background/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-l from-background/20 to-transparent"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container text-center relative z-10"
        >
          <div className="mx-auto max-w-4xl backdrop-blur-sm bg-white/5 rounded-2xl p-10 shadow-xl border border-white/10">
            <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-bold">
              Ready to solve your real estate problems?
            </h2>
            
            <p className="mx-auto mb-10 max-w-2xl text-xl text-primary-foreground/90 leading-relaxed font-body font-medium">
              Our sophisticated AI-powered agents are here to help with property issues and tenancy questions.
            </p>
            
            <Link 
              href="/chat"
              className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-background/90 backdrop-blur-sm px-8 py-4 text-lg font-medium text-foreground transition-all duration-300 hover:bg-background hover:shadow-lg hover:shadow-background/20 overflow-hidden"
            >
              <span className="absolute right-full w-12 h-full bg-primary/20 transform skew-x-12 transition-transform duration-700 ease-out group-hover:translate-x-[250%]"></span>
              <MessageCircle className="h-5 w-5" />
              <span>Start Chatting Now</span>
            </Link>
          </div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 bg-background dark:bg-background transition-colors">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h3 className="text-2xl mb-2 font-bold">Multi-Agent <span className="text-primary">Real Estate</span> Assistant</h3>
              <p className="text-sm text-muted-foreground max-w-md font-body">
                Your sophisticated AI-powered solution for premium property troubleshooting and expert tenancy guidance.
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
              </div>
              <p className="text-sm text-muted-foreground">Trusted by property managers and tenants</p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 Multi-Agent Real Estate Assistant. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Chat
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
