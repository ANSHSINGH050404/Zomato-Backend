"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CreateRestaurantPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  if (!user || user.role !== "RESTAURANT_OWNER") {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-[#111] rounded-lg shadow-lg border border-gray-800 text-center">
        <h1 className="text-xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-400 mt-2">Only restaurant owners can create restaurants.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.createRestaurant({
        name,
        description: description || undefined,
        phone,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      router.push(`/restaurants/${data.restaurant.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-[#111] rounded-lg shadow-lg border border-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-white">Create Restaurant</h1>
      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Restaurant Name"
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
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 flex-1"
          />
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="bg-[#1a1a1a] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 flex-1"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating..." : "Create Restaurant"}
        </button>
      </form>
    </div>
  );
}
