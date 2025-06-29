import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Detail</h1>
      <p className="text-gray-600">Product ID: {id}</p>
      <p className="text-gray-500 mt-2">This page is under development</p>
    </div>
  );
}
