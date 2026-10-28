package com.example.studentmanagement.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class HealthResponse {

    private String status;
    private boolean databaseConnected;
    private String databaseProductName;
    private long totalStudents;
    private LocalDateTime timestamp;
    private Map<String, Object> details;

    public HealthResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public HealthResponse(String status, boolean databaseConnected, String databaseProductName, long totalStudents, Map<String, Object> details) {
        this.status = status;
        this.databaseConnected = databaseConnected;
        this.databaseProductName = databaseProductName;
        this.totalStudents = totalStudents;
        this.timestamp = LocalDateTime.now();
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isDatabaseConnected() {
        return databaseConnected;
    }

    public void setDatabaseConnected(boolean databaseConnected) {
        this.databaseConnected = databaseConnected;
    }

    public String getDatabaseProductName() {
        return databaseProductName;
    }

    public void setDatabaseProductName(String databaseProductName) {
        this.databaseProductName = databaseProductName;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }
}
