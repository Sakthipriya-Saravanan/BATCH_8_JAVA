-- Enable UUIDs if needed (though we use BIGSERIAL for IDs in User.java)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Users Table
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password VARCHAR(255), -- Not used in demo auth, but good practice
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'STAFF', 'ADMIN')),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. Resources Table
-- ==========================================
CREATE TABLE IF NOT EXISTS resources (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('LAB', 'CLASSROOM', 'EVENT_HALL')),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'UNAVAILABLE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. Bookings Table
-- ==========================================
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource_id BIGINT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent double booking
    CONSTRAINT uk_resource_date_timeslot UNIQUE (resource_id, booking_date, time_slot)
);

-- ==========================================
-- 4. Initial Seed Data (Optional)
-- ==========================================

-- Admin User
INSERT INTO users (name, email, role, status) 
VALUES ('System Admin', 'admin@campus.edu', 'ADMIN', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Staff User
INSERT INTO users (name, email, role, status) 
VALUES ('Staff Member', 'staff@campus.edu', 'STAFF', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Student User
INSERT INTO users (name, email, role, status) 
VALUES ('Student One', 'student@campus.edu', 'STUDENT', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Sample Resources
INSERT INTO resources (name, type, capacity, status) VALUES 
('Physics Lab 101', 'LAB', 30, 'AVAILABLE'),
('Chemistry Lab 202', 'LAB', 25, 'AVAILABLE'),
('Auditorium Main', 'EVENT_HALL', 200, 'AVAILABLE'),
('Classroom 3A', 'CLASSROOM', 60, 'AVAILABLE');
