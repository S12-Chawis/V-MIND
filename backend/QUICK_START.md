🚀 V-Mind Backend - Quick Start Guide
📋 Project Overview

You’ve built a complete backend for V-Mind, a personalized learning platform with:

✅ Full JWT Authentication

✅ Roadmap Management (learning paths)

✅ Task System with XP and progress

✅ User Management with interests and statistics

✅ Personal Notes and Resources

✅ Optimized MySQL Database

✅ Documented REST API

✅ Implemented Security (Helmet, CORS, Rate Limiting)

🛠️ Initial Setup
1. Install Dependencies
cd backend
npm install

2. Configure Database
# Create the database (if it doesn’t exist)
mysql -u root -pQwe.123* < database/schema.sql

# Populate with sample data
npm run seed

3. Configure Environment Variables
cp env.example .env
# Edit .env with your credentials

4. Run the Server
# Development
npm run dev

# Production
npm start

🧪 Test the API
Run Automated Tests
npm test

Test Manually
# Health check
curl http://localhost:3000/health

# Login with test user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"laura@example.com","passwords":"laura123"}'

📊 Available Test Data
Users

Laura (User): laura@example.com / laura123

Carlos (Admin): carlos@example.com / carlos123

Roadmaps

Web Development Roadmap (beginner)

Python Roadmap (beginner)

Tasks

Read HTML introduction (reading)

Practice with CSS (practice)

Take a JavaScript quiz (quiz)

Build a React project (project)

🔌 Main Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login
GET	/api/roadmaps	List roadmaps
POST	/api/roadmaps	Create roadmap
GET	/api/tasks/level/:id	Tasks of a level
GET	/api/users/stats	User statistics
GET	/health	Health check
📁 Project Structure
backend/
├── config/
│   └── database.js          # MySQL configuration
├── controllers/
│   ├── authController.js    # Authentication
│   ├── roadmapController.js # Roadmaps
│   ├── taskController.js    # Tasks
│   └── userController.js    # Users
├── middleware/
│   └── auth.js              # JWT middleware
├── models/
│   ├── User.js              # User model
│   ├── Roadmap.js           # Roadmap model
│   └── Task.js              # Task model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── roadmaps.js          # Roadmap routes
│   ├── tasks.js             # Task routes
│   └── users.js             # User routes
├── scripts/
│   └── seed.js              # Sample data
├── database/
│   └── schema.sql           # DB schema
├── server.js                # Main server
├── test-api.js              # API tests
└── README.md                # Full documentation

🎯 Implemented Features
🔐 Authentication

User registration and login

Secure JWT tokens

Authentication middleware

Roles (admin/user)

🗺️ Roadmaps

Full CRUD

Filters by difficulty and topic

Level and task management

XP and rewards

✅ Tasks

Assign tasks to users

Track progress

Different types (reading, practice, quiz, project)

XP system

👤 User

Manage interests

Personal notes

Saved resources

Detailed statistics

🛡️ Security

Helmet for secure headers

Rate limiting

Configured CORS

Data validation

🚀 Next Steps
For the Frontend

Configure CORS for http://localhost:3001

Use JWT tokens for authentication

Implement endpoints based on documentation

Handle API errors

For the Backend

Add stronger validation

Implement unit tests

Add structured logging

Set up CI/CD

📚 Full Documentation

API Documentation: API_DOCUMENTATION.md

Main README: README.md

DB Schema: database/schema.sql

🔧 Useful Commands
# Development
npm run dev

# Test API
npm test

# Seed database
npm run seed

# View logs
tail -f logs/app.log

🆘 Troubleshooting
Database Connection Error
# Check MySQL
sudo systemctl status mysql

# Verify credentials in .env
cat .env

Port Already in Use
# Change port in .env
PORT=3001

# Or kill process
lsof -ti:3000 | xargs kill -9

CORS Error
# Check configuration in server.js
# Ensure CORS_ORIGIN points to the frontend


🎉 Your backend is ready to connect with the frontend!

The API provides all the functionality needed for a complete learning platform with gamification, personalized roadmaps, and progress tracking.