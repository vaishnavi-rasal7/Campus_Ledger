# Campus Ledger — Student Record Management System

> **A. P. Shah Institute of Technology (APSIT) — Department of Information Technology**  
> **Course:** Mini Project FSJP Lab (SE IT — Semester III)  
> **Assignment No. 2:** Full Stack Java Programming Mini Project  

---

## 1. Project Overview

**Campus Ledger** is an academic Student Record Management System built with a **React.js** frontend, a **Spring Boot 3** REST API backend, and a **MySQL 8** relational database integrated via **Spring Data JPA**.

The interface is designed with a refined, calm, editorial university administration aesthetic featuring warm ivory surfaces, deep charcoal typography, forest green primary accents, and subtle borders — avoiding generic AI dashboard templates.

### Key Capabilities
- **Full CRUD REST APIs:** Create, Read, Update, and Delete student records with persistent MySQL storage.
- **Dynamic Multi-Field Search:** Real-time search across student ID, name, and email address.
- **Department Aggregations:** Automatic calculation and grouping of student populations across academic branches.
- **Defensive Error Handling:** RFC 7807-style error responses with `@ControllerAdvice` and Jakarta Bean Validation.
- **Live System Telemetry:** Genuine backend health endpoint distinguishing Spring Boot uptime from active MySQL database connectivity.
- **Responsive Architecture:** Desktop sidebar navigation with an off-canvas drawer for mobile and tablet screens.

---

## 2. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, React Router v6, Lucide React, Plain CSS Modules, Vite 5 |
| **Backend** | Java 17 LTS, Spring Boot 3.2.5, Spring Web, Spring Data JPA, Hibernate ORM |
| **Database** | MySQL 8.x Server (`studentdb`), H2 in-memory/file engine for tests & standalone dev |
| **Build & Tooling** | Apache Maven 3.9, Node.js 20, JUnit 5, Mockito, MockMvc |

---

## 3. Project Structure

```text
Dumbo/
├── backend/                             # Spring Boot 3 REST API Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/studentmanagement/
│   │   │   │   ├── StudentManagementApplication.java
│   │   │   │   ├── controller/          # StudentController, HealthController
│   │   │   │   ├── service/             # StudentService (transactional logic)
│   │   │   │   ├── repository/          # StudentRepository (JpaRepository)
│   │   │   │   ├── entity/              # Student.java (JPA @Entity)
│   │   │   │   ├── dto/                 # Request/Response/Summary DTOs
│   │   │   │   ├── exception/           # GlobalExceptionHandler & ErrorResponse
│   │   │   │   └── config/              # WebMvcConfig (CORS), DataInitializer
│   │   │   └── resources/
│   │   │       ├── application.properties      # Default MySQL configuration
│   │   │       ├── application-dev.properties  # Standalone dev mode
│   │   │       └── application-prod.properties # Cloud deployment config
│   │   └── test/                        # Comprehensive JUnit 5 test suite
│   ├── pom.xml
│   └── .env.example
├── frontend/                            # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/studentApi.js            # Centralized API service layer
│   │   ├── components/                  # Tables, Forms, Dialogs, Badges, Search
│   │   ├── layouts/AppLayout.jsx        # App Shell with Header & Sidebar
│   │   ├── pages/                       # Dashboard, Directory, Add, Edit, Details, Depts, Settings, 404
│   │   ├── styles/                      # Variables, Layout, Components, Pages CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── schema.sql                       # MySQL table creation & seed script
├── ARCHITECTURE.md                      # Architecture diagram and layer breakdown
├── VERIFICATION_REPORT.md               # Complete automated test execution report
├── DEPLOYMENT.md                        # Production cloud deployment guide
└── README.md
```

---

## 4. Local Setup Instructions

### Prerequisites
- **Java Development Kit (JDK 17 LTS or newer)**
- **Apache Maven (3.8+)**
- **Node.js (18+ or 20 LTS)** and **npm**
- **MySQL 8.x Server** (Optional for initial demo if using dev standalone profile)

---

### Step 1: Initialize MySQL Database

