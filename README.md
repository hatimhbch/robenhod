# Robenhod - Story Platform

A simple and modern platform where people can write and share their stories with others.

## What is Robenhod?

Robenhod is a website where writers can:
- Write and publish articles
- Share their stories with the world
- Read stories from other writers
- Like articles they enjoy
- Create their own profile

It's like a blog platform, but designed to be simple and beautiful for everyone to use.

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

## Technology

### Frontend (What users see)
- **SolidJS**: Modern web framework for fast, interactive pages
- **TypeScript**: Better code quality and fewer bugs
- **Tailwind CSS**: Beautiful, responsive design
- **Modern Design**: Clean and easy to use interface

### Backend (Server)
- **Spring Boot**: Java framework for reliable server
- **PostgreSQL**: Database to store articles and user data
- **JWT Authentication**: Secure login system
- **Email Confirmation**: Verify new user accounts
- **REST API**: Clean communication between frontend and backend

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