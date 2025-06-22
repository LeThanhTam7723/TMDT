import React, { createContext, useContext, useState, useEffect } from 'react';
import favoriteService from '../API/favoriteService';
import CourseService from '../API/CourseService';

export const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

// Array of course images for different categories/types
const courseImages = [
  "https://study4.com/media/courses/CourseSeries/files/2023/10/11/ielts_band_0_7.webp",
  "https://m.media-amazon.com/images/I/51yBYmDJPNL._SL500_.jpg", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzaxe4xnXoGduxVSFzSGrNYLjK4vKfmtr4fg&s",
  "https://www.lingobest.com/free-online-english-course/wp-content/uploads/2021/03/Blog-Banners-Bruna-S-15-1.jpg",
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80"
];

// Function to get image based on course category or ID
const getCourseImage = (course) => {
  // If course has image from backend, use it
  if (course.image) {
    return course.image;
  }
  
  // Otherwise assign based on category or ID for variety
  const categoryImageMap = {
    1: courseImages[0], // IELTS
    2: courseImages[1], // Business English  
    3: courseImages[2], // Kids English
    4: courseImages[3], // Conversation
    5: courseImages[4], // Grammar
    6: courseImages[5], // General English
  };
  
  // Use category-based image if available, otherwise use ID-based rotation
  return categoryImageMap[course.categoryId] || courseImages[course.id % courseImages.length];
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [session, setSession] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load session from localStorage on initialization and listen for changes
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionStr = localStorage.getItem('session');
        if (sessionStr) {
          const sessionData = JSON.parse(sessionStr);
          setSession(sessionData);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Error loading session from localStorage:', error);
        setSession(null);
      }
    };

    // Load session initially
    loadSession();

    // Listen for storage changes (when session is updated in other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'session') {
        loadSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom session update events
    const handleSessionUpdate = () => {
      loadSession();
    };
    
    window.addEventListener('sessionUpdated', handleSessionUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionUpdated', handleSessionUpdate);
    };
  }, []);

  // Load courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await CourseService.getAllCourses();
        if (response.code === 200) {
          // Transform API data to match frontend format
          const transformedCourses = response.result.map(course => ({
            id: course.id,
            name: course.name,
            price: course.price,
            description: course.description,
            rating: course.rating || 0,
            categoryId: course.categoryId,
            categoryName: course.categoryName,
            sellerId: course.sellerId,
            sellerName: course.sellerName,
            status: course.status,
            // Add default values for frontend compatibility - cached to avoid repeated calculations
            image: getCourseImage(course),
            category: course.categoryName || "General",
            age: "18+ year old",
            ratingCount: (course.id * 47) % 500 + 50, // Deterministic instead of random
            owner: {
              name: course.sellerName || "Unknown",
              avatar: `https://i.pravatar.cc/150?img=${(course.id % 70) + 1}`,
              experience: "5+ years teaching",
              qualifications: ["TEFL", "Teaching Specialist"],
              students: (course.id * 73) % 1000 + 100, // Deterministic instead of random
              rating: 4.5
            },
            totalHour: (course.id * 31) % 30 + 10, // Deterministic instead of random
            lessons: (course.id * 19) % 20 + 5, // Deterministic instead of random
            level: "Intermediate",
            duration: "Medium-term (3-6 months)",
            features: ["Live classes", "Study materials", "Personal feedback"]
          }));
          setProducts(transformedCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Fallback to empty array if API fails
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.currentUser?.id || !session?.token) return;
      try {
        const response = await favoriteService.getUserFavorites(session.currentUser.id,session.token);
        setFavorites(response.data.result || []);
      } catch (error) {
        console.error('Lỗi khi fetch danh sách yêu thích:', error);
      }
    };
    fetchFavorites();
  }, [session]);

  const toggleFavorite = async (productId) => {
    try {
      if (!session?.currentUser?.id) {
        console.error('User not logged in');
        return;
      }

      const userId = session.currentUser.id;
      const isInFavorites = favorites.some(course => course.id === productId);
      
      if (isInFavorites) {
        await favoriteService.removeFromFavorites(userId, productId);
        setFavorites(prev => prev.filter(course => course.id !== productId));
      } else {
        await favoriteService.addToFavorites(userId, productId);
        // Refresh favorites list to get updated data
        const response = await favoriteService.getUserFavorites(userId, session.token);
        setFavorites(response.data.result || []);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isInFavorites = (productId) => {
    if (!Array.isArray(favorites)) return false;
    return favorites.some(course => course.id === productId);
  };

  const getFavoriteProducts = () => {
    if (!Array.isArray(favorites)) return [];
    return favorites.filter(course => course != null);
  };

  const loadUserFavorites = async (userId) => {
    try {
      const response = await favoriteService.getUserFavorites(userId);
      setFavorites(response.data.result);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };



  // Search functions
  const searchCourses = async (keyword) => {
    setLoading(true);
    try {
      const response = await CourseService.searchCourses(keyword);
      if (response.code === 200) {
        const transformedResults = response.result.map(course => ({
          id: course.id,
          name: course.name,
          price: course.price,
          description: course.description,
          rating: course.rating || 0,
          categoryId: course.categoryId,
          categoryName: course.categoryName,
          sellerId: course.sellerId,
          sellerName: course.sellerName,
          status: course.status,
          // Add default values for frontend compatibility - cached
          image: getCourseImage(course),
          category: course.categoryName || "General",
          age: "18+ year old",
          ratingCount: (course.id * 47) % 500 + 50,
          owner: {
            name: course.sellerName || "Unknown",
            avatar: `https://i.pravatar.cc/150?img=${(course.id % 70) + 1}`,
            experience: "5+ years teaching",
            qualifications: ["TEFL", "Teaching Specialist"],
            students: (course.id * 73) % 1000 + 100,
            rating: 4.5
          },
          totalHour: (course.id * 31) % 30 + 10,
          lessons: (course.id * 19) % 20 + 5,
          level: "Intermediate",
          duration: "Medium-term (3-6 months)",
          features: ["Live classes", "Study materials", "Personal feedback"]
        }));
        setSearchResults(transformedResults);
        return transformedResults;
      }
    } catch (error) {
      console.error('Error searching courses:', error);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const searchCoursesAdvanced = async (searchParams) => {
    setLoading(true);
    try {
      const response = await CourseService.searchCoursesAdvanced(searchParams);
      if (response.code === 200) {
        const transformedResults = response.result.map(course => ({
          id: course.id,
          name: course.name,
          price: course.price,
          description: course.description,
          rating: course.rating || 0,
          categoryId: course.categoryId,
          categoryName: course.categoryName,
          sellerId: course.sellerId,
          sellerName: course.sellerName,
          status: course.status,
          // Add default values for frontend compatibility - cached
          image: getCourseImage(course),
          category: course.categoryName || "General",
          age: "18+ year old",
          ratingCount: (course.id * 47) % 500 + 50,
          owner: {
            name: course.sellerName || "Unknown",
            avatar: `https://i.pravatar.cc/150?img=${(course.id % 70) + 1}`,
            experience: "5+ years teaching",
            qualifications: ["TEFL", "Teaching Specialist"],
            students: (course.id * 73) % 1000 + 100,
            rating: 4.5
          },
          totalHour: (course.id * 31) % 30 + 10,
          lessons: (course.id * 19) % 20 + 5,
          level: "Intermediate",
          duration: "Medium-term (3-6 months)",
          features: ["Live classes", "Study materials", "Personal feedback"]
        }));
        setSearchResults(transformedResults);
        return transformedResults;
      }
    } catch (error) {
      console.error('Error in advanced search:', error);
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearSearchResults = () => {
    setSearchResults([]);
  };

  const value = {
    products,
    favorites,
    setFavorites,
    session,setSession,
    loading,
    searchResults,
    getFavoriteProducts, 
    toggleFavorite,
    isInFavorites,
    searchCourses,
    searchCoursesAdvanced,
    clearSearchResults,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 