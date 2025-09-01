# V-Mind

**V-Mind** is a next-generation knowledge management and productivity platform, designed for interstellar teams and organizations seeking to organize, visualize, and collaborate on information across the galaxy. Built with scalability, modularity, and user experience in mind, V-Mind empowers users to map their ideas, tasks, and resources as if navigating a star system.

---

## 🚀 Galactic Overview

- **Project Name:** V-Mind  
- **Purpose:** Knowledge management, mind mapping, and productivity tool  
- **Theme:** Galactic/space-inspired UI and terminology  
- **Tech Stack:**  
  - Frontend: HTML, CSS, JavaScript (Vanilla)  
  - Bundler/Dev Server: Vite  
  - Backend: Node.js + Express  
  - Database: MySQL  
  - Styling: Custom CSS  
  - Authentication: JWT (or similar, if applicable)  
- **Status:** In active development  

---

## 🌌 Features

- **Mind Mapping:** Create, edit, and visualize interconnected ideas as constellations.  
- **Task Management:** Assign, track, and complete tasks (missions) within your knowledge galaxy.  
- **Collaboration:** Real-time collaboration for teams across the universe.  
- **Search & Filter:** Quickly locate stars (notes, tasks, resources) in your knowledge system.  
- **Customizable Views:** Switch between different galaxy map layouts and perspectives.  
- **User Authentication:** Secure access for crew members (users).  
- **Responsive Design:** Optimized for all devices, from planetary stations to mobile shuttles.  

---

## 🛰️ Installation

### Prerequisites

- **Node.js** (version 16.x or higher recommended)  
- **npm** (comes with Node.js)  
- **MySQL** (local or remote instance)  
- (Optional) **Git** for version control  

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AlejaQuiroga545/V-Mind.git
   cd V-Mind
   ```
1. **Install dependencies**
 ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env` and update with your galactic credentials.
   - Example:
     ```
     # .env
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=your_password
      DB_NAME=vmind
      JWT_SECRET=your_super_secret_key
      PORT=3000
     ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Platform**
   - Open your browser and navigate to `http://localhost:3000`

---

## 🪐 Project Structure

```
vmind_v2-main/
│
├── public/             # Static assets (images, icons, etc.)
├── src/                # Source code
│   ├── components/     # Reusable UI components (Stars, Planets, etc.)
│   ├── pages/          # Application pages (Galaxies)
│   ├── services/       # API and utility services
│   ├── store/          # State management
│   └── styles/         # Styling files
├── .env.example        # Example environment variables
├── package.json        # Project metadata and scripts
└── README.md           # This file
```

---

## 🌠 Usage

- **Create a New Map:** Start a new galaxy and add stars (nodes) to represent ideas or tasks.
- **Connect Ideas:** Draw connections (wormholes) between stars to visualize relationships.
- **Assign Tasks:** Designate missions to crew members and track progress.
- **Collaborate:** Invite others to your galaxy and work together in real-time.

---

## 🛠️ Troubleshooting

- **Port Already in Use:**  
  If you see an error about port 3000, either stop the process using it or change the `PORT` in your `.env` file.

- **Database Connection Issues:**  
  Ensure MongoDB is running and the `MONGODB_URI` is correct.

- **Dependency Issues:**  
  Run `npm install` again if you encounter missing modules.

- **Environment Variables Not Loaded:**  
  Double-check your `.env` file and restart the server after changes.

---

## 🛸 Contributing

We welcome contributions from all corners of the galaxy! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 🌍 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📡 Contact

For questions, suggestions, or to join our crew, contact:

- **Project Lead:** Alejandra Quiroga - Scrum Master
- **Email:** alejandraquirogag802@gmail.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/vmind_v2/issues)

---

> *"Chart your ideas. Connect your universe. VMind v2 — Your knowledge, mapped among the stars."*
