import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export default authClient;
export const { signIn, signUp, useSession, signOut } = authClient;

/**
 * Custom authenticated fetch for calling the Express backend.
 * Same pattern as HireLoop's protectedFetch.
 *
 * How it works:
 * 1. Calls /api/auth/get-session (Better Auth endpoint on Next.js side) to get the session token
 * 2. Attaches the token as Bearer Authorization header
 * 3. Backend's verifyToken middleware checks the token against the session collection in DB
 */
export async function apiFetch(path, options = {}) {
  // Step 1: Get the session token from Better Auth
  let token = null;
  try {
    const res = await fetch("/api/auth/get-session", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      // Better Auth stores the token in session.token
      token = data?.token || data?.session?.token;
    }
  } catch {
    // silently ignore — request will proceed without token
  }

  // Step 2: Build headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Step 3: Build request config
  const config = {
    ...options,
    headers,
  };

  // Body handling
  if (options.body && typeof options.body === "string") {
    config.body = options.body;
  } else if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  // Step 4: Make the request
  const response = await fetch(path, config);
  const data = await response.json();
  return data;
}