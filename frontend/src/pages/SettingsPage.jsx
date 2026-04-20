import { useEffect, useState } from "react";
import { settingsApi } from "../api/settingsApi.js";
import { formatError } from "../utils/formatError.js";

function SettingsPage() {
  const [value, setValue] = useState(10);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await settingsApi.get();
        setValue(res.data.data.settings.defaultLowStockThreshold);
      } catch (err) {
        setError(formatError(err));
      }
    };
    load();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (Number(value) < 0 || Number.isNaN(Number(value))) {
      setError("Threshold must be a non-negative number");
      return;
    }
    try {
      await settingsApi.update({ defaultLowStockThreshold: Number(value) });
      setSuccess("Settings updated");
    } catch (err) {
      setError(formatError(err));
    }
  };

  return (
    <form onSubmit={onSave} className="max-w-lg space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Default low stock threshold</h2>
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded bg-emerald-50 p-2 text-sm text-emerald-700">{success}</p>}
      <input type="number" min="0" className="w-full rounded border p-2" value={value} onChange={(e) => setValue(e.target.value)} />
      <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
    </form>
  );
}

export default SettingsPage;
