const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedDemoUsers() {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    // Seed Citizen
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
      ['Demo Citizen', 'citizen@civic.com', passwordHash, 'CITIZEN', null]
    );

    // Seed Worker
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
      ['Demo Worker', 'worker@civic.com', passwordHash, 'WORKER', 'PWD']
    );

    console.log('✅ Demo Citizen and Worker seeded!');
    console.log('Citizen: citizen@civic.com / password123');
    console.log('Worker: worker@civic.com / password123');

  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    pool.end();
  }
}

seedDemoUsers();
