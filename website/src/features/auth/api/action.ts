"use server";

import { cookies } from "next/headers";
import { formatExternalUrl } from "@/lib/utils";
import { signupSchema } from "@/lib/types";

export async function logIn(credentials: { email: string; password: string }) {
  const apiUrl = formatExternalUrl("/login");
  console.log(JSON.stringify(credentials))
  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  console.log(data);

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

export async function logOut() {
  const apiUrl = formatExternalUrl("/logout");
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
  const apiUrl = formatExternalUrl("/auth/google/callback?code=" + code);
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

export async function signUp(formData: unknown) {
  // Validate the data using Zod schema
  const result = signupSchema.safeParse(formData);
  let zodErrors = {};

  // Collect validation errors if any
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
  }

  // If validation failed, return the error response
  if (Object.keys(zodErrors).length > 0) {
    return { errors: zodErrors, status: 400 };
  }

  // Prepare data to be sent to Golang backend
  const dataToBeSent = {
    name: `${result.data?.firstName} ${result.data?.lastName}`,
    email: result.data?.email,
    password: result.data?.password,
    phone: result.data?.phone,
  };

  const apiUrl = formatExternalUrl("/signup");
  const res = await fetch(apiUrl, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToBeSent), // Send validated data
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
