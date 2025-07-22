# Implementation Plan

- [x] 1. Set up database schema and backend foundation



  - Create SQLite database with tables for cameras, incidents, events, and users
  - Set up Express server with CORS and basic middleware
  - Implement database connection and initialization scripts
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 2. Implement core data models and API endpoints
- [ ] 2.1 Create camera management API endpoints
  - Implement GET /api/cameras endpoint to retrieve all cameras
  - Implement GET /api/cameras/:id endpoint for specific camera details
  - Implement PUT /api/cameras/:id/status endpoint for status updates
  - Add input validation and error handling for camera endpoints
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 2.2 Create incident management API endpoints
  - Implement GET /api/incidents endpoint with filtering and pagination
  - Implement POST /api/incidents endpoint for creating new incidents
  - Implement PUT /api/incidents/:id/resolve endpoint for resolving incidents
  - Implement GET /api/incidents/unresolved endpoint for incident counter
  - Add incident type categorization and severity handling
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 2.3 Create event timeline API endpoints
  - Implement GET /api/events/timeline endpoint with time range filtering
  - Implement GET /api/events/camera/:id endpoint for camera-specific events
  - Add event type classification and metadata handling
  - Create database indexes for efficient timeline queries
  - _Requirements: 3.1, 3.2, 3.3, 6.2, 6.3_

- [ ] 2.4 Create user authentication API endpoints
  - Implement POST /api/auth/login endpoint with JWT token generation
  - Implement GET /api/users/profile endpoint for user information
  - Implement PUT /api/users/profile endpoint for profile updates
  - Add password hashing and session management


  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 3. Create frontend project structure and base components
  - Set up Next.js pages and routing structure
  - Create TypeScript interfaces for all data models
  - Set up Tailwind CSS with custom dark theme configuration
  - Create base layout component with responsive grid system
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [ ] 4. Implement navigation header component
- [ ] 4.1 Create navigation header with branding and tabs
  - Build MANDLAC-X logo and branding elements
  - Implement navigation tabs (Dashboard, Cameras, Scenes, Incidents, Users)
  - Add active tab highlighting and click handlers
  - Create responsive navigation layout
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 4.2 Add user profile section to header
  - Implement user avatar display and dropdown menu
  - Add real-time incident counter badge
  - Create user profile information display
  - Add logout functionality
  - _Requirements: 4.2, 4.3, 2.3_

- [ ] 5. Implement camera feed management system
- [ ] 5.1 Create main camera feed display component
  - Build large central camera feed viewer
  - Implement camera stream handling and error states
  - Add camera identifier labels and status indicators
  - Create placeholder for offline cameras
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 5.2 Create thumbnail camera grid component
  - Build 2x2 thumbnail camera grid layout
  - Implement camera switching functionality on thumbnail click
  - Add hover effects and selection indicators
  - Handle multiple camera feed management
  - _Requirements: 1.2, 1.3_

- [ ] 6. Implement incident panel component
- [ ] 6.1 Create incident list display
  - Build scrollable incident list with proper styling
  - Implement color-coded severity indicators (red/orange)
  - Add incident type icons and descriptions
  - Display timestamp and location information
  - _Requirements: 2.1, 2.2, 7.2, 7.3_

- [ ] 6.2 Add incident interaction features
  - Implement resolve action buttons for each incident
  - Add incident counter display for unresolved items
  - Create incident detail tooltips or modals
  - Handle real-time incident updates
  - _Requirements: 2.4, 2.5_

- [ ] 7. Implement timeline controller component
- [ ] 7.1 Create timeline scrubber interface
  - Build horizontal timeline with time markers
  - Implement draggable time scrubber functionality
  - Add event markers with color coding on timeline
  - Display current time and duration information
  - _Requirements: 3.1, 3.2, 3.5_

- [ ] 7.2 Add playback controls
  - Implement play, pause, forward, and backward buttons
  - Add time navigation and jumping functionality
  - Create timeline marker click handlers
  - Handle video playback state management
  - _Requirements: 3.3, 3.4_

- [ ] 8. Implement camera list component
- [ ] 8.1 Create horizontal camera list layout
  - Build bottom panel camera list display
  - Add camera labels and status indicators
  - Implement horizontal scrolling for many cameras
  - Create camera selection functionality
  - _Requirements: 6.1, 6.5_

- [ ] 8.2 Add event indicators to camera list
  - Implement colored event indicator bars
  - Add different colors for different event types
  - Create hover tooltips for event details
  - Handle real-time event indicator updates
  - _Requirements: 6.2, 6.3, 6.4_

- [ ] 9. Implement real-time WebSocket communication
- [ ] 9.1 Set up WebSocket server on backend
  - Create WebSocket server with authentication
  - Implement connection management and heartbeat
  - Add event broadcasting for incidents and camera status
  - Handle client connection and disconnection
  - _Requirements: 2.1, 2.3, 8.4, 8.5_

- [ ] 9.2 Create WebSocket client integration
  - Implement WebSocket connection in frontend
  - Add real-time incident updates handling
  - Create camera status change notifications
  - Handle connection loss and reconnection
  - _Requirements: 2.3, 2.4, 1.5_

- [ ] 10. Add authentication and session management
- [ ] 10.1 Create login page and authentication flow
  - Build login form with username/password fields
  - Implement JWT token storage and management
  - Add authentication state management
  - Create protected route wrapper component
  - _Requirements: 4.1, 4.4_

- [ ] 10.2 Implement role-based access control
  - Add role checking for different user types
  - Implement conditional navigation based on permissions
  - Create admin-only features and restrictions
  - Handle session expiration and renewal
  - _Requirements: 4.3, 4.5, 5.4_

- [ ] 11. Create mock data and testing utilities
- [ ] 11.1 Generate sample camera and incident data
  - Create realistic camera feed mock data
  - Generate sample incidents with different types and severities
  - Add mock event timeline data
  - Create sample user accounts with different roles
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [ ] 11.2 Implement data seeding and development utilities
  - Create database seeding scripts for development
  - Add mock camera stream simulation
  - Implement incident generation for testing
  - Create development user accounts
  - _Requirements: 7.1, 7.4, 8.1_

- [ ] 12. Integrate all components into main dashboard
- [ ] 12.1 Assemble complete dashboard layout
  - Integrate all components into main dashboard page
  - Implement proper component communication and state management
  - Add responsive layout adjustments
  - Test component interactions and data flow
  - _Requirements: 5.1, 5.5_

- [ ] 12.2 Add final styling and polish
  - Apply consistent dark theme styling throughout
  - Add orange accent colors (#FFA500) as per design
  - Implement hover effects and transitions
  - Ensure pixel-perfect match with Figma design
  - _Requirements: 8.1, 8.2_

- [ ] 13. Test complete system functionality
- [ ] 13.1 Test camera feed switching and display
  - Verify main camera feed displays correctly
  - Test thumbnail camera switching functionality
  - Validate camera status indicators and error states
  - Test camera list navigation and selection
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 13.2 Test incident management workflow
  - Verify incident display and categorization
  - Test incident resolution functionality
  - Validate real-time incident counter updates
  - Test incident severity indicators and styling
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 13.3 Test timeline and playback functionality
  - Verify timeline scrubber navigation
  - Test event marker display and interaction
  - Validate playback controls functionality
  - Test time jumping and navigation features
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_