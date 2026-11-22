# V-Mind - AI Learning Copilot 🚀

A gamified learning platform that personalizes your learning journey through interactive roadmaps, progress tracking, and AI-powered recommendations.

<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/2841cb61-d51a-43dc-a544-a4e69246e632" />


## ✨ Features

- **Personalized Learning Paths**: Dynamic roadmaps based on your experience level and interests
- **Interactive Planet System**: Learn through an engaging space-themed interface
- **Progress Tracking**: Real-time XP system and achievement tracking
- **Rich Notes System**: Create and organize your learning notes with rich text editing
- **Resource Management**: Access curated learning materials for each topic
- **User Characterization Survey**: Get personalized recommendations through an intelligent survey
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Project Structure

```
V-Mind/
├── backend/                 # Node.js backend server
│   ├── config/             # Database and server configuration
│   ├── controllers/        # API endpoint controllers
│   ├── models/            # Database models and queries
│   ├── routes/            # API route definitions
│   ├── middleware/        # Authentication and validation middleware
│   ├── scripts/           # Database setup and utility scripts
│   └── server.js          # Main server entry point
├── frontend/               # Frontend application
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   ├── assets/            # Images and UI elements
│   ├── index.html         # Landing page
│   ├── login.html         # User authentication
│   ├── register.html      # User registration
│   ├── survey.html        # Learning characterization survey
│   └── dashboard.html     # Main learning dashboard
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/S12-Chawis/V-MIND.git
cd V-Mind
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE vmind_db;
CREATE USER 'vmind_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON vmind_db.* TO 'vmind_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Configure Environment Variables
```bash
# Copy the example environment file
cp backend/env.example backend/.env

# Edit the .env file with your database credentials
nano backend/.env
```

Example `.env` configuration:
```env
DB_HOST=localhost
DB_USER=vmind_user
DB_PASSWORD=your_password
DB_NAME=vmind_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:8000
PORT=3000
```

#### Initialize Database Schema
```bash
# Run the database setup script
cd backend
node scripts/setup-database.js
```

### 4. Start the Backend Server

```bash
# From the project root
npm start

# Or manually start the backend
cd backend
node server.js
```

The backend will start on `http://localhost:3000`

### 5. Start the Frontend

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Start a local HTTP server (Python 3)
python -m http.server 8000

# Or use Node.js http-server if you have it installed
npx http-server -p 8000
```

The frontend will be available at `http://localhost:8000`

## 🔧 Configuration

### Backend Configuration

The backend server can be configured through environment variables:

- `PORT`: Server port (default: 3000)
- `DB_HOST`: MySQL host (default: localhost)
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed origin for CORS

### Frontend Configuration

API endpoints are configured in `frontend/js/api-config.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📱 Usage

### 1. User Registration
- Navigate to the registration page
- Fill in your details and preferences
- Complete the learning characterization survey
- Get redirected to login

### 2. User Login
- Use your registered email/username and password
- Access your personalized dashboard

### 3. Learning Dashboard
- Explore your personalized learning roadmap
- Complete tasks to earn XP
- Take notes and organize resources
- Track your progress through interactive charts

### 4. Survey System
- New users complete a characterization survey
- Survey results determine your learning path
- Roadmap content adapts to your preferences

## 🗄️ Database Schema

The application uses the following main tables:

- `users`: User accounts and profiles
- `user_surveys`: Survey responses and preferences
- `user_tasks`: Task completion tracking
- `user_notes`: User-created learning notes
- `user_resources`: User-saved learning resources

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
# Open in browser and test functionality manually
# Or use browser developer tools for debugging
```

## 🚀 Deployment

### Production Environment

1. **Set Production Environment Variables**
   ```bash
   NODE_ENV=production
   DB_HOST=your_production_db_host
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Build Frontend** (if using a build tool)
   ```bash
   cd frontend
   npm run build
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name "vmind-backend"
   pm2 startup
   pm2 save
   ```

### Docker Deployment

```dockerfile
# Example Dockerfile for backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/V-Mind/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error logs

## 🔄 Updates and Maintenance

- **Regular Updates**: Check for Node.js and dependency updates
- **Security Patches**: Monitor security advisories for dependencies
- **Database Maintenance**: Regular backups and optimization
- **Performance Monitoring**: Monitor server performance and user experience

## 📊 Performance Considerations

- **Database Indexing**: Ensure proper indexes on frequently queried fields
- **Caching**: Implement Redis caching for frequently accessed data
- **CDN**: Use CDN for static assets in production
- **Load Balancing**: Consider load balancing for high-traffic scenarios

---

**Happy Learning! 🎓✨**

Built with ❤️ by the V-Mind Team
