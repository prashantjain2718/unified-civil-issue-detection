const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Mock data mechanism if DB fails
let mockIssues = [];
let mockIdCounter = 1;

/**
 * Helper to execute query with mock fallback
 */
async function query(text, params) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.warn('Database error, using mock data:', err.message);
    throw err; // Let the caller handle the fallback logic to keep this clean, or handle here?
    // For this specific prototype, I'll return a special error or handle it in specific model methods.
  }
}

/**
 * Create a new issue
 */
async function createIssue(issueData) {
  const queryText = `
    INSERT INTO issues (reporter_id, issue_type, severity, status, department_assigned, image_url_before, sla_due_date, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    issueData.reporter_id,
    issueData.issue_type,
    issueData.severity,
    issueData.status,
    issueData.department_assigned,
    issueData.image_url_before,
    issueData.sla_due_date,
    issueData.description || '',
  ];

  try {
    const { rows } = await pool.query(queryText, values);
    return rows[0];
  } catch (error) {
    console.warn('DB Insert Failed, using mock:', error.message);
    const newIssue = {
      ...issueData,
      issue_id: mockIdCounter++,
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockIssues.push(newIssue);
    return newIssue;
  }
}

/**
 * Get all issues
 */
async function getAllIssues() {
  try {
    const { rows } = await pool.query('SELECT * FROM issues ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.warn('DB Fetch Failed, using mock:', error.message);
    return mockIssues.sort((a, b) => b.created_at - a.created_at);
  }
}

/**
 * Get issue by ID
 */
async function getIssueById(issueId) {
  try {
    const { rows } = await pool.query('SELECT * FROM issues WHERE issue_id = $1', [issueId]);
    return rows[0];
  } catch (error) {
    return mockIssues.find((i) => i.issue_id == issueId);
  }
}

/**
 * Update issue (resolution)
 */
async function resolveIssue(issueId, imageUrlAfter) {
  const updateQuery = `
        UPDATE issues 
        SET status = 'Resolved', image_url_after = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE issue_id = $2
        RETURNING *;
    `;

  try {
    const { rows } = await pool.query(updateQuery, [imageUrlAfter, issueId]);
    return rows[0];
  } catch (error) {
    console.warn('DB Update Failed, using mock:', error.message);
    const index = mockIssues.findIndex((i) => i.issue_id == issueId);
    if (index !== -1) {
      mockIssues[index] = {
        ...mockIssues[index],
        status: 'Resolved',
        image_url_after: imageUrlAfter,
        updated_at: new Date(),
      };
      return mockIssues[index];
    }
    return null;
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  resolveIssue,
};
