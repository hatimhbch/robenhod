# Robenhod - Professional Story Platform

**Live Demo**: [robenhod.com](https://robenhod.com) *(Coming Soon)*

A full-stack web application demonstrating modern Java enterprise development practices with Spring Boot, built for content creators and readers.

## Project Overview

Robenhod is a professional blogging platform showcasing enterprise-level Java development skills:
- **Full-Stack Architecture**: Complete separation of concerns with REST API backend
- **Enterprise Security**: JWT authentication with email confirmation workflow
- **Database Design**: Relational database with JPA/Hibernate ORM
- **Modern Frontend**: SolidJS client consuming REST APIs
- **Production-Ready**: Configured for deployment with proper error handling

### Core Features
- **Content Management**: Create, read, update, delete articles with rich text support
- **User Authentication**: Secure registration, login, and account activation via email
- **Social Features**: Article likes/reactions with real-time count updates
- **User Profiles**: Personal dashboards and public author pages
- **Responsive Design**: Mobile-first approach with modern UI/UX

## Features

### For Writers
- **Write Articles**: Create beautiful stories with text and images
- **Personal Profile**: Show your articles and build your writing identity
- **Easy Publishing**: Simple editor to write and format your content
- **Manage Content**: Edit or delete your articles anytime

### For Readers
- **Read Stories**: Browse articles from different writers
- **Like Articles**: Show appreciation for good content
- **Discover Writers**: Find new authors and their work
- **Clean Reading**: Beautiful, distraction-free reading experience

### Security
- **Safe Login**: Secure user accounts with email confirmation
- **Protected Content**: Only logged-in users can write articles
- **Personal Data**: Each user can only edit their own articles

## Technical Architecture

### Backend (Java Enterprise Stack) 🎯
- **Spring Boot 3.4.5**: Enterprise application framework with auto-configuration
- **Spring Security**: JWT-based authentication with role-based access control
- **Spring Data JPA**: Database abstraction with Hibernate ORM
- **PostgreSQL**: Relational database with proper schema design
- **Maven**: Dependency management and build automation
- **Java 21**: Latest LTS features for modern development
- **Email Service Integration**: Automated user confirmation workflows
- **RESTful API Design**: Clean HTTP endpoints following REST principles
- **Exception Handling**: Global error management with custom exceptions
- **Validation**: Input validation using Bean Validation (JSR-303)

### Frontend (Modern Web Stack)
- **SolidJS**: Reactive framework for dynamic user interfaces
- **TypeScript**: Type-safe development for better code quality
- **Tailwind CSS**: Utility-first styling for responsive design
- **REST Client**: HTTP services consuming backend APIs

## How to Start the Project

### What You Need
- **Java 21** (for backend)
- **Node.js** (for frontend)
- **PostgreSQL** database

### Setup Steps

1. **Clone the project**
   ```bash
   git clone <your-repo-url>
   cd robenhod
   ```

2. **Setup Database**
   - Install PostgreSQL
   - Create a database called `registration`
   - Update database settings in `backend/src/main/resources/application.yml`

3. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will run on http://localhost:8080

4. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The website will open on http://localhost:3000

### Environment Setup
You need to add these settings in `application.yml`:
- Database connection details
- Email service configuration (for user confirmation)
- JWT secret key
- Application URL

## Project Structure

```
robenhod/
├── frontend/          # Website interface (what users see)
│   ├── src/
│   │   ├── components/    # Reusable parts of the website
│   │   ├── routes/        # Different pages
│   │   └── services/      # Communication with backend
│   └── package.json
├── backend/           # Server application
│   ├── src/main/java/     # Java code
│   │   ├── controller/    # Handle web requests
│   │   ├── model/         # Data structures
│   │   ├── service/       # Business logic
│   │   └── security/      # Login and safety
│   └── pom.xml
└── README.md
```

## Main Pages

- **Home**: Browse all articles
- **Login/Signup**: Create account or sign in
- **Write**: Create new articles (logged-in users only)
- **Profile**: Manage your articles
- **Article View**: Read individual stories
- **About**: Learn about the platform

## For Developers

This project uses modern web development practices:
- **Clean Code**: Well-organized and documented
- **Security**: JWT tokens and password encryption
- **Responsive**: Works on phones, tablets, and computers
- **Fast Loading**: Optimized for good performance
- **User-Friendly**: Simple and intuitive design

## Contributing

If you want to help improve this project:
1. Fork the repository
2. Make your changes
3. Test everything works
4. Submit a pull request

## License

This project is created for learning and demonstration purposes.

---

**Built with ❤️ by Hatim** - A platform to share stories and connect writers with readers. 