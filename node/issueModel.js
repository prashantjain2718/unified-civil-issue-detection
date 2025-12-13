const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test connection on startup
pool
  .query('SELECT NOW()')
  .then((res) => {
    console.log('✅ Database connected at:', res.rows[0].now);
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

async function createIssue(issueData) {
  const queryText = `
    INSERT INTO issues (
      reporter_id,
      issue_type,
      severity,
      status,
      department_assigned,
      image_url_before,
      sla_due_date,
      description,
      geo_latitude,
      geo_longitude
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
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
    issueData.geo_latitude ?? null,
    issueData.geo_longitude ?? null,
  ];

  const { rows } = await pool.query(queryText, values);
  return rows[0];
}

async function getAllIssues(filters = {}) {
  let queryText = 'SELECT * FROM issues';
  const values = [];
  const validFilters = [];

  if (filters.reporter_id) {
    values.push(filters.reporter_id);
    validFilters.push(`reporter_id = $${values.length}`);
  }

  if (filters.department_assigned) {
    values.push(filters.department_assigned);
    validFilters.push(`department_assigned = $${values.length}`);
  }

  // Workers might be assigned by ID or Email. We'll support filtering by 'assigned_worker_id'
  if (filters.assigned_worker_id) {
    values.push(filters.assigned_worker_id);
    validFilters.push(`assigned_worker_id = $${values.length}`);
  }

  if (validFilters.length > 0) {
    queryText += ' WHERE ' + validFilters.join(' AND ');
  }

  queryText += ' ORDER BY created_at DESC';

  const { rows } = await pool.query(queryText, values);
  return rows;
}

async function getIssueById(issueId) {
  const { rows } = await pool.query('SELECT * FROM issues WHERE issue_id = $1', [issueId]);
  return rows[0] || null;
}

async function resolveIssue(issueId, imageUrlAfter) {
  const updateQuery = `
    UPDATE issues
    SET status = 'Resolved',
        image_url_after = $1,
        updated_at = CURRENT_TIMESTAMP
    WHERE issue_id = $2
    RETURNING *;
  `;

  const { rows } = await pool.query(updateQuery, [imageUrlAfter, issueId]);

  return rows[0] || null;
}

async function getWorkersByDept(department) {
  let queryText = "SELECT user_id, name, email, department FROM users WHERE role = 'WORKER'";
  const values = [];

  if (department) {
    values.push(department);
    queryText += ' AND department = $1';
  }

  const { rows } = await pool.query(queryText, values);
  return rows;
}

async function assignIssue(issueId, workerEmail) {
  const updateQuery = `
    UPDATE issues
    SET assigned_worker_id = $1,
        status = 'In Progress',
        updated_at = CURRENT_TIMESTAMP
    WHERE issue_id = $2
    RETURNING *;
  `;

  const { rows } = await pool.query(updateQuery, [workerEmail, issueId]);
  return rows[0] || null;
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  resolveIssue,
  getWorkersByDept,
  assignIssue,
};
