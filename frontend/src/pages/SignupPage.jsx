import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { formatError } from "../utils/formatError.js";

function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", organizationName: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isValid = form.organizationName.trim().length >= 2 && form.email.includes("@") && form.password.length >= 8;

  const validate = () => {
    const nextErrors = {};
    if (!form.organizationName.trim() || form.organizationName.trim().length < 2) nextErrors.organizationName = "Organization name is required";
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
      const res = await authApi.signup(form);
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
            <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
            <p className="mt-1 text-sm text-gray-500">Start managing inventory with StockFlow</p>
          </div>
          {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{error}</p>}
          <Input
            id="organizationName"
            label="Organization Name"
            required
            value={form.organizationName}
            onChange={(e) => {
              setForm((p) => ({ ...p, organizationName: e.target.value }));
              setFieldErrors((prev) => ({ ...prev, organizationName: "" }));
            }}
            error={fieldErrors.organizationName}
          />
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
            Create Account
          </Button>
          <p className="text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default SignupPage;
