
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
).replace(/\/+$/, "");

const RETRY_DELAYS = [500, 1000];
const TIMEOUT_MS = 10000;

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const canRetry = method === "GET" || method === "HEAD";
  const maxAttempts = canRetry ? 3 : 1;

  const cleanPath = path.replace(/^\/+/, "");
  const url = `${API_BASE_URL}/${cleanPath}`;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMEOUT_MS
    );

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
