import db from './db.js';

async function updateCategories() {
  try {
    console.log('Mapping categories...');
    
    // Mapeo de categorías antiguas a nuevas
    const mapping = {
      'Barbería': 'Afeitado',
      'Peinado': 'Estilo',
      'Peinado': 'Estilo',
      'Herramientas': 'Estilo',
      'Accesorios': 'Estilo',
      'Capilar': 'Cuidado',
      'Tratamientos': 'Cuidado',
      'Aceites': 'Cuidado',
      'Protección': 'Cuidado'
    };

    for (const [oldCat, newCat] of Object.entries(mapping)) {
      await db.query('UPDATE products SET category = ? WHERE category = ?', [newCat, oldCat]);
    }

    console.log('Categories updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Update error:', err);
    process.exit(1);
  }
}

updateCategories();
