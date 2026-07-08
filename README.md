# Athlete Management System (AMS)

An enterprise-grade platform for coaches and athletes to track performance, manage training schedules, and monitor body metrics.

## Features
- **Role-based Dashboards:** Separate interfaces for Coaches and Students.
- **Performance Tracking:** Log and chart track & field results.
- **Smart Scheduling:** Calendar integration for daily training assignments.
- **Image Uploads:** Instant profile image and media uploads via ImgBB.
- **Cinematic UI:** Glassmorphism, animations, and dark mode support using Tailwind CSS & Framer Motion.

## Tech Stack
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + Framer Motion
- Firebase (Auth & Firestore)
- React Hook Form + Zod
- TanStack Query
- Recharts

## Setup Instructions

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Rename `.env.local.example` to `.env.local` and add your Firebase and ImgBB API keys.

3. **Run Local Server**
   ```bash
   npm run dev
   ```

## Database Schema (Firestore)
- `/users/{uid}` - Core user data & roles
- `/athletes/{uid}` - Athlete profiles
  - `/metrics/{date}` - Daily body metrics
- `/coaches/{uid}` - Coach profiles
- `/schedules/{id}` - Training plans
- `/performances/{id}` - Competition results

## Deployment
This project is optimized for deployment on Vercel. Ensure all environment variables are added to your Vercel project settings.

## Security Rules
Deploy the included `firestore.rules` to your Firebase project to secure data access between coaches and students.
