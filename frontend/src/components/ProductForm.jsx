import { useState } from "react";
import Button from "./ui/Button.jsx";
import Input from "./ui/Input.jsx";

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
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (!form.sku.trim()) nextErrors.sku = "SKU is required";
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) nextErrors.quantity = "Quantity must be a non-negative whole number";
    if (Number.isNaN(Number(form.costPrice)) || Number(form.costPrice) < 0) nextErrors.costPrice = "Cost price must be non-negative";
    if (Number.isNaN(Number(form.sellingPrice)) || Number(form.sellingPrice) < 0) nextErrors.sellingPrice = "Selling price must be non-negative";
    if (form.lowStockThreshold !== "" && (Number.isNaN(Number(form.lowStockThreshold)) || Number(form.lowStockThreshold) < 0)) {
      nextErrors.lowStockThreshold = "Threshold must be non-negative";
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid =
    !!form.name.trim() &&
    !!form.sku.trim() &&
    Number.isInteger(Number(form.quantity)) &&
    Number(form.quantity) >= 0 &&
    !Number.isNaN(Number(form.costPrice)) &&
    Number(form.costPrice) >= 0 &&
    !Number.isNaN(Number(form.sellingPrice)) &&
    Number(form.sellingPrice) >= 0 &&
    (form.lowStockThreshold === "" || (!Number.isNaN(Number(form.lowStockThreshold)) && Number(form.lowStockThreshold) >= 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError("Please fix validation errors");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{product ? "Edit product" : "Add product"}</h3>
      {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <Input id="name" name="name" label="Product Name" required value={form.name} onChange={handleChange} error={fieldErrors.name} />
        <Input id="sku" name="sku" label="SKU" required value={form.sku} onChange={handleChange} error={fieldErrors.sku} />
      </div>

      <Input id="description" name="description" label="Description" value={form.description} onChange={handleChange} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            label="Quantity"
            required
            value={form.quantity}
            onChange={handleChange}
            error={fieldErrors.quantity}
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="h-9 px-3"
              onClick={() => setForm((prev) => ({ ...prev, quantity: Math.max(0, Number(prev.quantity || 0) - 1) }))}
            >
              -1
            </Button>
            <Button
              variant="secondary"
              className="h-9 px-3"
              onClick={() => setForm((prev) => ({ ...prev, quantity: Number(prev.quantity || 0) + 1 }))}
            >
              +1
            </Button>
          </div>
        </div>

        <Input
          id="lowStockThreshold"
          name="lowStockThreshold"
          type="number"
          min="0"
          step="1"
          label="Low Stock Threshold"
          value={form.lowStockThreshold}
          onChange={handleChange}
          error={fieldErrors.lowStockThreshold}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="costPrice"
          name="costPrice"
          type="number"
          min="0"
          step="0.01"
          label="Cost Price"
          required
          value={form.costPrice}
          onChange={handleChange}
          error={fieldErrors.costPrice}
        />
        <Input
          id="sellingPrice"
          name="sellingPrice"
          type="number"
          min="0"
          step="0.01"
          label="Selling Price"
          required
          value={form.sellingPrice}
          onChange={handleChange}
          error={fieldErrors.sellingPrice}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" loading={loading} disabled={!isFormValid}>
          {product ? "Update Product" : "Create Product"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
