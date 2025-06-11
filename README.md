# SerialPM - Visual-First Project Management Tool

<div align="center">

![SerialPM Banner](application/serialpm/powered-by-vitawind-bright.png)

**Transform your project management with SerialPM - the visual-first, self-hostable project management platform that adapts to your workflow, not the other way around.**

[![Live Demo](https://img.shields.io/badge/🌐-Live%20Demo-blue?style=for-the-badge)](https://serialpm.tech)
[![License](https://img.shields.io/badge/📄-License-green?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/your-repo/serial-project-manager?style=for-the-badge)](https://github.com/your-repo/serial-project-manager)

</div>

---

## 🚀 What is SerialPM?

SerialPM is a revolutionary **visual-first project management tool** designed for modern teams who need intuitive, powerful project visualization and seamless integration with their existing development workflows. Unlike traditional project management tools that force you to change your process, SerialPM adapts to how you actually work.

### ✨ Key Features

- **🎨 Visual Project Timelines** - Interactive, zoomable timeline visualization with drag-and-drop functionality
- **⚡ Real-time Collaboration** - Live updates with Socket.IO integration for instant team synchronization
- **🔗 GitHub Integration** - Direct integration with GitHub for automatic progress tracking based on commits and PRs
- **📊 Multiple View Modes** - Switch between timeline, kanban, and list views seamlessly
- **🏢 Organization Management** - Multi-tenant architecture supporting multiple organizations
- **👥 Team Management** - Role-based access control with user assignment and tracking
- **🔍 Smart Search & Filtering** - Advanced search capabilities with tag-based filtering
- **🌍 Internationalization** - Multi-language support (English, UK English, and more)
- **🎯 Task Prioritization** - Visual priority indicators with color-coded status tracking
- **📱 Responsive Design** - Beautiful, modern UI that works on all devices
- **🔒 Self-Hostable** - Complete control over your data with Docker support
- **⚙️ Highly Configurable** - Customize workflows, statuses, and integrations to match your needs

---

## 🎯 Perfect For

### 🔧 **Engineering Teams**

- **Direct GitHub Integration** - Automatic progress tracking from commits and pull requests
- **Automated Task Assignment** - Smart assignment based on code ownership patterns
- **Intelligent Estimation** - AI-powered estimations based on historical team performance

### 📈 **Product Teams**

- **Visual Project Roadmaps** - Timeline visualization with real-time stakeholder updates
- **Feature Progress Tracking** - Clear visibility into feature development progress
- **Sprint Planning Automation** - Streamlined sprint planning with visual timeline management

### 🎨 **Marketing Teams**

- **Campaign Timeline Visualization** - Resource allocation and deadline management
- **Content Calendar Integration** - Approval workflows and content scheduling
- **Performance Tracking** - Integration with marketing tools for comprehensive tracking

---

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Lightning-fast development and build tool
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **React-i18next** - Internationalization

### Backend

- **Node.js & Express** - RESTful API server
- **Socket.IO** - Real-time bidirectional communication
- **MySQL** - Relational database for data persistence
- **JWT** - Secure authentication and authorization
- **bcrypt** - Password hashing and security
- **Multer** - File upload handling

### Infrastructure

- **Docker** - Containerized deployment
- **Docker Compose** - Multi-container orchestration
- **MySQL** - Database management
- **CORS** - Cross-origin resource sharing

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **Docker** (optional, for containerized deployment)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/serial-project-manager.git
   cd serial-project-manager/application/serialpm
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize the database**

   ```bash
   # Import the SQL schema from application/credentials/
   mysql -u root -p < ../credentials/mysql_init_script_final.sql
   ```

5. **Start the development servers**

   ```bash
   # Frontend (Vite dev server)
   npm run dev

   # Backend (in a separate terminal)
   node backend/api.js
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`

### Docker Deployment

```bash
# Using Docker Compose
cd application/serialpm
docker-compose up -d

# Or using the compose file
docker compose up -d
```

---

## 📖 User Guide

### Creating Your First Project

1. **Sign Up/Login** - Create an account or sign in to your existing account
2. **Join/Create Organization** - Use an invite key to join an existing organization or create a new one
3. **Create Project** - Navigate to the dashboard and click "Create Project"
4. **Add Team Members** - Invite team members using the search functionality
5. **Create Tasks** - Add tasks with priorities, due dates, and assignments
6. **Visualize Progress** - Use the timeline view to see project progress at a glance

### Key Features Usage

- **Timeline View**: Zoom, pan, and interact with project timelines
- **Task Management**: Create, edit, assign, and track task progress
- **GitHub Integration**: Connect repositories for automatic progress updates
- **Real-time Updates**: See changes from team members instantly
- **Multi-language Support**: Switch languages in settings

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `application/serialpm` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=serialpm

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# Application Settings
VITE_BACKEND_FETCH_URL=http://localhost:3000
```

### GitHub Integration Setup

1. Create a GitHub App or Personal Access Token
2. Configure webhook endpoints in your repository settings
3. Update the integration settings in SerialPM admin panel

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit patches, report bugs, and suggest improvements.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👥 Team & Contributors

**SerialPM** is developed by **Team Zero Two** - a passionate group of developers dedicated to revolutionizing project management.

| Student |      Full Name       |       SFSU Email       |    GitHub Username     | Discord Username |        Role(s)         | Contract Signed (Yes or No) |
| :-----: | :------------------: | :--------------------: | :--------------------: | :--------------: | :--------------------: | :-------------------------: |
|   #1    |   Victoria Barnett   |   rbarnett@sfsu.edu    | victoria-riley-barnett | victoriaposting  |       Team-lead        |             Yes             |
|   #2    |     Alison John      |    ajohn3@sfsu.edu     |       alisonjohn       |   alisonjohn\_   | Database Administrator |             Yes             |
|   #3    |   Ansh Ankit Patel   |   apatel18@sfsu.edu    |      AnshPatel03       |     ansh5064     |     Frontend Lead      |             Yes             |
|   #4    |     Nidhey Patel     |   npatel20@sfsu.edu    |      npatel20sfsu      |      nidhey      |    Technical Writer    |             Yes             |
|   #5    | Pritham Singh Sandhu |   psandhu3@sfsu.edu    |    prithamsandhu41     | prithamsandhu41  |   Software Architect   |             Yes             |
|   #6    | Tushin Kulshreshtha  | tkulshreshtha@sfsu.edu |       Dextron04        |      dxtrn       |      Backend Lead      |             Yes             |
|   #7    |      Yikang Xu       |     yxu26@sfsu.edu     |         yixu12         |      cchees      |     GitHub Master      |             Yes             |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Why Choose SerialPM?

- **Visual-First Approach**: Unlike text-heavy project management tools, SerialPM prioritizes visual representation
- **Developer-Friendly**: Built by developers, for developers, with seamless GitHub integration
- **Self-Hostable**: Complete control over your data and customizations
- **Open Source**: Transparent, community-driven development
- **Modern Stack**: Built with the latest technologies for performance and scalability
- **Team-Focused**: Designed around real team collaboration patterns

---

## 🚀 Get Started Today

Ready to transform your project management?

**[Visit SerialPM Live Demo →](https://serialpm.tech)**

Experience the future of visual project management with SerialPM!

---

© 2025 Zero Two 02. All rights reserved.

No part of this repository may be reproduced, distributed, or transmitted in any form or by any means,
including photocopying, recording, or other electronic or mechanical methods, without the prior written
permission of the instructor or team.

---
