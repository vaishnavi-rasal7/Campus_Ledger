package com.example.studentmanagement.repository;

import com.example.studentmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByDepartmentIgnoreCase(String department);

    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department ORDER BY s.department ASC")
    List<Object[]> countStudentsGroupedByDepartment();

    List<Student> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}
