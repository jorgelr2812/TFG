import db from './db.js';

async function checkProducts() {
  try {
    const [products] = await db.query('SELECT * FROM products');
    console.log('PRODUCTS IN DB:', products);
    process.exit(0);
  } catch (err) {
    console.error('DB ERROR:', err);
    process.exit(1);
  }
}

checkProducts();
