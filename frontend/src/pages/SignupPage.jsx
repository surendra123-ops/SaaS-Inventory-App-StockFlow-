import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { formatError } from "../utils/formatError.js";

function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", organizationName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.includes("@") || form.password.length < 8 || form.organizationName.trim().length < 2) {
      setError("Provide valid organization name, email and password (min 8 characters)");
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
    <div className="grid min-h-screen place-items-center bg-gray-100 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
        <input className="w-full rounded border p-2" placeholder="Organization name" value={form.organizationName} onChange={(e) => setForm((p) => ({ ...p, organizationName: e.target.value }))} />
        <input className="w-full rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <input type="password" className="w-full rounded border p-2" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        <button disabled={loading} className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="text-sm text-gray-600">
          Already registered? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
