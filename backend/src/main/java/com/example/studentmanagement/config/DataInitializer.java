package com.example.studentmanagement.config;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final StudentRepository studentRepository;

    public DataInitializer(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        try {
            if (studentRepository.count() == 0) {
                log.info("Database is empty. Populating seed student records for demonstration...");
                List<Student> initialStudents = Arrays.asList(
                        new Student("Aarav Mehta", "aarav.mehta@example.edu", "Information Technology"),
                        new Student("Ananya Iyer", "ananya.iyer@example.edu", "Computer Engineering"),
                        new Student("Rohan Deshmukh", "rohan.deshmukh@example.edu", "Information Technology"),
                        new Student("Pooja Kulkarni", "pooja.kulkarni@example.edu", "Artificial Intelligence & Data Science"),
                        new Student("Siddharth Patil", "siddharth.patil@example.edu", "Computer Engineering"),
                        new Student("Meera Nair", "meera.nair@example.edu", "Information Technology"),
                        new Student("Kabir Sharma", "kabir.sharma@example.edu", "Electronics & Telecommunication")
                );

                studentRepository.saveAll(initialStudents);
                log.info("Successfully seeded {} student records.", initialStudents.size());
            } else {
                log.info("Database already contains {} student records. Skipping seed step.", studentRepository.count());
            }
        } catch (Exception ex) {
            log.warn("DataInitializer skipped seeding due to database condition: {}", ex.getMessage());
        }
    }
}
