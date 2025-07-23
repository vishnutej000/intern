# Project README


## 1. Deployment Instructions

- **Install dependencies:**
  - Run `npm install` in both `frontend` and `backend` directories.
- **Environment setup:**
  - Set the following environment variables:
    - `PORT`: The port number for the backend server.
    - `SUPABASE_KEY`: Your Supabase API key.
  - Ensure these are configured in your `.env` files or system environment.
- **Database setup:**
  - Run SQL scripts in `backend/database/` to initialize and seed the database.
- **Start backend:**
  - Run `npm start` or use `start.bat` in the `backend` folder.
- **Start frontend:**
  - Run `npm run dev` in the `frontend` folder for development, or `npm run build` and `npm start` for production.

## 2. Tech Decisions

- **Frontend:**
  - Next.js (React 19)
  - SGS and CSS for styling
  - Heroicons and Lucide icons
- **Backend:**
  - Node.js
  - Supabase for database
  - Prisma for ORM
- **Linting & Type Checking:**
  - ESLint and TypeScript

## 3. If I Had More Time…

If I had more time, I would have:

- Created an exact replica of the reference frontend design, but due to assignment deadlines, I focused on core functionality and requirement satisfaction.
- Optimized performance and accessibility throughout the app.
- Made the media player play actual video outputs instead of placeholders.
- Used Cloudinary for image and thumbnail management, allowing users to click thumbnails and view the actual video.
- Expanded the tech stack and added more API endpoints to complete the web page features.
- Implemented robust authentication and authorization, since this is a surveillance company site with sensitive footage.
- Containerized the app with Docker for easier deployment and scalability.
- Improved error handling, logging, and maintainability.
- Automated camera switching in the UI (e.g., clicking a camera switches the feed).
- Added UI animations for a smoother user experience.
- Strengthened backend security and ensured all video and data is securely stored in Supabase.
- Enhanced the timeline so clicking an incident plays the corresponding video in the media player.
- Supported more camera outputs and scaled the design beyond the Figma prototype.
- Integrated AI to automatically generate incident reports. For example, when a person visits a particular incident, AI could summarize what happened (e.g., theft details, sections involved, timing) so users get a quick, useful report without watching the full footage.
 
