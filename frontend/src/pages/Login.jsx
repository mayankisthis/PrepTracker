import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAward } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-darkBg px-4 py-12 transition-colors duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-650 text-white shadow-lg shadow-indigo-500/20">
            <FiAward className="h-6 w-6" />
          </div>
          <h2 className="font-outfit text-2xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your DSA progress and schedules
          </p>
        </div>

        {error && (
          <div className="p-3.5 text-xs rounded-xl bg-rose-50 text-rose-605 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/30">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-3 text-slate-400" />
              <input
                id="inp-login-email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3 text-slate-400" />
              <input
                id="inp-login-password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-705 active:bg-indigo-800 shadow-lg shadow-indigo-500/10 flex items-center justify-center transition-all text-sm"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          Don't have an account?{' '}
          <Link id="lnk-login-to-register" to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
