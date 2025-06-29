import { Link } from "react-router-dom";
import { ArrowRight, Star, ShoppingBag } from "lucide-react";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      rating: 4.5,
      vendor: "TechStore",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      rating: 4.8,
      vendor: "GadgetHub",
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
      rating: 4.3,
      vendor: "OfficePro",
    },
    {
      id: 4,
      name: "Coffee Maker",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
      rating: 4.6,
      vendor: "HomeEssentials",
    },
  ];

  const categories = [
    { name: "Electronics", icon: "📱", count: 150 },
    { name: "Fashion", icon: "👕", count: 200 },
    { name: "Home & Garden", icon: "🏠", count: 120 },
    { name: "Sports", icon: "⚽", count: 80 },
    { name: "Books", icon: "📚", count: 300 },
    { name: "Beauty", icon: "💄", count: 90 },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-8 py-16 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Shop from trusted vendors across the globe
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <span>Start Shopping</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name.toLowerCase()}`}
              className="card text-center hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="card group hover:shadow-lg transition-shadow"
            >
              <div className="relative mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShoppingBag className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.vendor}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Start Shopping?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of customers who trust our marketplace
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="btn-primary inline-flex items-center justify-center"
          >
            Create Account
          </Link>
          <Link
            to="/products"
            className="btn-secondary inline-flex items-center justify-center"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}
