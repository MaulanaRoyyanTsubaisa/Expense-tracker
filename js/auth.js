const TOKEN_KEY = "user_token";

export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token to localStorage:", error);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token from localStorage:", error);
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};
