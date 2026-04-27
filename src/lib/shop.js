// Helpers para la tienda: productos, carrito y pedidos almacenados en localStorage.
// Helpers para la tienda: productos, carrito y pedidos almacenados en localStorage.
const PRODUCTS_KEY = 'peluqueria_shop_products';
const ORDERS_KEY = 'peluqueria_shop_orders';
const CART_KEY = 'peluqueria_shop_cart';

const DEFAULT_PRODUCTS = [
  // CUIDADO
  { id: 'prod-01', name: 'Champú Nutritivo JLR', description: 'Limpieza profunda y nutrición suave para el día a día.', price: 14.95, stock: 18, category: 'Cuidado', image: '/shampoo_professional_1777042390187.png' },
  { id: 'prod-02', name: 'Acondicionador Reparador', description: 'Fortalece y desenreda el cabello tras el lavado.', price: 12.50, stock: 14, category: 'Cuidado', image: '/conditioner_professional_1777042512631.png' },
  { id: 'prod-03', name: 'Mascarilla Capilar Pro', description: 'Tratamiento intensivo para hidratación profunda.', price: 22.00, stock: 10, category: 'Cuidado', image: '/hair_mask_jar_1777043365997.png' },
  
  // ESTILO
  { id: 'prod-04', name: 'Cera Fijación Mate', description: 'Define tu estilo con un acabado natural sin brillos.', price: 15.90, stock: 12, category: 'Estilo', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800' },
  { id: 'prod-05', name: 'Laca de Alta Fijación', description: 'Manten tu peinado intacto durante todo el día.', price: 13.50, stock: 20, category: 'Estilo', image: '/hair_spray_bottle_1777043589966.png' },
  { id: 'prod-06', name: 'Sérum Brillo Extremo', description: 'Elimina el encrespamiento y aporta un brillo premium.', price: 19.00, stock: 7, category: 'Estilo', image: '/thermal_serum_bottle_1777043707776.png' },
  
  // AFEITADO Y BARBA
  { id: 'prod-07', name: 'Aceite de Barba Argán', description: 'Hidrata el vello facial y cuida la piel debajo de la barba.', price: 16.50, stock: 15, category: 'Afeitado', image: '/argan_oil_bottle_1777042816632.png' },
  { id: 'prod-08', name: 'Bálsamo After-Shave', description: 'Calma la irritación y refresca tras el afeitado profesional.', price: 14.00, stock: 11, category: 'Afeitado', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800' },
  
  // PACKS
  { id: 'prod-09', name: 'Pack Cuidado Total', description: 'Champú + Acondicionador + Aceite de Barba. Lo mejor de JLR.', price: 39.99, stock: 5, category: 'Packs', image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800' }
];

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const storageRead = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const value = localStorage.getItem(key);
  if (!value) return fallback;
  return safeParse(value, fallback);
};

const storageWrite = (key, value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const getProducts = () => storageRead(PRODUCTS_KEY, DEFAULT_PRODUCTS);
export const saveProducts = (products) => storageWrite(PRODUCTS_KEY, products);
export const getOrders = () => storageRead(ORDERS_KEY, []);
export const saveOrders = (orders) => storageWrite(ORDERS_KEY, orders);
export const getCart = () => storageRead(CART_KEY, []);
export const saveCart = (cart) => storageWrite(CART_KEY, cart);

export const addOrder = (order) => {
  const currentOrders = getOrders();
  const nextOrders = [order, ...currentOrders];
  saveOrders(nextOrders);
  return nextOrders;
};

export const updateStock = (productId, quantity) => {
  const products = getProducts();
  const updated = products.map(product => {
    if (product.id !== productId) return product;
    return { ...product, stock: Math.max(0, product.stock + quantity) };
  });
  saveProducts(updated);
  return updated;
};

export const computeShopStats = (orders, products) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const averageOrder = totalOrders ? totalRevenue / totalOrders : 0;

  const productCounts = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!productCounts[item.id]) productCounts[item.id] = { quantity: 0, revenue: 0, name: item.name };
      productCounts[item.id].quantity += item.quantity;
      productCounts[item.id].revenue += item.quantity * item.price;
    });
  });

  const bestSellers = Object.values(productCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  const monthlyRevenue = {};
  orders.forEach(order => {
    const month = new Date(order.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
  });

  const lowStock = products.filter(product => product.stock <= 5);

  return {
    totalOrders,
    totalRevenue,
    averageOrder,
    bestSellers,
    monthlyRevenue,
    lowStock,
  };
};

export const getLowStockProducts = (products, threshold = 5) => products.filter(product => product.stock <= threshold);
