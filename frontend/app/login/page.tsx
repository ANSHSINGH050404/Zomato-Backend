"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ email, password });
      login(data.token, data.user);
      router.push("/restaurants");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-[#111] rounded-lg shadow-lg border border-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Login</h1>
      {error && (
        <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-sm text-gray-500 text-center mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-red-500 hover:underline">
          Signup
        </Link>
      </p>
    </div>
  );
}
