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
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
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

  const loadProducts = async ({ pageValue = 1, searchValue = "" } = {}) => {
    try {
      const res = await productApi.list({ search: searchValue, page: pageValue, limit: 10 });
      setProducts(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(formatError(err));
    }
  };

  useEffect(() => {
    let isMounted = true;
    settingsApi
      .get()
      .then((response) => {
        if (!isMounted) return;
        setDefaultThreshold(response.data.data.settings.defaultLowStockThreshold);
      })
      .catch((err) => {
        if (isMounted) setError(formatError(err));
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 400);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const response = await productApi.list({
          search: debouncedSearch.trim(),
          page,
          limit: 10
        });
        if (!isMounted) return;
        setProducts(response.data.data.items);
        setPagination(response.data.data.pagination);
      } catch (err) {
        if (!isMounted) return;
        setError(formatError(err));
      } finally {
        if (isMounted) setPageLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, page]);

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
      await loadProducts({ pageValue: page, searchValue: debouncedSearch.trim() });
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
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      toast.success("Product deleted successfully");
      const nextPage = products.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadProducts({ pageValue: page, searchValue: debouncedSearch.trim() });
      }
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

  const pageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages || 1;
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, start + 2);
    const adjustedStart = Math.max(1, end - 2);
    const numbers = [];
    for (let i = adjustedStart; i <= end; i += 1) numbers.push(i);
    return numbers;
  }, [page, pagination.totalPages]);

  if (pageLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Products</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage inventory, track stock status, and keep SKU data accurate.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="w-full">
          <label htmlFor="product-search" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Search Products
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">⌕</span>
            <input
              id="product-search"
              className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-9 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
              placeholder="Search by name or SKU"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="h-11 px-5" onClick={openCreateModal}>
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Products</h2>
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
            {pagination.total === 0 ? (
              <TR>
                <TD colSpan={5} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  {debouncedSearch.trim() ? "No results found" : "No products available"}
                </TD>
              </TR>
            ) : (
              products.map((item) => {
                const threshold = item.lowStockThreshold ?? defaultThreshold;
                const lowStock = item.quantity <= threshold;
                return (
                  <TR key={item._id} className={lowStock ? "bg-amber-50/50 hover:bg-amber-50" : ""}>
                    <TD className="font-medium text-slate-900 dark:text-slate-100">{item.name}</TD>
                    <TD>{item.sku}</TD>
                    <TD className="text-right">{item.quantity}</TD>
                    <TD>
                      <Badge variant={lowStock ? "warning" : "success"}>{lowStock ? "Low stock" : "In stock"}</Badge>
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
        {pagination.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 py-5 sm:flex-row dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="h-8 px-3"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {pageNumbers.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === page ? "primary" : "secondary"}
                    className="h-8 min-w-8 px-2"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ))}
              </div>
              <Button
                variant="secondary"
                className="h-8 px-3"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
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
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default ProductsPage;
