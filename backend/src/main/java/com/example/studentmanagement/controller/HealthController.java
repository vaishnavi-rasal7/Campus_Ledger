package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.HealthResponse;
import com.example.studentmanagement.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    private final DataSource dataSource;
    private final StudentRepository studentRepository;

    public HealthController(DataSource dataSource, StudentRepository studentRepository) {
        this.dataSource = dataSource;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> getHealth() {
        boolean dbConnected = false;
        String dbProduct = "Unknown";
        long totalStudents = 0;
        Map<String, Object> details = new HashMap<>();

        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            dbProduct = metaData.getDatabaseProductName() + " " + metaData.getDatabaseProductVersion();
            dbConnected = true;
            totalStudents = studentRepository.count();
            details.put("databaseStatus", "ONLINE");
            details.put("catalog", conn.getCatalog());
        } catch (Exception ex) {
            log.warn("Database health check failed: {}", ex.getMessage());
            details.put("databaseStatus", "OFFLINE");
            details.put("databaseError", ex.getMessage());
        }

        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        details.put("uptimeMs", uptimeMs);
        details.put("javaVersion", System.getProperty("java.version"));
        details.put("javaVendor", System.getProperty("java.vendor"));

        String overallStatus = dbConnected ? "UP" : "DEGRADED";
        HealthResponse response = new HealthResponse(
                overallStatus,
                dbConnected,
                dbProduct,
                totalStudents,
                details
        );

        return ResponseEntity.ok(response);
    }
}
