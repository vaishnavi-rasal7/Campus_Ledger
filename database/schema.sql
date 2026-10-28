-- ==============================================================
-- Campus Ledger - Student Record Management System
-- Database Schema Script
-- Semester III Mini Project - FSJP Lab (A. P. Shah Institute of Technology)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS studentdb;
USE studentdb;

-- Main students table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial seed data for demonstration and testing
INSERT INTO students (name, email, department) VALUES
('Aarav Mehta', 'aarav.mehta@example.edu', 'Information Technology'),
('Ananya Iyer', 'ananya.iyer@example.edu', 'Computer Engineering'),
('Rohan Deshmukh', 'rohan.deshmukh@example.edu', 'Information Technology'),
('Pooja Kulkarni', 'pooja.kulkarni@example.edu', 'Artificial Intelligence & Data Science'),
('Siddharth Patil', 'siddharth.patil@example.edu', 'Computer Engineering'),
('Meera Nair', 'meera.nair@example.edu', 'Information Technology'),
('Kabir Sharma', 'kabir.sharma@example.edu', 'Electronics & Telecommunication');
