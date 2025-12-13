-- Create table for civic issues
CREATE TABLE IF NOT EXISTS issues (
    issue_id SERIAL PRIMARY KEY,
    reporter_id VARCHAR(255) NOT NULL, -- Could be a UUID or user ID
    issue_type VARCHAR(50), -- Pothole, Garbage Overflow, etc.
    severity VARCHAR(20), -- High, Medium, Low
    status VARCHAR(20) DEFAULT 'Reported', -- Reported, In Progress, Resolved
    department_assigned VARCHAR(50), -- PWD, Nagar Nigam, etc.
    assigned_worker_id VARCHAR(255),
    geo_latitude DECIMAL(10, 8),
    geo_longitude DECIMAL(11, 8),
    image_url_before TEXT NOT NULL,
    image_url_after TEXT,
    sla_due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries on status and assignment
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_department ON issues(department_assigned);
