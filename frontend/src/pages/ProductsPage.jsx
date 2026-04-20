import { useEffect, useState } from "react";
import { productApi } from "../api/productApi.js";
import ProductForm from "../components/ProductForm.jsx";
import { formatError } from "../utils/formatError.js";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async (searchValue = "") => {
    try {
      const res = await productApi.list(searchValue);
      setProducts(res.data.data.products);
    } catch (err) {
      setError(formatError(err));
    }
  };

  useEffect(() => {
    let isMounted = true;
    productApi
      .list()
      .then((res) => {
        if (isMounted) {
          setProducts(res.data.data.products);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(formatError(err));
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    try {
      if (editing) {
        await productApi.update(editing._id, payload);
      } else {
        await productApi.create(payload);
      }
      setEditing(null);
      await load(search);
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) {
      return;
    }
    try {
      await productApi.remove(id);
      await load(search);
    } catch (err) {
      setError(formatError(err));
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="flex gap-2">
        <input className="w-full rounded border bg-white p-2" placeholder="Search by name or SKU" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => load(search)} className="rounded bg-gray-900 px-4 py-2 text-white">Search</button>
      </div>
      <ProductForm
        key={editing?._id || "new-product"}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(null)}
        product={editing}
        loading={loading}
      />
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Name</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.sku}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(item)} className="rounded bg-blue-600 px-2 py-1 text-white">Edit</button>
                      <button onClick={() => onDelete(item._id)} className="rounded bg-red-600 px-2 py-1 text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-2 text-gray-500">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
