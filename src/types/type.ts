interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    createdAt: string;
    categoryId: string;
    category?: Category;
    image?: string;
}

interface Category {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    products?: Product[];
}

interface Order {
    id: string;
    customerName: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    items: number;
}

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    revenueGrowth: number;
    ordersGrowth: number;
}