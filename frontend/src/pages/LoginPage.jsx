import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { formatError } from "../utils/formatError.js";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isValid = form.email.includes("@") && form.password.length >= 8;

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim() || !form.email.includes("@")) nextErrors.email = "Enter a valid email";
    if (!form.password || form.password.length < 8) nextErrors.password = "Password must be at least 8 characters";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setError("Please fix the highlighted fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authApi.login(form);
      login(res.data.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to continue to StockFlow</p>
          </div>
          {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p>}
          <Input
            id="email"
            type="email"
            label="Email"
            required
            value={form.email}
            onChange={(e) => {
              setForm((p) => ({ ...p, email: e.target.value }));
              setFieldErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={fieldErrors.email}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            required
            value={form.password}
            onChange={(e) => {
              setForm((p) => ({ ...p, password: e.target.value }));
              setFieldErrors((prev) => ({ ...prev, password: "" }));
            }}
            error={fieldErrors.password}
          />
          <Button type="submit" className="w-full" loading={loading} disabled={!isValid}>
            Sign In
          </Button>
          <p className="text-sm text-gray-600">
            No account?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
              Create one
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;
