import React, { createContext, useContext, useState, useEffect } from 'react';
import favoriteService from '../API/favoriteService';
import CourseService from '../API/CourseService';

export const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [session, setSession] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

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
            // Add default values for frontend compatibility
            image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
            category: course.categoryName || "General",
            age: "18+ year old",
            ratingCount: Math.floor(Math.random() * 500) + 50,
            owner: {
              name: course.sellerName || "Unknown",
              avatar: "https://randomuser.me/api/portraits/women/1.jpg",
              experience: "5+ years teaching",
              qualifications: ["TEFL", "Teaching Specialist"],
              students: Math.floor(Math.random() * 1000) + 100,
              rating: 4.5
            },
            totalHour: Math.floor(Math.random() * 30) + 10,
            lessons: Math.floor(Math.random() * 20) + 5,
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
        console.log(response.data.result);
      } catch (error) {
        console.error('Lỗi khi fetch danh sách yêu thích:', error);
      }
    };
    fetchFavorites();
  }, [session]);

  const toggleFavorite = async (productId) => {
    try {
      const userId = 1; // TODO: Get from auth context
      const isInFavorites = favorites.some(item => item.course && item.course.id === productId);
      
      if (isInFavorites) {
        await favoriteService.removeFromFavorites(userId, productId);
        setFavorites(prev => prev.filter(item => item.course && item.course.id !== productId));
      } else {
        const response = await favoriteService.addToFavorites(userId, productId);
        setFavorites(prev => [...prev, response.data.result]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isInFavorites = (productId) => {
    if (!Array.isArray(favorites)) return false;
    return favorites.some(item => item.course && item.course.id === productId);
  };

  const getFavoriteProducts = () => {
    if (!Array.isArray(favorites)) return [];
    return favorites.map(item => item.course).filter(course => course != null);
  };

  const loadUserFavorites = async (userId) => {
    try {
      const response = await favoriteService.getUserFavorites(userId);
      setFavorites(response.data.result);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
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
          // Add default values for frontend compatibility
          image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
          category: course.categoryName || "General",
          age: "18+ year old",
          ratingCount: Math.floor(Math.random() * 500) + 50,
          owner: {
            name: course.sellerName || "Unknown",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            experience: "5+ years teaching",
            qualifications: ["TEFL", "Teaching Specialist"],
            students: Math.floor(Math.random() * 1000) + 100,
            rating: 4.5
          },
          totalHour: Math.floor(Math.random() * 30) + 10,
          lessons: Math.floor(Math.random() * 20) + 5,
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
          // Add default values for frontend compatibility
          image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
          category: course.categoryName || "General",
          age: "18+ year old",
          ratingCount: Math.floor(Math.random() * 500) + 50,
          owner: {
            name: course.sellerName || "Unknown",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            experience: "5+ years teaching",
            qualifications: ["TEFL", "Teaching Specialist"],
            students: Math.floor(Math.random() * 1000) + 100,
            rating: 4.5
          },
          totalHour: Math.floor(Math.random() * 30) + 10,
          lessons: Math.floor(Math.random() * 20) + 5,
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
    cart,
    session,setSession,
    loading,
    searchResults,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getFavoriteProducts, 
    toggleFavorite,
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