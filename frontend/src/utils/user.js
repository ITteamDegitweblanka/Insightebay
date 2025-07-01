// Get the user object from the JWT token in localStorage


import { jwtDecode } from "jwt-decode";
import { getToken } from "./auth";

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    // jwt-decode v4+ uses only a named export, not default
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = getUser();
  return user?.isAdmin === true || user?.isAdmin === 1;
}
