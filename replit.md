# Overview

KIT-Canteen is a modern food ordering application designed for college campuses. The system enables students, faculty, and staff to browse menus, place orders, and manage their food preferences through a comprehensive web application. The platform includes both customer-facing features and administrative panels for canteen management, offering a complete solution for campus food service operations.

# User Preferences

Preferred communication style: Simple, everyday language.
Environment variables: Always store credentials in .env file when possible for better organization.

# Recent Changes

## January 2025 - Complete Dashboard Synchronization Implementation
- **Real-Time Data Synchronization**: Implemented comprehensive data synchronization across all user dashboards
  - Enhanced React Query configuration with aggressive refresh intervals (30-second stale time, automatic refetch)
  - Created unified data synchronization hooks (useDataSync, useAuthSync) for consistent state management
  - Added SyncStatus component showing real-time connection status across all dashboards
  - All mutations now trigger comprehensive cache invalidation across related data endpoints
  - Enhanced authentication flow with automatic user creation and role-based redirection
- **Cross-Dashboard Consistency**: Admin and canteen owner dashboards now perfectly synchronized
  - Menu items, categories, and orders update instantly across all dashboards
  - Real-time inventory and availability changes reflected immediately
  - Comprehensive error handling and user feedback for sync operations
- **Enhanced Authentication System**: Improved user role management and authentication flow
  - Automatic user account creation for new Google OAuth users
  - Role-based dashboard redirection with enhanced welcome messages
  - Special account handling for super admin (kitcanteen1@gmail.com) and canteen owner (kitcanteenowner@gmail.com)
- **TypeScript Integration**: Fixed all type errors and improved code reliability
  - Proper typing for MenuItem, Category, Order interfaces across all components
  - Enhanced error handling and null safety throughout the application

## January 2025 - Menu Data Synchronization Complete
- **Real-Time Menu Synchronization**: Successfully implemented shared API endpoints between admin and canteen owner dashboards
  - Both dashboards now use identical React Query queries (/api/menu, /api/categories)
  - Menu items and categories are synchronized in real-time across both interfaces
  - Added comprehensive API-based mutations for all CRUD operations
  - Fixed category management with proper database structure integration
- **Enhanced Error Handling**: Improved category creation with duplicate detection and unique constraints
- **Database Improvements**: Added unique constraint on category names to prevent duplicates
- **Debugging Features**: Added detailed logging for backend operations and frontend mutations

## January 2025 - Role-Based Authentication Enhancement
- **Super Admin Access**: Created super admin account for kitcanteen1@gmail.com
  - Automatic role detection and privilege assignment during Google authentication
  - Direct redirection to admin dashboard for super admin users
  - API endpoint for role-based user lookup by email/username
- **Canteen Owner Access**: Created canteen owner account for kitcanteenowner@gmail.com
  - Dedicated canteen owner dashboard with inventory and order management
  - Role-based authentication with automatic dashboard redirection
  - Enhanced authentication system to support multiple user roles

## January 2025 - Database Connection Stability Fix
- **Resolved Recurring DATABASE_URL Error**: Fixed persistent database connection issue during app remixing
  - Modified database initialization to use lazy loading pattern instead of immediate connection
  - Added comprehensive startup health check to validate database connectivity before server start
  - Created resilient database connection that handles environment variable availability
  - Implemented proper error handling and user-friendly error messages
  - Added .env.example template for environment variable reference
- **Enhanced Development Experience**: Application now starts reliably without database connection failures
- **Improved Error Recovery**: Clear error messages guide users to provision database when needed

## January 2025 - Complete Data Cleansing & Database Integration  
- **Comprehensive Sample Data Removal**: Eliminated ALL hardcoded sample data from components
  - HomeScreen: Removed hardcoded reviews, real trending items and stats from database
  - ViewAllQuickPicksPage: Shows actual menu items or empty states
  - CartPage: Real cart functionality with empty states for no items
  - OrdersPage: Displays actual orders from database with proper filtering
  - AdminFeedbackManagementPage: Shows empty state until feedback system is implemented
  - CanteenOwnerDashboard: Cleaned all mock orders, menu items, categories, notifications
  - AdminOrderManagementPage: Removed sample orders, now fetches from database
  - AdminUserManagementPage: Cleaned sample users and complaints data
  - AdminAnalyticsPage: Removed mock analytics data and performance metrics
  - AdminPanel: Cleaned inventory, staff, and feedback mock data
  - AdminNotificationManagementPage: Removed hardcoded notification stats and templates
  - AdminPaymentManagementPage: Cleaned sample payment transactions and stats
  - AdminAccessPage: Removed hardcoded admin user data and permissions
  - AdminReviewManagementPage: Cleaned sample review data and rating statistics
  - AdminDatabasePage: Removed mock database tables and backup data
  - AboutPage: Updated stats to show zero values instead of placeholder numbers
  - ProfilePage: Cleaned hardcoded order history and user statistics
  - AdminOverviewPage: Updated all metrics to show accurate zero values
  - DishDetailPage: Removed hardcoded menu items and addon data
  - SendWarningPage: Cleaned sample user data for warning system
  - All components now show zero values or empty arrays instead of mock data
  - **COMPREHENSIVE DATA CLEANSING COMPLETE**: 100% elimination of hardcoded sample data achieved across entire codebase
