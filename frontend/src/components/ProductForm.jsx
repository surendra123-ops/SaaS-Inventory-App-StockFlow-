import { useState } from "react";

const initial = {
  name: "",
  sku: "",
  description: "",
  quantity: 0,
  costPrice: 0,
  sellingPrice: 0,
  lowStockThreshold: ""
};

function ProductForm({ onSubmit, onCancel, product, loading }) {
  const [form, setForm] = useState(
    product
      ? {
          ...product,
          lowStockThreshold: product.lowStockThreshold ?? ""
        }
      : initial
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numbers = ["quantity", "costPrice", "sellingPrice"];
    for (const field of numbers) {
      if (Number(form[field]) < 0 || Number.isNaN(Number(form[field]))) {
        setError(`${field} must be a non-negative number`);
        return;
      }
    }
    if (form.lowStockThreshold !== "" && Number(form.lowStockThreshold) < 0) {
      setError("lowStockThreshold must be a non-negative number");
      return;
    }
    if (!form.name.trim() || !form.sku.trim()) {
      setError("Name and SKU are required");
      return;
    }
    setError("");
    await onSubmit({
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description?.trim() || "",
      quantity: Number(form.quantity),
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      lowStockThreshold: form.lowStockThreshold === "" ? null : Number(form.lowStockThreshold)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-gray-900">{product ? "Edit Product" : "Add Product"}</h3>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} className="rounded border p-2" />
      <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} className="rounded border p-2" />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="rounded border p-2" />
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="rounded border p-2" />
      <input name="costPrice" type="number" step="0.01" placeholder="Cost price" value={form.costPrice} onChange={handleChange} className="rounded border p-2" />
      <input name="sellingPrice" type="number" step="0.01" placeholder="Selling price" value={form.sellingPrice} onChange={handleChange} className="rounded border p-2" />
      <input
        name="lowStockThreshold"
        type="number"
        placeholder="Low stock threshold (optional)"
        value={form.lowStockThreshold}
        onChange={handleChange}
        className="rounded border p-2"
      />
      <div className="flex gap-2">
        <button disabled={loading} className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border border-gray-300 px-3 py-2 text-gray-700">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
