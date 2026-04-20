import { useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboardApi.js";
import { productApi } from "../api/productApi.js";
import { settingsApi } from "../api/settingsApi.js";
import { formatError } from "../utils/formatError.js";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { Table, TBody, TD, TH, THead, TR } from "../components/ui/Table.jsx";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [data, setData] = useState({ totalProducts: 0, totalQuantity: 0, lowStockItems: [] });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentPagination, setRecentPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [recentPage, setRecentPage] = useState(1);
  const [defaultThreshold, setDefaultThreshold] = useState(10);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, settingsResponse] = await Promise.all([dashboardApi.get(), settingsApi.get()]);
        setData(dashboardResponse.data.data);
        setDefaultThreshold(settingsResponse.data.data.settings.defaultLowStockThreshold);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const productsResponse = await productApi.list({ page: recentPage, limit: 5 });
        setRecentProducts(productsResponse.data.data.items);
        setRecentPagination(productsResponse.data.data.pagination);
      } catch (err) {
        setError(formatError(err));
      }
    };
    fetchRecent();
  }, [recentPage]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Monitor inventory health, low stock risk, and recent activity.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalProducts}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Total Quantity</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalQuantity}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500">Low Stock Count</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{data.lowStockItems.length}</p>
        </Card>
      </div>
      <Card>
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Low Stock Items</h2>
        </div>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>SKU</TH>
              <TH className="text-right">Quantity</TH>
            </tr>
          </THead>
          <TBody>
            {data.lowStockItems.length === 0 ? (
              <TR>
                <TD colSpan={3} className="py-8 text-center text-gray-500">
                  All products are well stocked
                </TD>
              </TR>
            ) : (
              data.lowStockItems.map((item) => (
                <TR key={item._id} className="bg-amber-50/50 hover:bg-amber-50">
                  <TD className="font-medium text-gray-900">{item.name}</TD>
                  <TD>{item.sku}</TD>
                  <TD className="text-right font-semibold text-amber-700">{item.quantity}</TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
          <Button variant="secondary" className="h-8 px-3" onClick={() => navigate("/products")}>
            View All
          </Button>
        </div>
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>SKU</TH>
              <TH className="text-right">Quantity</TH>
              <TH>Status</TH>
            </tr>
          </THead>
          <TBody>
            {recentProducts.length === 0 ? (
              <TR>
                <TD colSpan={4} className="py-8 text-center text-gray-500">
                  No products yet
                </TD>
              </TR>
            ) : (
              recentProducts.map((item) => {
                const lowStock = item.quantity <= (item.lowStockThreshold ?? defaultThreshold);
                return (
                  <TR key={item._id} className={lowStock ? "bg-amber-50/50 hover:bg-amber-50" : ""}>
                    <TD className="font-medium text-gray-900">{item.name}</TD>
                    <TD>{item.sku}</TD>
                    <TD className="text-right">{item.quantity}</TD>
                    <TD>
                      <Badge variant={lowStock ? "warning" : "success"}>{lowStock ? "Low Stock" : "In Stock"}</Badge>
                    </TD>
                  </TR>
                );
              })
            )}
          </TBody>
        </Table>
        {recentPagination.total > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              Page {recentPagination.page} of {recentPagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="h-8 px-3"
                disabled={recentPage <= 1}
                onClick={() => setRecentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                className="h-8 px-3"
                disabled={recentPage >= recentPagination.totalPages}
                onClick={() => setRecentPage((prev) => Math.min(recentPagination.totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;
