const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// JSON Store Setup
const DATA_FILE = path.join(__dirname, 'data', 'issues.json');
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Helper to load issues
function loadIssues() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
  return [];
}

// Helper to save issues
function saveIssues(issues) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(issues, null, 2));
}

let mockIssues = loadIssues();
let mockIdCounter = mockIssues.length > 0 ? Math.max(...mockIssues.map((i) => i.issue_id)) + 1 : 1;

/**
 * Helper to execute query with mock fallback
 */
async function query(text, params) {
  try {
    if (!process.env.DATABASE_URL) throw new Error('No DB URL');
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    if (process.env.DATABASE_URL) {
      // Silently fall back to local store
    }
    throw err;
  }
}

/**
 * Create a new issue
 */
async function createIssue(issueData) {
  const queryText = `
    INSERT INTO issues (reporter_id, issue_type, severity, status, department_assigned, image_url_before, sla_due_date, description, geo_latitude, geo_longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
    issueData.geo_latitude || null,
    issueData.geo_longitude || null,
  ];

  try {
    const { rows } = await query(queryText, values);
    return rows[0];
  } catch (error) {
    // Fallback to local file store
    const newIssue = {
      ...issueData,
      issue_id: mockIdCounter++,
      created_at: new Date(),
      updated_at: new Date(),
      // Ensure coords are stored in mock
      geo_latitude: issueData.geo_latitude || null,
      geo_longitude: issueData.geo_longitude || null,
    };
    mockIssues.push(newIssue);
    saveIssues(mockIssues);
    return newIssue;
  }
}

/**
 * Get all issues
 */
async function getAllIssues() {
  try {
    const { rows } = await query('SELECT * FROM issues ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    return mockIssues.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

/**
 * Get issue by ID
 */
async function getIssueById(issueId) {
  try {
    const { rows } = await query('SELECT * FROM issues WHERE issue_id = $1', [issueId]);
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
    const { rows } = await query(updateQuery, [imageUrlAfter, issueId]);
    return rows[0];
  } catch (error) {
    const index = mockIssues.findIndex((i) => i.issue_id == issueId);
    if (index !== -1) {
      mockIssues[index] = {
        ...mockIssues[index],
        status: 'Resolved',
        image_url_after: imageUrlAfter,
        updated_at: new Date(),
      };
      saveIssues(mockIssues);
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
