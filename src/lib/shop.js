// Helpers para la tienda: productos, carrito y pedidos almacenados en localStorage.
// Helpers para la tienda: productos, carrito y pedidos almacenados en localStorage.
const PRODUCTS_KEY = 'peluqueria_shop_products';
const ORDERS_KEY = 'peluqueria_shop_orders';
const CART_KEY = 'peluqueria_shop_cart';

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Champú Nutritivo Premium',
    description: 'Limpieza profunda y nutrición suave para cabello sano y brillante.',
    price: 14.95,
    stock: 18,
    category: 'Cuidado',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'prod-02',
    name: 'Acondicionador Reparador',
    description: 'Fortalece y desenreda el cabello mientras protege el color.',
    price: 12.50,
    stock: 14,
    category: 'Cuidado',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'prod-03',
    name: 'Cera Modeladora',
    description: 'Fijación flexible sin apariencia grasa para acabado profesional.',
    price: 11.90,
    stock: 8,
    category: 'Estilo',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'prod-04',
    name: 'Sérum Antifrizz',
    description: 'Controla el encrespamiento y aporta brillo en segundos.',
    price: 18.20,
    stock: 6,
    category: 'Tratamiento',
    image: 'https://images.unsplash.com/photo-1500048993953-d4647a3f2ee5?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'prod-05',
    name: 'Mascarilla Nutritiva',
    description: 'Tratamiento intensivo para cabello seco y dañado.',
    price: 22.00,
    stock: 10,
    category: 'Tratamiento',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=80'
  }
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
