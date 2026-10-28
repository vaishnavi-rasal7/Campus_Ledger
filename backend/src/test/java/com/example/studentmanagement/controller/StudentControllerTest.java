package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.DepartmentSummary;
import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.dto.StudentResponse;
import com.example.studentmanagement.exception.GlobalExceptionHandler;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.StudentRepository;
import com.example.studentmanagement.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.Arrays;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = {StudentController.class, HealthController.class})
@Import(GlobalExceptionHandler.class)
@org.springframework.test.context.ActiveProfiles("test")
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentService studentService;

    @MockBean
    private DataSource dataSource;

    @MockBean
    private StudentRepository studentRepository;

    @Test
    @DisplayName("POST /api/students should return 201 Created when valid")
    void testCreateStudentSuccess() throws Exception {
        StudentRequest request = new StudentRequest("Neha Verma", "neha.verma@example.edu", "Information Technology");
        StudentResponse response = new StudentResponse(10L, "Neha Verma", "neha.verma@example.edu", "Information Technology");

        when(studentService.createStudent(any(StudentRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(10)))
                .andExpect(jsonPath("$.name", is("Neha Verma")))
                .andExpect(jsonPath("$.email", is("neha.verma@example.edu")))
                .andExpect(jsonPath("$.department", is("Information Technology")));
    }

    @Test
    @DisplayName("POST /api/students should return 400 Bad Request when email is invalid")
    void testCreateStudentInvalidEmail() throws Exception {
        StudentRequest request = new StudentRequest("Neha Verma", "not-a-valid-email", "Information Technology");

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.validationErrors.email", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/students should return 400 Bad Request when name is blank")
    void testCreateStudentBlankName() throws Exception {
        StudentRequest request = new StudentRequest("", "valid@example.edu", "Information Technology");

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.name", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/students should return list of students")
    void testGetAllStudents() throws Exception {
        StudentResponse s1 = new StudentResponse(1L, "Alice", "alice@example.edu", "IT");
        StudentResponse s2 = new StudentResponse(2L, "Bob", "bob@example.edu", "CS");

        when(studentService.getAllStudents()).thenReturn(Arrays.asList(s1, s2));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Alice")))
                .andExpect(jsonPath("$[1].name", is("Bob")));
    }

    @Test
    @DisplayName("GET /api/students/{id} should return student when found")
    void testGetStudentByIdSuccess() throws Exception {
        StudentResponse s1 = new StudentResponse(1L, "Alice", "alice@example.edu", "IT");

        when(studentService.getStudentById(1L)).thenReturn(s1);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Alice")));
    }

    @Test
    @DisplayName("GET /api/students/{id} should return 404 when not found")
    void testGetStudentByIdNotFound() throws Exception {
        when(studentService.getStudentById(999L))
                .thenThrow(new ResourceNotFoundException("Student", "id", 999L));

        mockMvc.perform(get("/api/students/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.message", containsString("Student not found with id : '999'")));
    }

    @Test
    @DisplayName("PUT /api/students/{id} should return 200 OK with updated record")
    void testUpdateStudentSuccess() throws Exception {
        StudentRequest updateReq = new StudentRequest("Alice Smith", "alice.smith@example.edu", "Computer Engineering");
        StudentResponse updatedRes = new StudentResponse(1L, "Alice Smith", "alice.smith@example.edu", "Computer Engineering");

        when(studentService.updateStudent(eq(1L), any(StudentRequest.class))).thenReturn(updatedRes);

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Alice Smith")))
                .andExpect(jsonPath("$.department", is("Computer Engineering")));
    }

    @Test
    @DisplayName("DELETE /api/students/{id} should return 204 No Content")
    void testDeleteStudentSuccess() throws Exception {
        doNothing().when(studentService).deleteStudent(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isNoContent());

        verify(studentService, times(1)).deleteStudent(1L);
    }

    @Test
    @DisplayName("GET /api/departments should return department summaries")
    void testGetDepartmentSummaries() throws Exception {
        DepartmentSummary d1 = new DepartmentSummary("Information Technology", 12);
        DepartmentSummary d2 = new DepartmentSummary("Computer Engineering", 15);

        when(studentService.getDepartmentSummaries()).thenReturn(Arrays.asList(d1, d2));

        mockMvc.perform(get("/api/departments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].department", is("Information Technology")))
                .andExpect(jsonPath("$[0].studentCount", is(12)));
    }

    @Test
    @DisplayName("GET /api/health should return 200 OK and database status")
    void testHealthEndpoint() throws Exception {
        Connection mockConn = mock(Connection.class);
        DatabaseMetaData mockMeta = mock(DatabaseMetaData.class);

        when(dataSource.getConnection()).thenReturn(mockConn);
        when(mockConn.getMetaData()).thenReturn(mockMeta);
        when(mockMeta.getDatabaseProductName()).thenReturn("H2");
        when(mockMeta.getDatabaseProductVersion()).thenReturn("2.2.224");
        when(mockConn.getCatalog()).thenReturn("testdb");
        when(studentRepository.count()).thenReturn(5L);

        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.databaseConnected", is(true)))
                .andExpect(jsonPath("$.totalStudents", is(5)));
    }
}
