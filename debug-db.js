import pool from './db.js';

async function debug() {
  try {
    console.log('--- Database Debug ---');
    
    // 1. Check users
    const [users] = await pool.query('SELECT id, email, role FROM users');
    console.log('Users found:', users);
    
    const jefe = users.find(u => u.role === 'jefe');
    if (!jefe) {
      console.log('❌ NO user with role "jefe" found!');
    } else {
      console.log('✅ Jefe user found:', jefe);
    }
    
    // 2. Check date logic
    const today = new Date();
    const mockDateStr = today.toISOString().split('T')[0]; // e.g. "2026-04-22"
    const mockDate = new Date(mockDateStr);
    
    console.log('Current time (server):', today.toString());
    console.log('Selected date (mock):', mockDateStr);
    console.log('new Date(mockDateStr) results in:', mockDate.toString());
    console.log('Is new Date(mockDateStr) < today?', mockDate < today);
    
    process.exit(0);
  } catch (err) {
    console.error('Debug error:', err);
    process.exit(1);
  }
}

debug();
