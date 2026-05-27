"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#111] border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-red-500">
        Zomato
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/restaurants" className="text-sm text-gray-400 hover:text-white transition-colors">
          Restaurants
        </Link>
        {user ? (
          <>
            {user.role === "RESTAURANT_OWNER" && (
              <Link
                href="/restaurants/create"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Create Restaurant
              </Link>
            )}
            <span className="text-sm text-gray-500">{user.name}</span>
            <button
              onClick={logout}
              className="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition-colors"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
