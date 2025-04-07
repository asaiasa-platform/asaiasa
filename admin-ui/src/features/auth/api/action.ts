"use server";

import { cookies } from "next/headers";
import { formatExternalUrl } from "@/lib/utils";

export async function signIn(credentials: { email: string; password: string }) {
  const apiUrl = formatExternalUrl("/admin/login");
  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (res.ok) {
    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      // Parse and set cookies
      setCookieHeader.split(",").forEach((cookie) => {
        const [cookieName, ...cookieValue] = cookie.split("=");
        cookies().set(
          cookieName.trim(),
          cookieValue.join("=").split(";")[0].trim()
        );
      });
    }
    return { success: true, message: data.message };
  } else {
    return { success: false, error: data.error };
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();

  const apiUrl = formatExternalUrl("/current-user-profile");
  const response = await fetch(apiUrl, {
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return { success: true, data: data };
  } else {
    return { success: false, error: "Failed to fetch user profile" };
  }
}

export async function signOut() {
  const apiUrl = formatExternalUrl("/admin/logout");
  const res = await fetch(apiUrl, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (res.ok) {
    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      // Parse and set cookies
      setCookieHeader.split(",").forEach((cookie) => {
        const [cookieName, ...cookieValue] = cookie.split("=");
        cookies().set(
          cookieName.trim(),
          cookieValue.join("=").split(";")[0].trim()
        );
      });
    }
    return { success: true, message: data.message };
  } else {
    return { success: false, error: data.error };
  }
}

export async function googleOauthCallback(code: string) {
  // console.log(code)
  const apiUrl = formatExternalUrl("/admin/auth/google/callback?code=" + code);
  // console.log(apiUrl);
  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.ok) {
    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      // Parse and set cookies
      setCookieHeader.split(",").forEach((cookie) => {
        const [cookieName, ...cookieValue] = cookie.split("=");
        cookies().set(
          cookieName.trim(),
          cookieValue.join("=").split(";")[0].trim()
        );
      });
    }
    return { success: true };
  } else {
    return { success: false, error: data.message };
  }
}