- **Authentication System**: Complete authentication solution implemented
  - Traditional email/password login and registration with database integration
  - **Firebase Google Authentication**: Full Google sign-in integration with redirect flow (requires domain authorization in Firebase Console)
  - Real form validation and API integration
  - Guest access functionality maintained
  - Secure environment variable configuration for Firebase credentials
  - Automatic user profile creation and session management
- **Database Migration**: Migrated from in-memory storage to PostgreSQL database
  - Created comprehensive database schema with tables: users, categories, menuItems, orders, notifications
  - Implemented complete DatabaseStorage class with full CRUD operations
  - Added proper relationships between tables using Drizzle ORM
  - Fixed DATABASE_URL connection issue by provisioning PostgreSQL database
  - Database credentials managed through Replit environment variables (security requirement)
  - Real-time data persistence replaces mock data throughout application
- **Enhanced Inventory Management**: Fixed and completed inventory system
  - Removed quick +/- adjustment buttons per user request
  - Kept only "Update Stock" button with comprehensive dialog
  - Added stock validation, warnings, and automatic availability management
- **API Integration**: Created complete REST API endpoints
  - Full CRUD operations for all data entities
  - Proper validation using Zod schemas
  - Error handling and status codes
  - Real analytics calculations from actual data

## Previous Updates - Navigation & Barcode Features
- **Complete Navigation Overhaul**: Fixed React Router bugs by implementing wouter routing
- **Real Barcode Implementation**: Added scannable Code 128 barcodes for order verification
- **Streamlined Order Flow**: Automatic order placement without manual acceptance

# System Architecture

## Frontend Architecture
The application uses a **React-based SPA (Single Page Application)** architecture built with modern web technologies:

- **React 18** with TypeScript for type safety and better developer experience
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router
- **Tailwind CSS** with **shadcn/ui** component library for consistent design system
- **TanStack Query** for efficient server state management and caching
- **React Hook Form** with Zod validation for robust form handling

The frontend follows a **component-based architecture** with clearly separated concerns:
- UI components in `/components/ui/` for reusable design elements
- Page components for different application screens
- Custom hooks for shared logic and state management
- Responsive design optimized for mobile-first experience

## Backend Architecture
The backend implements a **Node.js Express server** with TypeScript:

- **Express.js** framework for HTTP server and API routes
- **ESM modules** for modern JavaScript module support
- **Development-production parity** with environment-specific configurations
- **Middleware-based architecture** for request processing, logging, and error handling
- **Abstract storage interface** (`IStorage`) allowing flexible data persistence strategies

The server architecture separates concerns through:
- Route handlers in `/server/routes.ts` for API endpoint definitions
- Storage abstraction layer in `/server/storage.ts` for data operations
- Vite integration for development with HMR and production static file serving

## Data Storage Solutions
The application uses a **dual storage approach**:

- **Development**: In-memory storage (`MemStorage`) for rapid prototyping and testing
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Database migrations** managed through Drizzle Kit
- **Schema-first approach** with shared TypeScript types between frontend and backend

Database design features:
- Structured user management with role-based access
- Order tracking and history
- Menu item management with categories and pricing
- Payment transaction records

## Authentication and Authorization
The system implements a **flexible authentication strategy**:

- **Google OAuth integration** for streamlined user onboarding
- **Guest access** allowing users to browse without registration
- **Role-based permissions** (Student, Faculty, Staff, Admin, Super Admin)
- **Session-based authentication** with secure session management
- **Admin access controls** with granular permission systems

## External Dependencies

### UI and Styling
- **@radix-ui components** - Accessible, unstyled UI primitives for complex interactions
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Pre-built component library built on Radix UI and Tailwind
- **Lucide React** - Icon library for consistent iconography

### State Management and Data Fetching
- **@tanstack/react-query** - Server state management with caching, synchronization, and background updates
- **React Hook Form** with **@hookform/resolvers** - Form state management with validation

### Database and ORM
- **Drizzle ORM** - Type-safe SQL ORM with PostgreSQL dialect
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon database
- **Drizzle Zod** - Schema validation integration between Drizzle and Zod

### Development and Build Tools
- **Vite** - Fast build tool with HMR and optimized production builds
- **TypeScript** - Type safety across the entire application
- **ESBuild** - Fast JavaScript bundler for server-side code
- **PostCSS** with **Autoprefixer** - CSS processing and vendor prefixing

### Mobile and PWA Features
- **@capacitor-community/barcode-scanner** - QR code scanning for order management
- **Responsive design patterns** - Mobile-first approach with touch-optimized interfaces

### Utilities and Helpers
- **date-fns** - Date manipulation and formatting
- **clsx** and **class-variance-authority** - Conditional CSS class management
- **zod** - Runtime type validation and schema definition
- **nanoid** - Secure unique ID generation

The architecture prioritizes type safety, developer experience, and scalability while maintaining simple deployment and maintenance workflows.