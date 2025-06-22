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
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      "/auth/login",
      "/auth/introspect", 
      "/auth/logout",
      "/users/createUser",
      "/users/existUser",
      "/verifyRegister",
      "/courses/", // Public course APIs
      "/courses/search",
      "/courses/details",
    ];
    
    // Define public seller endpoints (only these specific ones)
    const publicSellerEndpoints = [
      /\/seller\/\d+$/, // GET /seller/{courseId} - get seller by course
      /\/seller\/\d+\/courses$/, // GET /seller/{sellerId}/courses - public course list
    ];
    
    const shouldSkipAuth = publicEndpoints.some(endpoint => config.url?.includes(endpoint)) ||
                          publicSellerEndpoints.some(pattern => pattern.test(config.url || ""));

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
      
      // Optionally clear session and redirect to login
      // localStorage.removeItem('session');
      // window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
