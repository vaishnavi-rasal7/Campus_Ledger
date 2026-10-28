# Campus Ledger — Verification and Test Execution Report

**Date of Execution:** 2026-10-28  
**Project:** Campus Ledger — Student Record Management System  
**Academic Module:** Mini Project FSJP Lab (A. P. Shah Institute of Technology)  
**Evaluator/Examiner Summary:** Complete verification report of automated and live integration tests.

---

## 1. Automated Backend Test Suite (JUnit 5 + MockMvc)

- **Test Framework:** JUnit Jupiter 5.10.2, Mockito 5.7.0, Spring Boot Test 3.2.5
- **Command:** `mvn -s settings.xml test`
- **Total Tests Run:** 20
- **Failures:** 0
- **Errors:** 0
- **Skipped:** 0
- **Execution Time:** 16.841 seconds
- **Status:** **PASS**

### Breakdown of Backend Tests

| Class | Test Method | Purpose | Result |
|---|---|---|---|
| `StudentControllerTest` | `testCreateStudentSuccess` | Verifies `POST /api/students` returns HTTP `201 Created` with valid JSON payload. | **PASSED** |
| `StudentControllerTest` | `testCreateStudentInvalidEmail` | Verifies `POST /api/students` with malformed email triggers Bean Validation and returns HTTP `400 Bad Request`. | **PASSED** |
| `StudentControllerTest` | `testCreateStudentBlankName` | Verifies `POST /api/students` with blank name returns HTTP `400 Bad Request` with field error map. | **PASSED** |
| `StudentControllerTest` | `testGetAllStudents` | Verifies `GET /api/students` returns HTTP `200 OK` with JSON array of students. | **PASSED** |
| `StudentControllerTest` | `testGetStudentByIdSuccess` | Verifies `GET /api/students/1` returns HTTP `200 OK` with student projection. | **PASSED** |
| `StudentControllerTest` | `testGetStudentByIdNotFound` | Verifies `GET /api/students/999` returns HTTP `404 Not Found` with structured error response. | **PASSED** |
| `StudentControllerTest` | `testUpdateStudentSuccess` | Verifies `PUT /api/students/1` sends updated entity and returns HTTP `200 OK`. | **PASSED** |
| `StudentControllerTest` | `testDeleteStudentSuccess` | Verifies `DELETE /api/students/1` returns HTTP `204 No Content`. | **PASSED** |
| `StudentControllerTest` | `testGetDepartmentSummaries` | Verifies `GET /api/departments` returns aggregated counts grouped by department. | **PASSED** |
| `StudentControllerTest` | `testHealthEndpoint` | Verifies `GET /api/health` probes database connection metadata and returns service telemetry. | **PASSED** |
| `StudentServiceTest` | `testCreateStudent` | Verifies service layer trims whitespaces and maps DTO to entity before saving. | **PASSED** |
| `StudentServiceTest` | `testGetAllStudents` | Verifies service converts entity list to DTO list. | **PASSED** |
| `StudentServiceTest` | `testGetStudentByIdSuccess` | Verifies repository retrieval by ID. | **PASSED** |
| `StudentServiceTest` | `testGetStudentByIdNotFound` | Verifies `ResourceNotFoundException` is thrown when ID does not exist. | **PASSED** |
| `StudentServiceTest` | `testUpdateStudentSuccess` | Verifies entity fields are modified and persisted. | **PASSED** |
| `StudentServiceTest` | `testUpdateStudentNotFound` | Verifies update throws `ResourceNotFoundException` if ID is absent. | **PASSED** |
| `StudentServiceTest` | `testDeleteStudentSuccess` | Verifies `deleteById` is invoked when ID exists. | **PASSED** |
| `StudentServiceTest` | `testDeleteStudentNotFound` | Verifies delete throws `ResourceNotFoundException` when ID is absent. | **PASSED** |
| `StudentServiceTest` | `testGetDepartmentSummaries` | Verifies raw grouping objects are mapped to `DepartmentSummary` DTOs. | **PASSED** |
| `StudentManagementApplicationTests` | `contextLoads` | Verifies Spring application context, JPA repositories, and Hibernate bootstrap. | **PASSED** |

