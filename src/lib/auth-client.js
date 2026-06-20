import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export default authClient;
export const { signIn, signUp, useSession, signOut } = authClient;


export async function apiFetch(path, options = {}) {
  
  let token = null;
  try {
    const res = await fetch("/api/auth/get-session", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      
      token = data?.token || data?.session?.token;
    }
  } catch {
    
  }

  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  
  const config = {
    ...options,
    headers,
  };

  
  if (options.body && typeof options.body === "string") {
    config.body = options.body;
  } else if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  
  const response = await fetch(path, config);
  const data = await response.json();
  return data;
}