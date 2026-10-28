package com.example.studentmanagement.dto;

public class DepartmentSummary {

    private String department;
    private long studentCount;

    public DepartmentSummary() {
    }

    public DepartmentSummary(String department, long studentCount) {
        this.department = department;
        this.studentCount = studentCount;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(long studentCount) {
        this.studentCount = studentCount;
    }
}
