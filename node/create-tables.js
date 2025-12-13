import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const schema = `
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS issues CASCADE;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'CITIZEN', 'WORKER', 'DEPT_ADMIN', 'SUPER_ADMIN'
    department VARCHAR(50), -- Null for CITIZEN and SUPER_ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issues (
    issue_id SERIAL PRIMARY KEY,
    reporter_id VARCHAR(255) NOT NULL,
    issue_type VARCHAR(50),
    severity VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Reported',
    department_assigned VARCHAR(50),
    assigned_worker_id VARCHAR(255),
    geo_latitude DECIMAL(10, 8),
    geo_longitude DECIMAL(11, 8),
    image_url_before TEXT NOT NULL,
    image_url_after TEXT,
    description TEXT,
    sla_due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_department ON issues(department_assigned);
CREATE INDEX idx_issues_created ON issues(created_at DESC);
`;

async function createTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('🔄 Connecting to Railway database...');
    await pool.query(schema);
    console.log('✅ Tables created successfully!');

    // SEED ADMINS
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);

    // Super Admin
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
      ['Super Admin', 'super@civic.com', hashedPassword, 'SUPER_ADMIN', null],
    );

    // Department Admins
    const depts = ['PWD', 'Electricity', 'Nagar Nigam', 'Jal Vibhag'];
    for (const dept of depts) {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, department) 
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
        [
          `${dept} Admin`,
          `${dept.toLowerCase().replace(' ', '')}_admin@civic.com`,
          hashedPassword,
          'DEPT_ADMIN',
          dept,
        ],
      );
    }
    console.log('✅ Admin accounts seeded successfully!');

    // SEED ISSUES
    await pool.query(`
      INSERT INTO issues (
        reporter_id, issue_type, severity, status, 
        department_assigned, image_url_before, description, 
        geo_latitude, geo_longitude, sla_due_date
      ) VALUES 
        ('citizen_demo', 'Pothole', 'High', 'Reported', 'PWD', 
         'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7', 
         'Large pothole on main road causing traffic issues', 
         26.9124, 75.7873, NOW() + INTERVAL '24 hours'),
        ('citizen_demo', 'Garbage Overflow', 'Medium', 'In Progress', 'Nagar Nigam',
         'https://images.unsplash.com/photo-1605600659908-0ef719419d41',
         'Garbage bin overflowing near market area', 
         26.9054, 75.8096, NOW() + INTERVAL '48 hours'),
        ('citizen_demo', 'Broken Streetlight', 'High', 'Resolved', 'Electricity',
         'https://images.unsplash.com/photo-1542361345-89e58247f2d5',
         'Streetlight not working creating safety issue', 
         26.8929, 75.8073, NOW());
    `);
    console.log('✅ Demo issues seeded successfully!');

    const result = await pool.query('SELECT COUNT(*) FROM issues');
    console.log(`📊 Total issues in database: ${result.rows[0].count}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}
createTables();
