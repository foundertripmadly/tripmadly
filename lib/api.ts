const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;

/**
 * 🔐 Generic API fetch (keep this for auth, payments, etc.)
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}

/**
 * 🌐 Strapi API fetch (NEW - for CMS content)
 */
export async function fetchAPI(
  path: string,
  options: RequestInit = {}
) {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      next: { revalidate: 60 }, // 🔥 caching
    });

    if (!res.ok) {
      throw new Error(`Strapi Error: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Strapi API Error:", error);
    return { data: [] };
  }
}

/**
 * 🖼️ Helper for images
 */
export function getStrapiURL(path: string = "") {
  return `${STRAPI_URL}${path}`;
}