"use server";

import { CategoryProps } from "@/lib/types";
import { formatExternalUrl } from "@/lib/utils";
import { cookies } from "next/headers";

export async function ListCategories() {
  const apiUrl = formatExternalUrl(`/events/categories/list`);
  const res = await fetch(apiUrl, { cache: "no-store" });
  const data = await res.json();
  const categories: CategoryProps[] = data.categories;

  if (res.ok) {
    return categories;
  } else {
    return [];
  }
}

export async function CreatePreferences(categories: CategoryProps[]) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/users/user-preference");
  const res = await fetch(apiUrl, {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify({ categories }),
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.ok) {
    return { success: true, message: data.message, status: res.status };
  } else {
    return { success: false, error: data.error, status: res.status };
  }
}

export async function UpdatePreference(categories: CategoryProps[]) {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/users/user-preference");
  console.log(JSON.stringify({ categories }));
  const res = await fetch(apiUrl, {
    method: "PUT",
    cache: "no-store",
    body: JSON.stringify({ categories }),
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.ok) {
    return { success: true, message: data.message, status: res.status };
  } else {
    return { success: false, error: data.error, status: res.status };
  }
}

export async function GetUserPreference() {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/users/user-preference");
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const data = await res.json();
  const categories: CategoryProps[] = data.categories;

  if (res.ok) {
    return categories;
  } else {
    return null;
  }
}

export async function DeleteUserPreference() {
  const cookieStore = cookies();
  const apiUrl = formatExternalUrl("/users/user-preference");
  const res = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      Cookie: cookieStore.toString(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  const data = await res.json();

  if (res.ok) {
    return { success: true, message: data.message, status: res.status };
  } else {
    return { success: false, error: data.error, status: res.status };
  }
}
