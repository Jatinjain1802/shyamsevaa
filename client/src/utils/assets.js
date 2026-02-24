/**
 * Utility to get the full URL for an asset (image, PDF, etc.)
 * prepending the server URL if the path is relative.
 */
export const getAssetUrl = (path) => {
    if (!path) return "";

    // If it's already a full URL or a relative path that doesn't start with /uploads, return as is
    if (path.startsWith("http") || path.startsWith("data:") || !path.startsWith("/uploads")) {
        return path;
    }

    // Get the base server URL from VITE_API_URL
    // VITE_API_URL = "https://serverr.shyampuja.com/api"
    // We want "https://serverr.shyampuja.com"
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const serverBase = apiUrl.replace("/api", "");

    return `${serverBase}${path}`;
};
