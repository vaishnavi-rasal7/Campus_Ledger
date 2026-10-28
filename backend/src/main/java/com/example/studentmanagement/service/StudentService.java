package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.DepartmentSummary;
import com.example.studentmanagement.dto.StudentRequest;
import com.example.studentmanagement.dto.StudentResponse;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentResponse createStudent(StudentRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (studentRepository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("A student with email '" + cleanEmail + "' is already registered");
        }

        Student student = new Student();
        student.setName(request.getName().trim());
        student.setEmail(cleanEmail);
        student.setDepartment(request.getDepartment().trim());

        Student saved = studentRepository.save(student);
        return StudentResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(StudentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return StudentResponse.fromEntity(student);
    }

    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        String cleanEmail = request.getEmail().trim().toLowerCase();
        studentRepository.findByEmailIgnoreCase(cleanEmail).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("A student with email '" + cleanEmail + "' is already registered to another record");
            }
        });

        student.setName(request.getName().trim());
        student.setEmail(cleanEmail);
        student.setDepartment(request.getDepartment().trim());

        Student updated = studentRepository.save(student);
        return StudentResponse.fromEntity(updated);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student", "id", id);
        }
        studentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<DepartmentSummary> getDepartmentSummaries() {
        List<Object[]> rawGroups = studentRepository.countStudentsGroupedByDepartment();
        List<DepartmentSummary> summaries = new ArrayList<>();
        for (Object[] row : rawGroups) {
            String department = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            summaries.add(new DepartmentSummary(department, count));
        }
        return summaries;
    }

    @Transactional(readOnly = true)
    public long getTotalStudentsCount() {
        return studentRepository.count();
    }
}
