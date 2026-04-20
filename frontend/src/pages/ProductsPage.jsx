import { useEffect, useMemo, useState } from "react";
import { productApi } from "../api/productApi.js";
import { settingsApi } from "../api/settingsApi.js";
import ProductForm from "../components/ProductForm.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Modal from "../components/ui/Modal.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { Table, TBody, TD, TH, THead, TR } from "../components/ui/Table.jsx";
import { useToast } from "../hooks/useToast.js";
import { formatError } from "../utils/formatError.js";

function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [defaultThreshold, setDefaultThreshold] = useState(10);
  const [error, setError] = useState("");
  const toast = useToast();

  const load = async () => {
    try {
      const res = await productApi.list();
      setAllProducts(res.data.data.products);
    } catch (err) {
      setError(formatError(err));
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([productApi.list(), settingsApi.get()])
      .then(([productsResponse, settingsResponse]) => {
        if (!isMounted) return;
        setAllProducts(productsResponse.data.data.products);
        setDefaultThreshold(settingsResponse.data.data.settings.defaultLowStockThreshold);
      })
      .catch((err) => {
        if (isMounted) setError(formatError(err));
      })
      .finally(() => {
        if (isMounted) setPageLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const products = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) {
      return allProducts;
    }
    return allProducts.filter(
      (item) => item.name.toLowerCase().includes(term) || item.sku.toLowerCase().includes(term)
    );
  }, [allProducts, debouncedSearch]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");
    try {
      if (editing) {
        await productApi.update(editing._id, payload);
        toast.success("Updated successfully");
      } else {
        await productApi.create(payload);
        toast.success("Product created successfully");
      }
      setEditing(null);
      setIsFormModalOpen(false);
      await load();
    } catch (err) {
      setError(formatError(err));
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await productApi.remove(deleteTarget._id);
      setAllProducts((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      toast.success("Product deleted successfully");
    } catch (err) {
      setError(formatError(err));
      toast.error("Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditing(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setDeleteTarget(item);
    setIsDeleteModalOpen(true);
  };

  if (pageLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="w-full">
          <label htmlFor="product-search" className="mb-1 block text-sm font-medium text-gray-700">
            Search Products
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
            <input
              id="product-search"
              className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-9 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Search by name or SKU"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateModal}>Add Product</Button>
        </div>
      </div>

      <Card>
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
        </div>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>SKU</TH>
              <TH className="text-right">Quantity</TH>
              <TH>Status</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <TBody>
            {allProducts.length === 0 ? (
              <TR>
                <TD colSpan={5} className="py-10 text-center text-gray-500">
                  No products yet. Add your first product.
                </TD>
              </TR>
            ) : products.length === 0 ? (
              <TR>
                <TD colSpan={5} className="py-10 text-center text-gray-500">
                  No results found
                </TD>
              </TR>
            ) : (
              products.map((item) => {
                const threshold = item.lowStockThreshold ?? defaultThreshold;
                const lowStock = item.quantity <= threshold;
                return (
                  <TR key={item._id} className={lowStock ? "bg-red-50/30 hover:bg-red-50/50" : ""}>
                    <TD className="font-medium text-gray-900">{item.name}</TD>
                    <TD>{item.sku}</TD>
                    <TD className="text-right">{item.quantity}</TD>
                    <TD>
                      <Badge variant={lowStock ? "danger" : "success"}>{lowStock ? "Low stock" : "In stock"}</Badge>
                    </TD>
                    <TD className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" className="h-8 px-3" onClick={() => openEditModal(item)}>
                          Edit
                        </Button>
                        <Button variant="danger" className="h-8 px-3" onClick={() => openDeleteModal(item)}>
                          🗑 Delete
                        </Button>
                      </div>
                    </TD>
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>
      </Card>

      <Modal
        open={isFormModalOpen}
        title={editing ? "Edit Product" : "Add Product"}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditing(null);
        }}
      >
        <ProductForm
          key={editing?._id || "new-product"}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setEditing(null);
          }}
          product={editing}
          loading={loading}
        />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        title="Delete Product"
        disableClose={deleteLoading}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        footer={
          <>
            <Button
              variant="secondary"
              disabled={deleteLoading}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" loading={deleteLoading} disabled={deleteLoading} onClick={onDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default ProductsPage;
