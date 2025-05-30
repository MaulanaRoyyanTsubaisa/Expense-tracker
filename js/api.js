// js/api.js

import { getToken } from "./auth.js";

const API_BASE_URL = "http://localhost:3000";

const request = async (
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = true
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new Error("Authentication required. No token found.");
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    if (method !== "DELETE") {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error("API Request Failed:", endpoint, error);
    throw error;
  }
};

export const login = async (email, password) => {
  return request("/login", "POST", { email, password }, false);
};

export const register = async (email, password) => {
  return request("/register", "POST", { email, password }, false);
};

export const getExpenses = async () => {
  return request("/api/expenses", "GET", null, true);
};

export const addExpense = async (date, description, amount) => {
  return request("/api/expenses", "POST", { date, description, amount }, true);
};

export const deleteExpense = async (id) => {
  return request(`/api/expenses/${id}`, "DELETE", null, true);
};

export const getUser = async () => {
  return request("/api/user", "GET", null, true);
};
