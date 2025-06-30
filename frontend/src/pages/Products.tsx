import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetProductsQuery } from "@/store/api";
import { setSearchQuery, setSelectedCategory } from "@/store/slices/uiSlice";
import { Search, Filter, Star, ShoppingBag, Shield, Truck } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";

const categories = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports & Outdoors",
  "Beauty & Health",
  "Toys & Games",
  "Automotive",
  "Food & Beverages",
  "Jewelry & Watches",
];

export default function Products() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, selectedCategory } = useAppSelector((state) => state.ui);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get URL parameters
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // Fetch products
  const { data, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    limit: 24,
    search: search || undefined,
    category: category || undefined,
  });

  useEffect(() => {
    if (data?.data) {
      setAllProducts((prev) =>
        currentPage === 1 ? data.data : [...prev, ...data.data]
      );
      setHasMore(
        data.pagination
          ? currentPage < data.pagination.totalPages
          : data.data.length > 0
      );
    }
  }, [data, currentPage]);

  // Reset products when search/category changes
  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
  }, [search, category]);

  const fetchMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set("search", value);
      } else {
        newParams.delete("search");
      }
      newParams.set("page", "1"); // Reset to first page
      return newParams;
    });
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setSelectedCategory(value));
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value && value !== "All") {
        newParams.set("category", value);
      } else {
        newParams.delete("category");
      }
      newParams.set("page", "1"); // Reset to first page
      return newParams;
    });
  };

  // Handle image error
  const handleImageError = (productId: string) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  };

  // Get fallback image for a product
  const getProductImage = (product: any) => {
    if (imageErrors[product._id]) {
      return `https://via.placeholder.com/400x300/f0f0f0/666666?text=${encodeURIComponent(
        product.name
      )}`;
    }
    return (
      product.images?.[0] ||
      `https://via.placeholder.com/400x300/f0f0f0/666666?text=${encodeURIComponent(
        product.name
      )}`
    );
  };

  // Sync URL params with Redux state
  useEffect(() => {
    if (search !== searchQuery) {
      dispatch(setSearchQuery(search));
    }
    if (category !== selectedCategory) {
      dispatch(setSelectedCategory(category));
    }
  }, [search, category, searchQuery, selectedCategory, dispatch]);

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Error loading products</p>
        <p className="text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">
          Discover amazing products from trusted vendors
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedCategory || "All"}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {data?.pagination?.total || 0} product
        {(data?.pagination?.total || 0) !== 1 ? "s" : ""} found
      </div>

      {/* Products Grid with Infinite Scroll */}
      {allProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={allProducts.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Loading more...</div>}
          endMessage={
            <div className="text-center py-4 text-gray-400">
              No more products to show.
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <div
                key={product._id}
                className="card group hover:shadow-lg transition-shadow"
              >
                <Link to={`/products/${product._id}`}>
                  <div className="relative mb-4">
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={() => handleImageError(product._id)}
                      loading="lazy"
                    />
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShoppingBag className="h-4 w-4 text-gray-600" />
                    </button>

                    {/* Amazon badges */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {product.prime_eligible && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Prime
                        </span>
                      )}
                      {product.free_delivery && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          <Truck className="h-3 w-3 mr-1" />
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="space-y-2">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Brand */}
                  {product.brand && (
                    <p className="text-sm text-gray-600 font-medium">
                      {product.brand}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">
                    {product.vendor?.firstName && product.vendor?.lastName
                      ? `${product.vendor.firstName} ${product.vendor.lastName}`
                      : product.vendor?.email || "Unknown Vendor"}
                  </p>

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
        </InfiniteScroll>
      )}
    </div>
  );
}
