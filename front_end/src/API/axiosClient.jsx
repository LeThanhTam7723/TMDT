import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    // Define exact public endpoints that don't need authentication
    const publicEndpoints = [
      "/auth/login",
      "/auth/introspect", 
      "/auth/logout",
      "/users/createUser",
      "/users/existUser",
      "/verifyRegister",
    ];
    
    // Define public URL patterns that start with these paths
    const publicUrlPatterns = [
      "/courses",           // All course APIs are public for browsing
      "/favorites/idUser/", // Get user favorites is public
      "/auth/",
      "/verifyRegister/",
    ];
    
    // Define public seller endpoints (only these specific ones)
    const publicSellerEndpoints = [
      /\/seller\/\d+$/, // GET /seller/{courseId} - get seller by course
      /\/seller\/\d+\/courses$/, // GET /seller/{sellerId}/courses - public course list
    ];
    
    // Get the base URL without query parameters for comparison
    const baseUrl = config.url?.split('?')[0] || '';
    // Normalize URL to handle both /users/existUser and users/existUser
    const normalizedUrl = baseUrl.startsWith('/') ? baseUrl : '/' + baseUrl;
    
    console.log("🔍 Checking URL:", config.url, "| Base:", baseUrl, "| Normalized:", normalizedUrl);
    
    const shouldSkipAuth = publicEndpoints.includes(baseUrl) ||
                          publicEndpoints.includes(normalizedUrl) ||
                          publicUrlPatterns.some(pattern => baseUrl.startsWith(pattern)) ||
                          publicUrlPatterns.some(pattern => normalizedUrl.startsWith(pattern)) ||
                          publicSellerEndpoints.some(pattern => pattern.test(baseUrl));

    if (shouldSkipAuth) {
      console.log("🔓 Skipping auth for:", config.url);
      return config;
    }

    try {
      const sessionStr = localStorage.getItem("session");
      if (!sessionStr) {
        console.warn("⚠️ No session found in localStorage for:", config.url);
        return config;
      }

      const session = JSON.parse(sessionStr);
      console.log("📋 Session data:", session);
      const token = session?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token attached for:", config.url, "Token:", token.substring(0, 20) + "...");
      } else {
        console.warn("⚠️ No token found in session for:", config.url, "Session:", session);
      }
    } catch (err) {
      console.error("❌ Error parsing session from localStorage:", err);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("🚫 Authentication failed for:", error.config?.url);
      console.error("🚫 Response:", error.response?.data);
      
      // Clear expired session from localStorage
      const sessionStr = localStorage.getItem("session");
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          console.log("🧹 Clearing expired session for token ending in:", session.token?.slice(-10));
          localStorage.removeItem('session');
          // Trigger session update event
          window.dispatchEvent(new Event('sessionUpdated'));
        } catch (err) {
          console.error("Error parsing session during cleanup:", err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