Open MySQL Workbench or MySQL CLI:

```sql
CREATE DATABASE IF NOT EXISTS studentdb;
USE studentdb;

CREATE TABLE IF NOT EXISTS students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

*(You can also execute `database/schema.sql` which includes sample seed records.)*

---

### Step 2: Configure and Run the Backend

Navigate to the `backend/` directory:

```bash
cd backend
```

#### Option A: Run with Local MySQL Server
Ensure your MySQL service is running on `localhost:3306`. If your root password differs, pass it via environment variable or command line:

```bash
# Windows PowerShell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
mvn spring-boot:run
```

#### Option B: Run Standalone Development Mode (No MySQL Required)
If you want to immediately demonstrate the application without setting up MySQL first, run with the `dev` profile (uses an embedded persistent database with sample student records):

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The Spring Boot backend will start on **`http://localhost:8080`**.

Verify backend health in your browser or curl:
```bash
curl http://localhost:8080/api/health
```

---

### Step 3: Configure and Run the Frontend

In a second terminal window, navigate to `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

Vite will start the React development server:
```
  VITE v5.4.21  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **`http://localhost:5173`** in your browser.

---

## 5. REST API Documentation

### Base URL: `http://localhost:8080/api`

| Endpoint | Method | Description | Success Status | Sample Payload |
|---|---|---|---|---|
| `/health` | `GET` | Service & DB status | `200 OK` | `{"status":"UP","databaseConnected":true,...}` |
| `/students` | `GET` | Get all students | `200 OK` | `[{"id":1,"name":"Aarav Mehta",...}]` |
| `/students/{id}` | `GET` | Get single student | `200 OK` | `{"id":1,"name":"Aarav Mehta",...}` |
| `/students` | `POST` | Create student | `201 Created` | `{"name":"Tanvi","email":"tanvi@edu","department":"IT"}` |
| `/students/{id}` | `PUT` | Update student | `200 OK` | `{"name":"Tanvi K","email":"tanvi@edu","department":"IT"}` |
| `/students/{id}` | `DELETE` | Delete student | `204 No Content`| *Empty body* |
| `/departments` | `GET` | Dept breakdown | `200 OK` | `[{"department":"IT","studentCount":4}]` |

---

## 6. Running Test Suites

### Backend Unit & Integration Tests (20 Tests)
```bash
cd backend
mvn test
```
*Executes tests for all controllers, services, repositories, Bean Validation, and error handlers using in-memory test database.*

### Frontend Tests (7 Tests)
```bash
cd frontend
npm test
```
*Executes tests for input validation, regex checks, search filtering, pagination math, and API error formatting.*

---

## 7. Viva & Practical Exam Questions Guide

For your Semester III lab viva, instructors frequently ask:

1. **Q: How does Spring Data JPA simplify database operations?**  
   *A:* By extending `JpaRepository<Student, Long>`, Spring Data JPA automatically provides ready-to-use implementations of `findAll()`, `findById()`, `save()`, and `deleteById()` without writing manual boilerplate SQL queries or JDBC connection handling.

2. **Q: Why use DTOs instead of passing Entity objects directly to the controller?**  
   *A:* DTOs (`StudentRequest`, `StudentResponse`) separate internal database representation from the external API contract, prevent mass-assignment vulnerabilities, avoid exposing internal database identifiers during creation, and allow field-level Jakarta Bean Validation annotations (`@NotBlank`, `@Email`, `@Size`).

3. **Q: How is CORS handled?**  
   *A:* Through `WebMvcConfig.java` implementing `WebMvcConfigurer`. It centralizes allowed origins (`http://localhost:5173`) and allowed HTTP methods (`GET, POST, PUT, DELETE, OPTIONS`), avoiding insecure wildcard origins in production.

4. **Q: How does the React frontend synchronize state after an update or delete?**  
   *A:* After a successful `PUT` or `DELETE` request, the component re-triggers the asynchronous `fetchStudents()` method via the centralized `studentApi.js` service, fetching fresh records directly from the database and updating React state (`useState`).
