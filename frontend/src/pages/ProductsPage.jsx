import { useEffect, useState } from "react";
import { productApi } from "../api/productApi.js";
import { settingsApi } from "../api/settingsApi.js";
import ProductForm from "../components/ProductForm.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { Table, TBody, TD, TH, THead, TR } from "../components/ui/Table.jsx";
import { useToast } from "../hooks/useToast.js";
import { formatError } from "../utils/formatError.js";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [defaultThreshold, setDefaultThreshold] = useState(10);
  const [error, setError] = useState("");
  const toast = useToast();

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
    Promise.all([productApi.list(), settingsApi.get()])
      .then(([productsResponse, settingsResponse]) => {
        if (!isMounted) return;
        setProducts(productsResponse.data.data.products);
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
      setIsModalOpen(false);
      await load(search);
    } catch (err) {
      setError(formatError(err));
      toast.error("Something went wrong");
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
      toast.success("Deleted successfully");
      await load(search);
    } catch (err) {
      setError(formatError(err));
      toast.error("Something went wrong");
    }
  };

  const openCreateModal = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditing(item);
    setIsModalOpen(true);
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
        <Input
          id="product-search"
          label="Search Products"
          containerClassName="w-full"
          placeholder="Search by product name or SKU"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") load(search);
          }}
        />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => load(search)}>
            Search
          </Button>
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
            {products.length === 0 ? (
              <TR>
                <TD colSpan={5} className="py-10 text-center text-gray-500">
                  No products yet. Add your first product.
                </TD>
              </TR>
            ) : (
              products.map((item) => {
                const threshold = item.lowStockThreshold ?? defaultThreshold;
                const lowStock = item.quantity <= threshold;
                return (
                  <TR key={item._id}>
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
                        <Button variant="danger" className="h-8 px-3" onClick={() => onDelete(item._id)}>
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
        open={isModalOpen}
        title={editing ? "Edit Product" : "Add Product"}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
      >
        <ProductForm
          key={editing?._id || "new-product"}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditing(null);
          }}
          product={editing}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default ProductsPage;
