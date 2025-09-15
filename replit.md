# Next.js and Supabase Starter Kit

## Overview

This is a modern full-stack web application starter kit built with Next.js 15 and Supabase. It provides a complete authentication system with password-based auth, email verification, password reset functionality, and protected routes. The application features a clean, responsive UI built with Tailwind CSS and shadcn/ui components, along with dark/light theme support. It's designed as a production-ready template for building web applications that require user authentication and database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router for modern React development
- **Styling**: Tailwind CSS with CSS variables for theming and shadcn/ui component system
- **UI Components**: Radix UI primitives for accessibility with custom styling via class-variance-authority
- **Theme Management**: next-themes for dark/light mode switching with system preference detection
- **Typography**: Geist font family for modern, clean typography
- **Client State**: React hooks for local component state management

### Backend Architecture
- **Server-Side Rendering**: Next.js App Router with React Server Components for optimal performance
- **Authentication Middleware**: Custom middleware using Supabase SSR for session management across all routes
- **API Routes**: Next.js API routes for handling authentication callbacks and server-side operations
- **Protected Routes**: Server-side authentication checks with automatic redirects

### Authentication & Authorization
- **Provider**: Supabase Auth for comprehensive authentication system
- **Authentication Methods**: Email/password with email verification
- **Session Management**: Cookie-based sessions with SSR support via @supabase/ssr
- **Password Reset**: Email-based password reset flow with secure token handling
- **Route Protection**: Middleware-based protection for authenticated routes
- **Client/Server Split**: Separate Supabase clients for browser and server environments

### Data Storage & Management
- **Primary Database**: Supabase (PostgreSQL) for user data and application data
- **Real-time Capabilities**: Built-in support for Supabase real-time subscriptions
- **Type Safety**: TypeScript integration throughout the application
- **Environment Configuration**: Environment variable validation for Supabase connection

### Deployment & Configuration
- **Hosting**: Configured for Vercel deployment with automatic environment variable integration
- **Build Configuration**: Standalone output for containerized deployments
- **Development Environment**: Turbopack for fast local development with custom port configuration
- **Production Optimization**: Next.js built-in optimizations with proper font loading and image optimization

## External Dependencies

### Core Framework Dependencies
- **next**: 15.5.3 - React framework for production applications
- **react**: 19.0.0 - Core React library
- **react-dom**: 19.0.0 - React DOM rendering

### Authentication & Database
- **@supabase/supabase-js**: 2.45.0 - Supabase JavaScript client
- **@supabase/ssr**: 0.7.0 - Server-side rendering support for Supabase

### UI & Styling
- **tailwindcss**: 3.4.1 - Utility-first CSS framework
- **@radix-ui/react-***: Various versions - Accessible UI component primitives
- **lucide-react**: 0.511.0 - Icon library
- **next-themes**: 0.4.6 - Theme switching functionality
- **class-variance-authority**: 0.7.1 - Component variant management
- **tailwind-merge**: 3.3.0 - Tailwind class merging utility
- **clsx**: 2.1.1 - Conditional className utility

### Development Tools
- **typescript**: 5.x - Type safety and development experience
- **eslint**: 9.x - Code linting and quality
- **autoprefixer**: 10.4.20 - CSS vendor prefixing
- **tailwindcss-animate**: 1.0.7 - Animation utilities for Tailwind

### External Services Integration
- **Supabase Platform**: Database, authentication, and real-time services
- **Vercel Platform**: Hosting and deployment with automatic Supabase integration
- **Email Services**: Supabase handles email delivery for authentication flows