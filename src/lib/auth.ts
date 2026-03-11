const AUTH_KEY = "ndatrace_auth";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function login(email: string, password: string): boolean {
  // Demo credentials
  if (email && password.length >= 6) {
    localStorage.setItem(AUTH_KEY, "true");

    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}
