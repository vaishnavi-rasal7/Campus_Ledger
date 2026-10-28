package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.DepartmentSummary;
import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.dto.StudentResponse;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    private Student student1;
    private Student student2;

    @BeforeEach
    void setUp() {
        student1 = new Student(1L, "Rahul Sharma", "rahul.sharma@example.edu", "Information Technology");
        student2 = new Student(2L, "Priya Patel", "priya.patel@example.edu", "Computer Engineering");
    }

    @Test
    @DisplayName("Should create student successfully and trim inputs")
    void testCreateStudent() {
        StudentRequest request = new StudentRequest("  Rahul Sharma  ", "  Rahul.Sharma@example.edu  ", "  Information Technology  ");
        when(studentRepository.save(any(Student.class))).thenReturn(student1);

        StudentResponse response = studentService.createStudent(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Rahul Sharma");
        assertThat(response.getEmail()).isEqualTo("rahul.sharma@example.edu");
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("Should retrieve all students")
    void testGetAllStudents() {
        when(studentRepository.findAll()).thenReturn(Arrays.asList(student1, student2));

        List<StudentResponse> list = studentService.getAllStudents();

        assertThat(list).hasSize(2);
        assertThat(list.get(0).getName()).isEqualTo("Rahul Sharma");
        assertThat(list.get(1).getName()).isEqualTo("Priya Patel");
    }

    @Test
    @DisplayName("Should retrieve student by ID")
    void testGetStudentByIdSuccess() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student1));

        StudentResponse response = studentService.getStudentById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getEmail()).isEqualTo("rahul.sharma@example.edu");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when student ID not found")
    void testGetStudentByIdNotFound() {
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Student not found with id : '999'");
    }

    @Test
    @DisplayName("Should update existing student successfully")
    void testUpdateStudentSuccess() {
        StudentRequest updateReq = new StudentRequest("Rahul S. Sharma", "rahul.new@example.edu", "Artificial Intelligence");
        Student updatedEntity = new Student(1L, "Rahul S. Sharma", "rahul.new@example.edu", "Artificial Intelligence");

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student1));
        when(studentRepository.save(any(Student.class))).thenReturn(updatedEntity);

        StudentResponse response = studentService.updateStudent(1L, updateReq);

        assertThat(response.getName()).isEqualTo("Rahul S. Sharma");
        assertThat(response.getDepartment()).isEqualTo("Artificial Intelligence");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when updating nonexistent student")
    void testUpdateStudentNotFound() {
        StudentRequest updateReq = new StudentRequest("Ghost", "ghost@example.edu", "IT");
        when(studentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.updateStudent(999L, updateReq))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Should delete student when ID exists")
    void testDeleteStudentSuccess() {
        when(studentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(1L);

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting nonexistent student")
    void testDeleteStudentNotFound() {
        when(studentRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> studentService.deleteStudent(999L))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(studentRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Should return grouped department summaries")
    void testGetDepartmentSummaries() {
        List<Object[]> rawGroup = Arrays.asList(
                new Object[]{"Computer Engineering", 5L},
                new Object[]{"Information Technology", 8L}
        );
        when(studentRepository.countStudentsGroupedByDepartment()).thenReturn(rawGroup);

        List<DepartmentSummary> summaries = studentService.getDepartmentSummaries();

        assertThat(summaries).hasSize(2);
        assertThat(summaries.get(0).getDepartment()).isEqualTo("Computer Engineering");
        assertThat(summaries.get(0).getStudentCount()).isEqualTo(5L);
        assertThat(summaries.get(1).getDepartment()).isEqualTo("Information Technology");
        assertThat(summaries.get(1).getStudentCount()).isEqualTo(8L);
    }
}
