"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.signup({ name, email, phone, password, role });
      login(data.token, data.user);
      router.push("/restaurants");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-[#111] rounded-lg shadow-lg border border-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Signup</h1>
      {error && (
        <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="RESTAURANT_OWNER">Restaurant Owner</option>
          <option value="DELIVERY_PARTNER">Delivery Partner</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
      <p className="text-sm text-gray-500 text-center mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-red-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
