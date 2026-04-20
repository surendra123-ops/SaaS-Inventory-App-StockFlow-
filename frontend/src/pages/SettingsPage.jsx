import { useEffect, useState } from "react";
import { settingsApi } from "../api/settingsApi.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { useToast } from "../hooks/useToast.js";
import { formatError } from "../utils/formatError.js";

function SettingsPage() {
  const [value, setValue] = useState(10);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const toast = useToast();
  const isValid = !Number.isNaN(Number(value)) && Number(value) >= 0;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await settingsApi.get();
        setValue(res.data.data.settings.defaultLowStockThreshold);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setError("");
    setFieldError("");
    if (Number(value) < 0 || Number.isNaN(Number(value))) {
      setFieldError("Threshold must be a non-negative number");
      return;
    }
    try {
      setSaving(true);
      await settingsApi.update({ defaultLowStockThreshold: Number(value) });
      toast.success("Updated successfully");
    } catch (err) {
      setError(formatError(err));
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-52 max-w-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure default inventory behavior for your workspace.</p>
      </div>
      <Card className="max-w-2xl p-6">
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Default Low Stock Threshold</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Applied whenever a product-specific threshold is not set.</p>
          </div>
          {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
          <Input
            id="defaultLowStockThreshold"
            type="number"
            min="0"
            step="1"
            label="Threshold Value"
            required
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setFieldError("");
            }}
            error={fieldError}
          />
          <Button type="submit" loading={saving} disabled={!isValid}>
            Save Settings
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default SettingsPage;
