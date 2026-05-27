const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  // Auth
  signup(body: { email: string; password: string; name: string; phone: string; role: string }) {
    return this.request<{ token: string; user: import("./types").User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  login(body: { email: string; password: string }) {
    return this.request<{ token: string; user: import("./types").User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // Restaurants
  getRestaurants() {
    return this.request<{ restaurants: import("./types").Restaurant[] }>("/restaurant");
  }

  getRestaurant(id: string) {
    return this.request<{ restaurant: import("./types").Restaurant }>(`/restaurant/${id}`);
  }

  createRestaurant(body: {
    name: string;
    description?: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
  }) {
    return this.request<{ restaurant: import("./types").Restaurant }>("/restaurant", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  // Menu Items
  createMenuItem(body: {
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    isAvailable: boolean;
  }) {
    return this.request<{ menuItem: import("./types").MenuItem }>("/restaurants/menu", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();
