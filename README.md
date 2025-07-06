# Project Title: FocusWin - Intelligent Task & Productivity Manager
FocusWin is a comprehensive, full-stack task management application designed to help users organize, prioritize, and track their daily tasks with a powerful suite of intelligent features. It goes beyond a simple to-do list by providing an analytics dashboard, smart reminders, and motivational tools to optimize your workflow and build lasting habits.

# Key Achievements & Features:
# Advanced Prioritization: 
Implemented a granular 10-level priority system, a significant improvement over the basic 3-5 levels found in typical task managers, allowing for more nuanced decision-making.

# Data-Driven Insights: 
Developed an analytics dashboard that tracks completion rates, visualizes productivity trends, and provides actionable performance insights.

# Enhanced Organization: 
Engineered a flexible grouping system that allows users to create unlimited custom categories for complex project and team management, a clear advantage over apps with fixed categories.

# Motivational Engineering: 
Integrated features like a streak counter and a calendar heatmap to foster consistency and provide a visual representation of daily effort.

# Seamless Experience: 
Ensured full cross-platform access with a responsive, mobile-optimized design and a modern UI.

# Tech Stack, Tools and Frameworks: 
MERN (MongoDB, Express.js, React, Node.js), Session-Based Authentication.
Figma, Canva, Spline, Chart.js, Recharts.js 

# Deatiled Features Explanation:
# 1. Smart Task Management
- 10-Level Priority System: A granular scale to help you focus on what truly matters.
- Custom Group Organization: Create unlimited groups for projects, clients, or personal goals.
- Due Date & Reminders: Set deadlines and receive intelligent notifications.
- Quick Task Creation: An intuitive interface for adding tasks on the fly.

# 2.Analytics Dashboard
- Track your productivity with detailed insights on completion rates and performance trends.
- Visualize your progress with charts and goal-tracking metrics.

# 3. Advanced & Motivational Features
- Streak Counter: Build momentum and stay motivated by tracking your consistent productivity.
- Calendar Integration: View your tasks in a calendar format with a heatmap visualizing your daily activity levels.
- Smart Notifications: Receive timely due date alerts, email notifications, and browser reminders.

# 4. Cross-Platform Access
- A fully responsive design that works seamlessly on desktop and mobile devices.
- Features like offline capability and cross-device sync ensure you can access your tasks from anywhere.

# Technologies Used
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Authentication: Session-based authentication with express-session and connect-mongo.

# Getting Started
To get a local copy up and running, follow these simple steps.

# Prerequisites
Node.js and npm installed.

A local or remote MongoDB instance.

# Installation & Setup
You will need to clone both the backend and frontend repositories into the same parent directory.

# Clone the Backend Repository:
git clone https://github.com/pavithra2870/FocusWin.git

# Clone the Frontend Repository:
git clone https://github.com/pavithra2870/FocusWin---Frontend.git

# Install Backend Dependencies: 
Navigate into the backend folder and install the necessary packages.
cd FocusWin
npm install express express-session cors mongoose connect-mongo dotenv node-cron
Configure Backend Environment: 
While still in the FocusWin directory, create a .env file and add your environment variables.
MONGO_URI='your_mongodb_connection_string'
SESSION_SECRET='your_super_secret_key'
PORT=5000

# Install Frontend Dependencies: 
Navigate into the frontend folder and install its packages.
cd ../FocusWin---Frontend
npm install react react-router dom react-calendar-heatmap axios recharts @splinetool/react-spline

To install TailwindCSS, follow the official docs: https://tailwindcss.com/docs/installation/tailwind-cli
I have used tailwind-cli

# Running the Application
You will need two separate terminals to run both the backend server and the frontend client simultaneously.

Start the Backend Server:
In your first terminal, navigate to the backend directory (FocusWin).
Run the development server.
cd path/to/FocusWin
npm run dev
The server should now be running on http://localhost:5000.

Start the Frontend Client:
In a new terminal, navigate to the frontend directory (FocusWin---Frontend).
Start the React application.
cd path/to/FocusWin---Frontend
npm start
The client should now be running on http://localhost:3000 and will connect to your backend.
