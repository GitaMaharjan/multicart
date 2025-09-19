import {
  BarChart3,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const stats: DashboardStats = {
    totalRevenue: 15420.5,
    totalOrders: 156,
    totalProducts: 45,
    totalCustomers: 98,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
  };

  const recentOrders = [
    {
      id: "1",
      customerName: "John Doe",
      total: 99.99,
      status: "delivered" as const,
      items: 1,
    },
    {
      id: "2",
      customerName: "Jane Smith",
      total: 299.98,
      status: "processing" as const,
      items: 2,
    },
    {
      id: "3",
      customerName: "Mike Johnson",
      total: 149.99,
      status: "shipped" as const,
      items: 1,
    },
    {
      id: "4",
      customerName: "Sarah Wilson",
      total: 399.97,
      status: "pending" as const,
      items: 3,
    },
  ];

  const topProducts = [
    { id: "1", name: "Wireless Headphones", price: 99.99, stock: 50 },
    { id: "2", name: "Smart Watch", price: 199.99, stock: 25 },
    { id: "3", name: "Bluetooth Speaker", price: 79.99, stock: 35 },
    { id: "4", name: "Phone Case", price: 29.99, stock: 100 },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp
              className={`w-4 h-4 ${
                change >= 0 ? "text-green-500" : "text-red-500"
              } mr-1`}
            />
            <span
              className={`text-sm ${
                change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
          </div>
        </div>
        <div
          className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Heres whats happening with your store.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={stats.revenueGrowth}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          change={stats.ordersGrowth}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.toString()}
          change={5.2}
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Customers"
          value={stats.totalCustomers.toString()}
          change={3.8}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-gray-600">{order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${order.total}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Products
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sales Analytics
        </h3>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization would go here</p>
            <p className="text-sm text-gray-400">
              Connect to your analytics service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
