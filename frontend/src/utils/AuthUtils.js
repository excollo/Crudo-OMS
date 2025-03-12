import { jwtDecode } from "jwt-decode";

export const isValidToken = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const setAuthToken = (token) => {
  if (token && isValidToken(token)) {
    localStorage.setItem("accessToken", token);
    return true;
  }
  return false;
};

export const getAuthToken = () => localStorage.getItem("accessToken");

export const removeAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AuthUtils = {
  isValidToken,
  setAuthToken,
  getAuthToken,
  removeAuthTokens,
  getAuthHeader,
};

export default AuthUtils;
