import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Profile from "@/pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
