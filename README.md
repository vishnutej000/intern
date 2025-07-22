# SecureSight CCTV Monitoring Dashboard

A comprehensive CCTV monitoring software dashboard that allows you to connect up to 3 CCTV feeds with computer vision models to detect various activities like unauthorized access, gun threats, and more.

## 🚀 Features

### Core Features
- **Real-time Incident Monitoring** - Live dashboard showing all security incidents
- **Multi-Camera Support** - Monitor up to 3 CCTV feeds simultaneously
- **Interactive Timeline** - 24-hour draggable timeline with incident markers
- **Incident Management** - Resolve incidents with optimistic UI updates
- **Advanced Filtering** - Search and filter incidents by type and status
- **Live Statistics** - Real-time stats cards showing key metrics

### Technical Features
- **Performance Optimized** - Lazy loading components for faster load times
- **Responsive Design** - Works on desktop and tablet devices
- **Dark Theme** - Professional dark UI optimized for monitoring
- **Interactive Elements** - Draggable timeline scrubber, clickable incidents
- **Real-time Updates** - Live data fetching and state management

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Modern utility-first CSS
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Lightweight database
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`

## 🎯 Usage

1. **Start the Backend**: Run the backend server first to provide API endpoints
2. **Launch Frontend**: Start the Next.js development server
3. **Monitor Incidents**: View real-time incidents in the dashboard
4. **Interact with Timeline**: Drag the timeline scrubber to navigate through time
5. **Resolve Incidents**: Click resolve buttons to mark incidents as handled
6. **Filter & Search**: Use the search and filter options to find specific incidents

## 📊 API Endpoints

### Incidents
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents?resolved=false` - Get unresolved incidents
- `PATCH /api/incidents/:id/resolve` - Mark incident as resolved

### Cameras
- `GET /api/cameras` - Get all cameras

## 🏗 Project Structure

```
securesight/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx          # Main dashboard
│   │   └── components/
│   │       ├── Navbar.tsx        # Navigation bar
│   │       ├── IncidentPlayer.tsx # Video player component
│   │       ├── IncidentList.tsx  # Incident list with filtering
│   │       ├── IncidentTimeline.tsx # Interactive timeline
│   │       ├── StatsCard.tsx     # Statistics cards
│   │       ├── CameraStatus.tsx  # Camera status display
│   │       └── LoadingSpinner.tsx # Loading component
│   ├── package.json
│   └── tailwind.config.ts
└── backend/
    ├── server.js                 # Express server
    ├── package.json
    └── README.md
```

## 🎨 UI Components

### Dashboard Layout
- **Navbar** - Navigation with user profile and menu items
- **Stats Cards** - Key metrics with trend indicators
- **Incident Player** - Main video display with controls
- **Incident List** - Scrollable list with search and filters
- **Camera Status** - Live camera connection status
- **Interactive Timeline** - 24-hour timeline with draggable scrubber

### Key Interactions
- Click incidents to view in player
- Drag timeline scrubber to navigate time
- Search incidents by type or camera
- Filter by resolved/unresolved status
- Resolve incidents with one click

## 🔧 Customization

### Adding New Incident Types
1. Update the `getIncidentColor` function in components
2. Add new incident types to the backend seed data
3. Update the color mapping for consistent theming

### Extending Camera Support
1. Modify the camera limit in the backend
2. Update the UI layout for additional camera feeds
3. Adjust the grid layout in the incident player

## 🚀 Performance Features

- **Lazy Loading** - Components load only when needed
- **Optimistic Updates** - UI updates immediately for better UX
- **Efficient Rendering** - Memoized components and optimized re-renders
- **Responsive Design** - Adapts to different screen sizes

## 📱 Responsive Design

The dashboard is optimized for:
- **Desktop** - Full feature set with multi-panel layout
- **Tablet** - Adapted layout with collapsible panels
- **Mobile** - Simplified view with stacked components

## 🔒 Security Features

- CORS configuration for secure API access
- Input validation and sanitization
- Secure incident resolution workflow
- Protected API endpoints

## 🎯 Future Enhancements

- Real-time WebSocket connections
- Video streaming integration
- Advanced analytics and reporting
- User authentication and roles
- Mobile app companion
- AI-powered incident detection

## 👨‍💻 Development

### Running in Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

## 📄 License

This project is part of a technical assessment for SecureSight CCTV monitoring software.

---

**Built with ❤️ for SecureSight Technical Assessment**