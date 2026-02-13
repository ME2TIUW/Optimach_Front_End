import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    // Check if expiration time is in the past
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return true; 
  }
};