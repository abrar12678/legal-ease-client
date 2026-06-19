import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export default authClient;
export const { signIn, signUp, useSession, signOut } = authClient;

/**
 * Custom authenticated fetch for calling the Express backend.
 *
 * How it works:
 * 1. Calls /api/auth/get-session (Better Auth endpoint on Next.js side) to get the token
 * 2. Uses the Next.js rewrites to proxy /api/lawyers, /api/hirings, etc. to localhost:5000
 * 3. Attaches the session token as Bearer Authorization header
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

  // Step 2: Build the URL (uses Next.js rewrite → localhost:5000)
  const url = `${path}`;

  // Step 3: Build headers
  const headers = {
    "Content-Type": "application/json",
    ...((options.headers) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Step 4: Make the request
  const config = {
    ...options,
    headers,
  };

  // Body handling: if it's already a string, use it directly
  if (options.body && typeof options.body === "string") {
    config.body = options.body;
  } else if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();
  return data;
}
