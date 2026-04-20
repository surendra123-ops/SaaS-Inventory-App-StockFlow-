import { useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboardApi.js";
import { formatError } from "../utils/formatError.js";

function DashboardPage() {
  const [data, setData] = useState({ totalProducts: 0, totalQuantity: 0, lowStockItems: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardApi.get();
        setData(res.data.data);
      } catch (err) {
        setError(formatError(err));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-5">
      {error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total products</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalProducts}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-500">Total quantity</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalQuantity}</p>
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Low stock items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Name</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStockItems.length === 0 ? (
                <tr>
                  <td className="p-2 text-gray-500" colSpan={3}>No low stock items</td>
                </tr>
              ) : (
                data.lowStockItems.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.sku}</td>
                    <td className="p-2">{item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