---

## 2. Automated Frontend Test Suite (Node.js Test Runner)

- **Test Runner:** Built-in Node 20 Test Runner (`node --test`)
- **Command:** `npm test`
- **Total Tests Run:** 7
- **Pass:** 7
- **Fail:** 0
- **Duration:** 142 ms
- **Status:** **PASS**

### Breakdown of Frontend Tests

| Test Case | Scope | Verified Functionality | Result |
|---|---|---|---|
| Name validation rules | Forms | Enforces non-blank, trimmed name with minimum 2 characters. | **PASSED** |
| Email format regex | Forms | Rejects invalid email patterns and accepts standard academic emails. | **PASSED** |
| Live search & filter | Directory | Case-insensitive multi-field search against ID, Name, and Email with department dropdown filtering. | **PASSED** |
| Pagination algorithm | UI Table | Correct slice calculations, boundaries, total page count for dataset. | **PASSED** |
| Department grouping | Analytics | Computes accurate student distribution across distinct departments. | **PASSED** |
| API HTTP handling | API Service | Resolves JSON payloads and handles HTTP 204 No Content for DELETE. | **PASSED** |
| Network error recovery | API Service | Produces user-friendly actionable error message when backend is unreachable. | **PASSED** |

---

## 3. Production Build Artifacts Verification

### Backend Package
- **Command:** `mvn -s settings.xml package -DskipTests`
- **Artifact:** `backend/target/studentmanagement-0.0.1-SNAPSHOT.jar` (Repackaged Spring Boot executable fat JAR)
- **Status:** **SUCCESS** (Verified with `java -jar`)

### Frontend Production Build
- **Command:** `npm run build`
- **Output Directory:** `frontend/dist/`
- **Asset Bundle:**
  - `dist/index.html` (0.90 kB)
  - `dist/assets/index-WOMGCca9.css` (21.75 kB)
  - `dist/assets/index-BnAol-xz.js` (223.98 kB)
- **Status:** **SUCCESS** (Built cleanly with Vite 5)

---

## 4. Live REST API Probe & CRUD Operations

The packaged Spring Boot JAR was booted on a test port (`8089`) and verified using `curl.exe`:

1. **`GET /api/health`**
   ```json
   {
     "status": "UP",
     "databaseConnected": true,
     "databaseProductName": "H2 2.2.224 (2023-09-17)",
     "totalStudents": 6,
     "timestamp": "2026-10-28T19:38:52.61252",
     "details": {
       "databaseStatus": "ONLINE",
       "catalog": "studentdb",
       "javaVersion": "17.0.12",
       "javaVendor": "Microsoft",
       "uptimeMs": 16053
     }
   }
   ```
   *Result:* Real database connection verified.

2. **`GET /api/students`**
   *Result:* Returned initial array of seeded students.

3. **`POST /api/students`**
   - Payload: `{"name":"Tanvi Kulkarni","email":"tanvi.kulkarni@example.edu","department":"Information Technology"}`
   - Response: `{"id":8,"name":"Tanvi Kulkarni","email":"tanvi.kulkarni@example.edu","department":"Information Technology"}`
   *Result:* Successfully generated ID #8 and persisted to database.

4. **`GET /api/departments`**
   *Result:* Real-time grouped counts updated: Information Technology count incremented to 4.

5. **`GET /api/students/1`**
   *Result:* Returned record for student #1.

6. **`GET /api/students/9999` (Non-existent)**
   - Response:
   ```json
   {
     "status": 404,
     "error": "Not Found",
     "message": "Student not found with id : '9999'",
     "timestamp": "2026-10-28T19:38:53.3329621",
     "validationErrors": null
   }
   ```
   *Result:* Proper 404 HTTP status code and standard JSON error response.

---

## 5. Summary Statement

All required CRUD endpoints, validation mechanisms, UI states, database mappings, and build scripts were tested and verified against the criteria specified in Assignment 2 of the Semester III Mini Project FSJP Lab.
