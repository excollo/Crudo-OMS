import { jwtDecode } from "jwt-decode"; // Changed to named import

const isValidToken = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token); // Use jwtDecode instead of jwt_decode
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};

const setAuthToken = (token) => {
  if (token && isValidToken(token)) {
    localStorage.setItem("token", token);
    return true;
  }
  return false;
};

const getAuthToken = () => localStorage.getItem("token");

const removeAuthToken = () => localStorage.removeItem("token");

const AuthUtils = {
  isValidToken,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
};

export { isValidToken, setAuthToken, getAuthToken, removeAuthToken };
export default AuthUtils;
