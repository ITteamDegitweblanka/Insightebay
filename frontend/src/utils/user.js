// Get the user object from the JWT token in localStorage


import jwt_decode from "jwt-decode";
import { getToken } from "./auth";

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    // jwt-decode v4+ uses only a named export, not default
    return jwt_decode.jwtDecode ? jwt_decode.jwtDecode(token) : jwt_decode(token);
  } catch {
    return null;
  }
}

export function isAdmin() {
  const user = getUser();
  return user?.isAdmin === true || user?.isAdmin === 1;
}
