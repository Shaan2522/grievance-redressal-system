<h1 align="center">Grievance Redressal System</h1>

<div align="center"> <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version"> <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License"> <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg" alt="Status"> </div> 
<div align="center"> <h3>🏛️ Empowering Citizens, Streamlining Governance</h3> <p>A comprehensive digital platform for efficient grievance management in any district</p> </div>

## 📋 Project Overview

> The **Grievance Redressal System** is a full-stack MERN application designed to revolutionize how citizens interact with local government services. This platform addresses the critical need for transparent, efficient, and accessible grievance handling in a district.

## 🎯 Key Features

-   🚀 **Easy Complaint Submission:** Citizens can file complaints through an intuitive web interface.
-   📱 **Real-time Tracking:** Track complaint status with unique ticket IDs.
-   👨‍💼 **Admin Dashboard:** Comprehensive administrative panel for complaint management.
-   📊 **Analytics & Insights:** Department-wise and ward-wise complaint statistics.
-   🔐 **Secure Authentication:** JWT-based admin authentication system.
-   🌐 **Responsive Design:** Works seamlessly across all devices.
-   🔄 **Status Management:** Three-tier status system (Received → Active → Resolved).

## 🌟 Impact

-   **Transparency:** Citizens can track their complaints from submission to resolution.
-   **Efficiency:** Automated routing and status updates reduce processing time.
-   **Accountability:** Clear audit trails and officer assignments.
-   **Accessibility:** Simple, multilingual interface (English/Hindi).

## 🛠️ Tech Stack

<div align="center"> 
  <table> 
    <tr> 
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48" alt="MongoDB" /> <br>MongoDB </td>
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" /> <br>Express </td> 
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" /> <br>React </td> 
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" /> <br>Node.js </td>      
  </tr> 
    <tr> 
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=html" width="48" height="48" alt="HTML5" /> <br>HTML5 </td> 
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=css" width="48" height="48" alt="CSS3" /> <br>CSS3 </td> 
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=javascript" width="48" height="48" alt="JavaScript" /> <br>JavaScript </td> 
      <td align="center" width="96"> <img src="https://skillicons.dev/icons?i=git" width="48" height="48" alt="Git" /> <br>Git </td> 
    </tr> 
  </table> 
</div>

## 🔧 Additional Libraries & Tools

- Frontend: React Hooks, CSS3 Flexbox/Grid, Responsive Design
- Backend: Mongoose ODM, JWT Authentication, bcryptjs, express-validator
- Security: Helmet.js, Rate Limiting, CORS, Input Validation
- Database: MongoDB with Compass GUI
- Development: Nodemon, Concurrently, ESLint

## 📁 Project Structure

```text
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
```

## 🚀 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:

-   **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/en/download)
-   **MongoDB** (v4.0.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
-   **MongoDB Compass** (Optional but recommended) - [Download](https://www.mongodb.com/try/download/compass)
-   **Git** - [Download](https://git-scm.com/)

### 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shaan2522/grievance-redressal-system.git
    cd grievance-redressal-system
    ```

2.  **Install Root Dependencies**
    ```bash
    npm install
    ```

3.  **Backend Setup**
    ```bash
    # Navigate to backend directory
    cd backend
    # Install backend dependencies
    npm install
    # Create environment variables file
    touch .env
    ```

4.  **Configure Environment Variables (backend/.env)**
    ```env
    NODE_ENV=development
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/grievance_redressal_db
    JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_strong
    CORS_ORIGIN=http://localhost:3000
    ```

5. **Frontend Setup**
   ```bash
   # Navigate to frontend directory
    cd ../frontend
    # Install frontend dependencies
    npm install
    ```

6. **MongoDB Database Setup**
   - Option A: Using MongoDB Compass (Recommended)
     
     1. Open MongoDB Compass
  
     2. Connect to mongodb://localhost:27017
        
     3. Create a new database named grievance_redressal_db
        
     4. Create collections: complaints, admins

  - Option B: Using MongoDB Shell
    ```bash
    # Start MongoDB shell
    mongosh    
    # Create database and collection
    use grievance_redressal_db
    db.createCollection("complaints")
    db.createCollection("admins")
    ```

7. **Initialize Default Admin**
  ```bash
  # Start backend server first
  cd backend
  npm run dev
  ```
  In a new terminal:
  ```bash
  # Create default admin account
  curl -X POST http://localhost:5000/api/admin/create-default
  ```
  Or create admin manually:
  ```bash
  # Navigate to backend directory
  cd backend
  # Run the password hashing script
  node hashPassword.js
  ```

### 🚀 Running the Application

- Option 1: Run Both Servers Simultaneously (Recommended)
```bash
# From project root directory
npm run dev
```
This will start:

Backend server on http://localhost:5000

Frontend server on http://localhost:3000

- Option 2: Run Servers Separately

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 🔑 Default Admin Credentials
```text
Username: admin
Password: password
```
⚠️ Important: Change these credentials in production!

## 🎯 Usage Guide

### 👥 For Citizens

**Submit a Complaint**
1.  Visit `http://localhost:3000`
2.  Click "Submit Complaint"
3.  Fill in all required details
4.  Receive a unique ticket ID

**Track Your Complaint**
1.  Click "Track Complaint"
2.  Enter your ticket ID
3.  View real-time status updates

### 👨‍💼 For Administrators

**Admin Login**
1.  Click "Admin Login"
2.  Use credentials: `admin` / `password`
3.  Access the admin dashboard

**Manage Complaints**
-   View all complaints with filters
-   Update complaint status
-   View analytics and reports

## 📊 API Endpoints

### 🔓 Public Endpoints

| Method | Endpoint                          | Description             |
| :----- | :-------------------------------- | :---------------------- |
| `POST` | `/api/complaints/submit`          | Submit a new complaint  |
| `GET`  | `/api/complaints/track/:ticketId` | Track complaint by ID   |
| `GET`  | `/api/health`                     | Health check            |

### 🔐 Protected Endpoints (Admin Only)

| Method | Endpoint                        | Description                   |
| :----- | :------------------------------ | :---------------------------- |
| `POST` | `/api/admin/login`              | Admin authentication          |
| `GET`  | `/api/admin/profile`            | Get admin profile             |
| `GET`  | `/api/complaints`               | Get all complaints            |
| `PUT`  | `/api/complaints/:id/status`    | Update complaint status       |
| `GET`  | `/api/analytics/dashboard`      | Get dashboard analytics       |

## 🧪 Testing

### Manual Testing

**1. Test Complaint Submission**
```bash
curl -X POST http://localhost:5000/api/complaints/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "department": "Water Supply",
    "ward": "Ward 1",
    "complaintType": "Water Supply Issue",
    "description": "No water supply for 3 days",
    "address": "123 Main Street",
    "priority": "high"
  }'
```

**2. Test Admin Login**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

### Testing Checklist

- Complaint submission works
- Ticket ID generation is unique
- Complaint tracking by ticket ID
- Admin login authentication
- Admin dashboard loads with data
- Status updates work correctly
- Analytics display properly

## 🔒 Security Features

- JWT Authentication: Secure admin sessions
- Password Hashing: bcrypt for password security
- Rate Limiting: Prevent API abuse
- Input Validation: Sanitize all user inputs
- CORS Protection: Controlled cross-origin requests
- Helmet.js: Security headers
- Environment Variables: Secure configuration

