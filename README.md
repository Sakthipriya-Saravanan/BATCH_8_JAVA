# Campus Resource Management System

A full-stack web application for managing campus resources (Labs, Classrooms, Event Halls), with role-based access for Students, Staff, and Admins.

## Tech Stack
- **Frontend**: React + Vite + Bootstrap 5 (Dark Mode)
- **Backend**: Spring Boot (Java 17+) + Spring Data JPA
- **Database**: PostgreSQL (Supabase)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven (v3.6+)
- PostgreSQL Database (e.g., Supabase)

### 1. Database Setup
Create a PostgreSQL database (e.g., on Supabase). Note down the connection string, username, and password.

### 2. Backend Setup
Navigate to the `backend` folder:
```bash
cd backend
```

Set the following environment variables (Windows PowerShell example):
```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://your-db-host:5432/your-db-name"
$env:SPRING_DATASOURCE_USERNAME="your-db-user"
$env:SPRING_DATASOURCE_PASSWORD="your-db-password"
```

Run the application using Maven:
```bash
mvn spring-boot:run
# The server will start at http://localhost:8080
```
*(Note: If `mvn` is not installed, use your IDE's run configuration)*

### 3. Frontend Setup
Navigate to the `frontend` folder:
```bash
cd frontend
```

Install dependencies and start the dev server:
```bash
npm install
npm run dev
# The app will be available at http://localhost:5173
```

## Features for Testing

### Login (Demo Auth)
- **Create a Student**: Login with `student@campus.edu` (select "Student" role)
- **Create a Staff**: Login with `staff@campus.edu` (select "Staff" role)
- **Create an Admin**: Login with `admin@campus.edu` (select "Admin" role)
*(Password can be anything in demo mode)*

### Top Features
1. **Admin Dashboard**: View total stats, manage users/resources.
2. **Booking System**: Create bookings (Students/Staff), Approve/Reject (Staff/Admin).
3. **CSV Export**: Admins can export booking data from the Bookings page.
4. **Resources**: Managers can add/edit resources (e.g., "Physics Lab", "Auditorium").

## Deployment
See [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) for detailed deployment instructions (Render/Railway/Vercel).
