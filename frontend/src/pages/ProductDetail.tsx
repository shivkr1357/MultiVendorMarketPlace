import { useParams } from "react-router-dom";
import { useGetProductQuery } from "@/store/api";
import { Star, ShoppingBag, Truck, Shield, ExternalLink } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductQuery(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Product not found</p>
        <p className="text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images?.[0] || "https://via.placeholder.com/600x600"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-lg text-gray-600 mb-2">
                Brand: {product.brand}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">{product.rating}</span>
              </div>
              <span className="text-gray-500">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900 mb-4">
              ${product.price}
            </div>

            {/* Availability and Delivery */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.availability_status === "In stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.availability_status}
                </span>
                {product.prime_eligible && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Prime
                  </span>
                )}
                {product.free_delivery && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Truck className="h-3 w-3 mr-1" />
                    Free Delivery
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Specifications
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="font-medium text-gray-700">
                          {key}:
                        </span>
                        <span className="text-gray-600">{String(value)}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Amazon Link */}
          {product.url && (
            <div className="pt-4 border-t border-gray-200">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Amazon</span>
              </a>
            </div>
          )}

          {/* Product Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </div>
              {product.seller && (
                <div>
                  <span className="font-medium">Seller:</span> {product.seller}
                </div>
              )}
              {product.product_id && (
                <div>
                  <span className="font-medium">Product ID:</span>{" "}
                  {product.product_id}
                </div>
              )}
              {product.scraped_at && (
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(product.scraped_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
