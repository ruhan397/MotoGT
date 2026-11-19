
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
).replace(/\/+$/, "");

const RETRY_DELAYS = [500, 1000];
const TIMEOUT_MS = 10000;

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Refresh Access Token

async function refreshAccessToken(role) {
  const endpoint =
    role === "admin" ? "/auth/admin/refresh" : "/auth/refresh";

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    TIMEOUT_MS
  );

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      signal: controller.signal,
    });

    // Clear login data only if the refresh session is invalid

    if (response.status === 401 || response.status === 403) {
      const tokenKey =
        role === "admin" ? "motogtAdminToken" : "motogtToken";

      const userKey =
        role === "admin" ? "motogtAdminUser" : "motogtUser";

      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);

      throw new Error("SESSION_EXPIRED");
    }

    if (!response.ok) {
      throw new Error("SESSION_REFRESH_FAILED");
    }

    const data = await response.json();

    if (!data.token) {
      throw new Error("New access token not received");
    }

    const tokenKey =
      role === "admin" ? "motogtAdminToken" : "motogtToken";

    localStorage.setItem(tokenKey, data.token);

    return data.token;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Detect Customer or Admin

function getAuthRole(headers) {
  const authorization = headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.split(" ")[1];

  if (token === localStorage.getItem("motogtAdminToken")) {
    return "admin";
  }

  if (token === localStorage.getItem("motogtToken")) {
    return "customer";
  }

  return null;
}

// API Request

export async function apiFetch(path, options = {}, allowRefresh = true) {
  const method = (options.method || "GET").toUpperCase();
  const canRetry = method === "GET" || method === "HEAD";
  const maxAttempts = canRetry ? 3 : 1;

  const cleanPath = path.replace(/^\/+/, "");
  const url = `${API_BASE_URL}/${cleanPath}`;

  const headers = new Headers(options.headers || {});

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMEOUT_MS
    );

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Automatic Token Refresh

      if (response.status === 401 && allowRefresh) {
        const role = getAuthRole(headers);

        if (role) {
          try {
            const newToken = await refreshAccessToken(role);

            const newHeaders = new Headers(headers);
            newHeaders.set("Authorization", `Bearer ${newToken}`);

            return apiFetch(
              path,
              { ...options, headers: newHeaders },
              false
            );
          } catch (error) {
            if (error.message === "SESSION_EXPIRED") {
              throw new Error(
                "Your session has expired. Please login again."
              );
            }

            throw new Error(
              "Could not refresh your session. Please check your connection and try again."
            );
          }
        }
      }

      // Retry failed GET requests

      if (
        canRetry &&
        response.status >= 500 &&
        attempt < maxAttempts - 1
      ) {
        await response.body?.cancel();
        await wait(RETRY_DELAYS[attempt]);
        continue;
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (
        error.message ===
          "Your session has expired. Please login again." ||
        error.message ===
          "Could not refresh your session. Please check your connection and try again."
      ) {
        throw error;
      }

      if (!canRetry || attempt === maxAttempts - 1) {
        if (error.name === "AbortError") {
          throw new Error(
            "Server response timed out. Please try again."
          );
        }

        throw new Error(
          "Unable to connect to MotoGT server. Please check your connection."
        );
      }

      await wait(RETRY_DELAYS[attempt]);
    }
  }
}
