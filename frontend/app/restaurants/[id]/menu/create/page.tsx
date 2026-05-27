"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CreateMenuItemPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  if (!user || user.role !== "RESTAURANT_OWNER") {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-[#111] rounded-lg shadow-lg border border-gray-800 text-center">
        <h1 className="text-xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-400 mt-2">Only restaurant owners can create menu items.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.createMenuItem({
        name,
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        price: parseFloat(price),
        isAvailable,
      });
      router.push(`/restaurants/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-[#111] rounded-lg shadow-lg border border-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-white">Add Menu Item</h1>
      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="accent-red-500"
          />
          Available
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding..." : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
}
