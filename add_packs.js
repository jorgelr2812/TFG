import db from './db.js';

async function addPacks() {
  try {
    console.log('Adding Packs to DB...');
    
    const packs = [
      { id: 'pack-01', name: 'Kit Cuidado Barba', description: 'Aceite + Gel de afeitado + Aftershave. Todo lo que tu barba necesita.', price: 29.99, stock: 10, category: 'Packs', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800' },
      { id: 'pack-02', name: 'Trío Capilar Premium', description: 'Champú + Acondicionador + Mascarilla Pro. Nutrición máxima.', price: 44.50, stock: 8, category: 'Packs', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800' }
    ];

    for (const p of packs) {
      await db.query('INSERT IGNORE INTO products (id, name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [p.id, p.name, p.description, p.price, p.stock, p.category, p.image]);
    }

    console.log('Packs added!');
    process.exit(0);
  } catch (err) {
    console.error('Insert error:', err);
    process.exit(1);
  }
}

addPacks();
