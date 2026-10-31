# 🏨 Hostel Management System

A full-stack web application designed to simplify and manage hostel operations, including student records, room management, and bed allocations.

The system provides a centralized platform for managing hostel information through an Angular frontend and a Spring Boot REST API connected to a MySQL database.

## 🚀 Features

- **Dashboard** – Overview of hostel management information.
- **Student Management** – Add, view, update, search, and delete student records.
- **Room Management** – Manage hostel room information.
- **Bed Allocation** – Allocate beds to students and manage allocation records.
- **REST API Integration** – Communication between frontend and backend.
- **Database Integration** – Persistent data storage using MySQL.
- **Authentication Support** – Spring Security and JWT-related backend components.

## 🛠️ Technologies Used

### Frontend
- Angular
- TypeScript
- HTML5
- CSS3
- Bootstrap / Angular Material

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- REST APIs
- JSON Web Token (JWT)

### Database & Tools
- MySQL
- Maven
- Git
- GitHub
- Visual Studio Code
- IntelliJ IDEA / Eclipse

## 🏗️ Project Architecture

The application follows a frontend-backend architecture:

1. **Angular Frontend:** Provides the user interface and sends HTTP requests.
2. **Spring Boot Backend:** Handles business logic and REST API requests.
3. **MySQL Database:** Stores student, room, and allocation information.

## 📂 Project Structure

```text
projects/
│
├── hostel-management/                 # Angular Frontend
│   ├── src/
│   │   └── app/
│   │       ├── dashboard/
│   │       ├── students/
│   │       ├── rooms/
│   │       ├── allocation/
│   │       └── services/
│   ├── angular.json
│   └── package.json
│
├── hostel-management-backend/         # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/hostel/hostel_management/
│   │       │       ├── controller/
│   │       │       ├── entity/
│   │       │       ├── repository/
│   │       │       ├── service/
│   │       │       └── auth/
│   │       └── resources/
│   └── pom.xml
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the application:

- Node.js and npm
- Angular CLI
- Java JDK
- MySQL Server
- Maven

### 1. Clone the Repository

```bash
git clone https://github.com/PSatish166/hostel-management-system.git
cd hostel-management-system
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE hostel_management;
```

Configure your database connection in:

`hostel-management-backend/src/main/resources/application.properties`

Example configuration:

```properties
spring.application.name=hostel-management

spring.datasource.url=jdbc:mysql://localhost:3306/hostel_management?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

server.port=8080
```

**Important:** Replace the username and password with your own MySQL credentials. Do not commit your actual credentials to GitHub.

### 3. Run the Backend

Open a terminal in:

```text
hostel-management-backend
```

Run:

```bash
.\mvnw.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open another terminal in:

```text
hostel-management
```

Install dependencies:

```bash
npm install
```

Start Angular:

```bash
ng serve --port 4200
```

Frontend URL:

```text
http://localhost:4200/
```

## 🔗 Backend API Endpoints

| Module | Endpoint |
|---|---|
| Students | `/api/students` |
| Rooms | `/api/rooms` |
| Allocations | `/api/allocations` |

## 🔒 Security

The backend includes Spring Security and JWT-related authentication components. Configure and verify the authentication flow before using the application in a production environment.

## 🎯 Project Objective

The main objective of this project is to develop a centralized hostel management platform that reduces manual administrative work and makes student records, room information, and bed allocations easier to manage.

## 👨‍💻 Developer

**Satish Perala**

- GitHub: [PSatish166](https://github.com/PSatish166)
- LinkedIn: [Satish Perala](https://www.linkedin.com/in/satish-perala)

---

⭐ If you find this project useful, consider giving the repository a star!
