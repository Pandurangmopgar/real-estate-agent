"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowLeft, Cpu, Database, Code, 
  Home, Users, Shield, Star, 
  CheckCircle, MessageSquare, Building, 
  ImageIcon, ChevronRight, ZapIcon
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Animation variants for scroll reveal effects
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", duration: 0.8, bounce: 0.4 }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity }
};

// Define types for the AnimatedSection component props
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Reusable component for animated sections
const AnimatedSection = ({ children, className = "", delay = 0 }: AnimatedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-multiply dark:opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="smallGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20"/>
            </pattern>
            <pattern id="grid" width="150" height="150" patternUnits="userSpaceOnUse">
              <rect width="150" height="150" fill="url(#smallGrid)"/>
              <path d="M 150 0 L 0 0 0 150" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Header with navigation */}
      <header className="border-b border-primary/10 dark:border-primary/20 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <motion.div 
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="h-4 w-4" />
            </motion.div>
            <span className="font-semibold text-lg">Real Estate Assistant</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/chat"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Chat
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              className="mb-8 inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-full text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="font-medium">AI-Powered Real Estate Solutions</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              About Our<br />Multi-Agent System
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The Multi-Agent Real Estate Assistant combines cutting-edge AI technology 
              with domain expertise to solve your property challenges and answer tenancy questions.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center"
            >
              <Link 
                href="/chat"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl group"
              >
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <MessageSquare className="h-5 w-5" />
                </motion.div>
                <span>Start Chatting</span>
                <motion.div
                  className="ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                  transition={{ duration: 0.3 }}
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      </section>
      
      {/* Mission and Features Section */}
      <section id="mission" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Our Mission & Capabilities
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leveraging cutting-edge AI to solve real-world property challenges and provide expert guidance on tenancy matters.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-12 md:grid-cols-2 relative z-10">
            <AnimatedSection className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 dark:border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <motion.div 
                className="mb-6 p-4 w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Building className="h-8 w-8" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4">Property Issue Detection</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Our advanced AI analyzes property images to identify and troubleshoot common issues:
                </p>
                
                <motion.ul 
                  className="space-y-3 mt-4"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    "Water damage and moisture problems",
                    "Mold and mildew identification",
                    "Structural cracks and foundation issues",
                    "Electrical and plumbing concerns",
                    "Insulation and weatherproofing deficiencies"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={fadeInUp}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                
                <p className="mt-4 font-medium text-foreground">
                  Simply upload a photo of the problem area, and our AI will analyze it, identify issues, and suggest potential solutions.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection 
              className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 dark:border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              delay={0.2}
            >
              <motion.div 
                className="mb-6 p-4 w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary"
                whileHover={{ rotate: -5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Shield className="h-8 w-8" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4">Tenancy Guidance & Support</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Our specialized Tenancy FAQ Agent provides expert guidance on rental matters:
                </p>
                
                <motion.ul 
                  className="space-y-3 mt-4"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    "Rental agreements and lease terms explanation",
                    "Tenant and landlord rights and responsibilities",
                    "Security deposit regulations and disputes",
                    "Eviction processes and tenant protections",
                    "Maintenance responsibilities and reporting procedures"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={fadeInUp}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                
                <p className="mt-4 font-medium text-foreground">
                  Ask any question about rental laws, agreements, or landlord-tenant relationships for clear, accurate guidance.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl opacity-70 mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl opacity-70 mix-blend-multiply"></div>
      </section>
      
      {/* Architecture Section */}
      <section className="py-24 bg-muted/30 dark:bg-muted/10 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Intelligent Architecture
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our multi-agent system works seamlessly to provide specialized assistance for your specific needs.
            </p>
          </AnimatedSection>
          
          <div className="max-w-4xl mx-auto bg-card/40 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 dark:border-primary/20 shadow-xl">
            <div className="grid gap-8 md:grid-cols-2">
              <AnimatedSection>
                <motion.div 
                  className="mb-4 p-3 w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary"
                  animate={pulseAnimation}
                >
                  <Cpu className="h-7 w-7" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3">Intelligent Agent Routing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our system automatically routes your questions to the appropriate specialized agent based on content and context, ensuring you get the most accurate and helpful response.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={0.1}>
                <motion.div 
                  className="mb-4 p-3 w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary"
                  animate={pulseAnimation}
                >
                  <ImageIcon className="h-7 w-7" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3">Advanced Image Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Using Google's Gemini multimodal AI, our system can analyze property images with remarkable accuracy, identifying issues that might be missed by the human eye.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2}>
                <motion.div 
                  className="mb-4 p-3 w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary"
                  animate={pulseAnimation}
                >
                  <MessageSquare className="h-7 w-7" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3">Natural Conversation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Interact with our AI agents through natural conversation. Ask follow-up questions, request clarification, or explore related topics just as you would with a human expert.
                </p>
              </AnimatedSection>
              
              <AnimatedSection delay={0.3}>
                <motion.div 
                  className="mb-4 p-3 w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary"
                  animate={pulseAnimation}
                >
                  <Database className="h-7 w-7" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3">Persistent Memory</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our system remembers your conversation history, allowing for contextual follow-ups and a more personalized experience with each interaction.
                </p>
              </AnimatedSection>
            </div>
            
            <AnimatedSection className="mt-8 pt-8 border-t border-primary/10 dark:border-primary/20" delay={0.4}>
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-5 w-5 text-primary" fill="currentColor" />
                <h3 className="text-xl font-bold">Powered by Advanced Technology</h3>
              </div>
              <p className="text-muted-foreground">
                All agents are powered by Google's Gemini API for state-of-the-art AI capabilities, with conversation history securely stored in Upstash Redis for seamless persistence across sessions.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* Tech Stack Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Premium Technology Stack
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with modern, high-performance technologies for a seamless user experience.
            </p>
          </AnimatedSection>
          
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 relative z-10">
            <AnimatedSection className="group">
              <div className="h-full rounded-2xl border border-primary/10 dark:border-primary/20 bg-card/40 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <motion.div 
                  className="mb-5 p-4 w-16 h-16 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Code className="h-8 w-8" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Frontend</h3>
                
                <motion.ul 
                  className="space-y-3"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    "Next.js 14 (App Router)",
                    "TypeScript",
                    "Tailwind CSS",
                    "shadcn/ui Components",
                    "Framer Motion",
                    "Lucide React Icons"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="group" delay={0.1}>
              <div className="h-full rounded-2xl border border-primary/10 dark:border-primary/20 bg-card/40 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <motion.div 
                  className="mb-5 p-4 w-16 h-16 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Cpu className="h-8 w-8" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">AI & Backend</h3>
                
                <motion.ul 
                  className="space-y-3"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    "Google Gemini API",
                    "Multimodal AI Processing",
                    "Next.js API Routes",
                    "Server Components",
                    "Edge Runtime",
                    "Streaming Responses"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="group" delay={0.2}>
              <div className="h-full rounded-2xl border border-primary/10 dark:border-primary/20 bg-card/40 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <motion.div 
                  className="mb-5 p-4 w-16 h-16 flex items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20 text-primary group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Database className="h-8 w-8" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Data & Deployment</h3>
                
                <motion.ul 
                  className="space-y-3"
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    "Upstash Redis",
                    "Vercel KV",
                    "Vercel Deployment",
                    "Environment Variables",
                    "Edge Caching",
                    "Serverless Functions"
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl opacity-70 mix-blend-multiply"></div>
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl opacity-70 mix-blend-multiply"></div>
      </section>
      
      {/* Footer Section */}
      <footer className="py-16 border-t border-primary/10 dark:border-primary/20 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <AnimatedSection className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <motion.div 
                className="flex items-center gap-2 mb-4 justify-center md:justify-start"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Real Estate Assistant</h3>
              </motion.div>
              
              <p className="text-muted-foreground max-w-md">
                Your sophisticated AI-powered solution for premium property troubleshooting and expert tenancy guidance.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Star className="h-5 w-5 text-primary" fill="currentColor" />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-6">
                <Link 
                  href="/"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/chat"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Chat
                </Link>
                <ThemeToggle />
              </div>
              
              <p className="text-sm text-muted-foreground">
                © 2025 Multi-Agent Real Estate Assistant. All rights reserved.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
}
