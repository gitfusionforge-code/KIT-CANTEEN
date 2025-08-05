# Overview
KIT-Canteen is a modern food ordering application for college campuses, enabling students, faculty, and staff to browse menus, place orders, and manage preferences via a web application. It offers both customer-facing features and administrative panels for canteen management, aiming to provide a complete solution for campus food service operations. The project's vision is to streamline campus food services, enhance user experience, and provide efficient management tools for canteen operators.

## Recent Changes (August 2025)
- **Order ID Format Update**: Changed from timestamp-based format (KC + 6-digit timestamp + 6-char random) to 12-digit alphanumeric format (A-Z, 0-9) for better barcode compatibility and scanning reliability.
- Updated barcode generation across all components including server routes, client forms, and scanner validation.
- Enhanced order lookup to support both legacy and new ID formats for backward compatibility.
- Improved barcode scanner UI with real-time validation feedback and format guidance.
- **Real-time Order Notifications**: Implemented Server-Sent Events (SSE) for automatic order updates in canteen owner dashboard when students place orders, eliminating the need for manual page refreshes.
- Fixed "Mark Ready" button issue that was incorrectly calling menu update API instead of order update API.
- Added comprehensive error handling and duplicate prevention in barcode scanner functionality.

# User Preferences
Preferred communication style: Simple, everyday language.
Environment variables: Always store credentials in .env file when possible for better organization.

# System Architecture
The application is built as a **React-based SPA** using **React 18** and **TypeScript**, with **Vite** for fast builds. **Wouter** handles client-side routing, while **Tailwind CSS** with **shadcn/ui** provides a consistent design system. **TanStack Query** manages server state, and **React Hook Form** with **Zod** ensures robust form validation. The frontend follows a component-based architecture optimized for mobile-first responsiveness.

The backend is a **Node.js Express server** written in TypeScript, leveraging **ESM modules** and a middleware-based architecture. It uses an **abstract storage interface** (`IStorage`) for flexible data persistence.

Data storage employs a **dual approach**: in-memory storage (`MemStorage`) for development and **PostgreSQL with Drizzle ORM** for production, ensuring type-safe database operations. Database migrations are managed via Drizzle Kit, adhering to a schema-first approach.

Authentication is **flexible**, supporting **Google OAuth** and guest access. It implements **role-based permissions** (Student, Faculty, Staff, Admin, Super Admin) and session-based authentication with granular admin controls.

# External Dependencies
**UI and Styling:** @radix-ui, Tailwind CSS, shadcn/ui, Lucide React
**State Management & Data Fetching:** @tanstack/react-query, React Hook Form, @hookform/resolvers
**Database & ORM:** Drizzle ORM, @neondatabase/serverless, Drizzle Zod
**Development & Build Tools:** Vite, TypeScript, ESBuild, PostCSS, Autoprefixer
**Mobile & PWA Features:** @capacitor-community/barcode-scanner
**Utilities & Helpers:** date-fns, clsx, class-variance-authority, zod, nanoid
```