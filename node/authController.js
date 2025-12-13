const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

/**
 * SIGNUP (Citizens & Workers only)
 * Admins are added manually/seeded.
 */
exports.signup = async (req, res) => {
  const { email, password, role, name, department } = req.body;

  try {
    // 1. Validation
    if (!email || !password || !role || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['CITIZEN', 'WORKER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role for signup' });
    }

    if (role === 'WORKER' && !department) {
      return res.status(400).json({ error: 'Department is required for workers' });
    }

    // 2. Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save User
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, name, email, role, department',
      [name, email, hashedPassword, role, department || null],
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find User
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2. Verify Password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Generate Token
    const token = jwt.sign(
      {
        userId: user.user_id,
        role: user.role,
        department: user.department,
      },
      JWT_SECRET,
      { expiresIn: '24h' },
    );

    // 4. Return User Info (excluding password)
    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
