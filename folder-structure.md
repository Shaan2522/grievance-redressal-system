project-root/
├── 📁 frontend/                          # React Frontend Application
│   ├── 📁 public/
│   │   ├── 📄 index.html                 # Main HTML template
│   │   └── 🖼️ favicon.ico                # Application icon
│   ├── 📁 src/
│   │   ├── 📁 components/                # React Components
│   │   │   ├── 📄 AdminDashboard.js      # Admin management panel
│   │   │   ├── 📄 AdminLogin.js          # Admin authentication
│   │   │   ├── 📄 CitizenForm.js         # Complaint submission form
│   │   │   ├── 📄 ComplaintTracking.js   # Track complaint status
│   │   │   ├── 📄 Navbar.js              # Navigation component
│   │   │   ├── 📄 StatusTracker.js       # Status timeline component
│   │   │   └── 📄 TicketDisplay.js       # Ticket confirmation display
│   │   ├── 📁 styles/                    # CSS Stylesheets
│   │   │   ├── 📄 AdminDashboard.css     # Admin dashboard styles
│   │   │   ├── 📄 AdminLogin.css         # Admin login styles
│   │   │   ├── 📄 App.css                # Global application styles
│   │   │   ├── 📄 CitizenForm.css        # Complaint form styles
│   │   │   └── 📄 ComplaintTracking.css  # Tracking interface styles
│   │   ├── 📁 utils/
│   │   │   └── 📄 constants.js           # Application constants
│   │   ├── 📄 App.js                     # Main React component
│   │   └── 📄 index.js                   # React entry point
│   └── 📄 package.json                   # Frontend dependencies
├── 📁 backend/                           # Node.js Backend API
│   ├── 📁 config/
│   │   └── 📄 db.js                      # MongoDB connection setup
│   ├── 📁 controllers/                   # Business logic controllers
│   │   ├── 📄 adminController.js         # Admin operations
│   │   ├── 📄 analyticsController.js     # Analytics & reporting
│   │   └── 📄 complaintController.js     # Complaint CRUD operations
│   ├── 📁 middleware/
│   │   └── 📄 auth.js                    # JWT authentication middleware
│   ├── 📁 models/                        # MongoDB data models
│   │   ├── 📄 Admin.js                   # Admin user schema
│   │   └── 📄 Complaint.js               # Complaint data schema
│   ├── 📁 routes/                        # API route definitions
│   │   ├── 📄 admin.js                   # Admin-related routes
│   │   ├── 📄 analytics.js               # Analytics routes
│   │   └── 📄 complaints.js              # Complaint routes
│   ├── 📁 utils/
│   │   └── 📄 ticketGenerator.js         # Utility functions
│   ├── 📄 .env                           # Environment variables
│   ├── 📄 hashPassword.js                # Password hashing utility
│   ├── 📄 package.json                   # Backend dependencies
│   └── 📄 server.js                      # Express server entry point
├── 📄 package.json                       # Root package.json for scripts
└── 📄 README.md                          # Project documentation
