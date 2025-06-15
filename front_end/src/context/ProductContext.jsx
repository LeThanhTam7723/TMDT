import React, { createContext, useContext, useState, useEffect } from 'react';
import favoriteService from '../API/favoriteService';

export const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products] = useState([
    {
      id: 1,
      name: "IELTS Intensive",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
      category: "IELTS",
      age: "13-18 year old",
      rating: 4.8,
      ratingCount: 320,
      owner: {
        name: "Ms. Emma",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        experience: "8 years teaching IELTS",
        qualifications: ["CELTA", "DELTA", "MA in TESOL"],
        students: 1200,
        rating: 4.9
      },
      description: "Boost your IELTS score with intensive practice and expert tips.",
      totalHour: 30,
      lessons: 20,
      level: "Intermediate",
      duration: "Medium-term (3-6 months)",
      features: ["Live classes", "Mock tests", "Personal feedback", "Study materials"]
    },
    {
      id: 2,
      name: "Business English Pro",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
      category: "Business English",
      age: "18+ year old",
      rating: 4.7,
      ratingCount: 210,
      owner: {
        name: "Mr. John",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        experience: "10 years in corporate training",
        qualifications: ["MBA", "TEFL", "Business Communication Specialist"],
        students: 800,
        rating: 4.8
      },
      description: "Master business communication and professional English skills.",
      totalHour: 28,
      lessons: 18,
      level: "Upper Intermediate",
      duration: "Short-term (1-3 months)",
      features: ["Business case studies", "Role-plays", "Industry-specific vocabulary"]
    },
    {
      id: 3,
      name: "English for Kids",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
      category: "Kids English",
      age: "4-12 year old",
      rating: 4.9,
      ratingCount: 400,
      owner: {
        name: "Ms. Linda",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        experience: "6 years teaching young learners",
        qualifications: ["TEFL", "Young Learners Specialist"],
        students: 950,
        rating: 4.9
      },
      description: "Fun and interactive English lessons for children.",
      totalHour: 22,
      lessons: 15,
      level: "Beginner",
      duration: "Long-term (6+ months)",
      features: ["Interactive games", "Songs and stories", "Parent progress reports", "Small group classes"]
    },
    {
      id: 4,
      name: "Conversation Mastery",
      price: 69.99,
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
      category: "Conversation",
      age: "18+ year old",
      rating: 4.6,
      ratingCount: 180,
      owner: {
        name: "Mr. David",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        experience: "7 years in conversation teaching",
        qualifications: ["CELTA", "Conversation Specialist"],
        students: 650,
        rating: 4.7
      },
      description: "Speak English confidently in daily and travel situations.",
      totalHour: 20,
      lessons: 12,
      level: "Elementary",
      duration: "Short-term (1-3 months)",
      features: ["Daily conversation practice", "Cultural insights", "Pronunciation focus", "Travel vocabulary"]
    },
    {
      id: 5,
      name: "Grammar Essentials",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
      category: "Grammar",
      age: "13-18 year old",
      rating: 4.5,
      ratingCount: 150,
      owner: {
        name: "Ms. Sarah",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        experience: "5 years teaching grammar",
        qualifications: ["MA in Linguistics", "Grammar Specialist"],
        students: 500,
        rating: 4.6
      },
      description: "Solidify your English grammar foundation with easy explanations.",
      totalHour: 18,
      lessons: 10,
      level: "Intermediate",
      duration: "Medium-term (3-6 months)",
      features: ["Clear explanations", "Practice exercises", "Grammar quizzes", "Writing practice"]
    },
    {
      id: 6,
      name: "General English Skills",
      price: 64.99,
      image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80",
      category: "General English",
      age: "18+ year old",
      rating: 4.7,
      ratingCount: 220,
      owner: {
        name: "Mr. Alex",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        experience: "9 years teaching general English",
        qualifications: ["DELTA", "General English Specialist"],
        students: 1100,
        rating: 4.8
      },
      description: "Improve your overall English for work, study, and life.",
      totalHour: 25,
      lessons: 14,
      level: "Upper Intermediate",
      duration: "Long-term (6+ months)",
      features: ["Comprehensive curriculum", "Speaking practice", "Reading comprehension", "Writing skills"]
    }
  ]);
  const [session, setSession] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

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
      const isInFavorites = favorites.some(item => item.course.id === productId);
      
      if (isInFavorites) {
        await favoriteService.removeFromFavorites(userId, productId);
        setFavorites(prev => prev.filter(item => item.course.id !== productId));
      } else {
        const response = await favoriteService.addToFavorites(userId, productId);
        setFavorites(prev => [...prev, response.data.result]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isInFavorites = (productId) => {
    return favorites.some(item => item.course.id === productId);
  };

  const getFavoriteProducts = () => {
    return favorites.map(item => item.course);
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

  const value = {
    products,
    favorites,
    setFavorites,
    cart,
    session,setSession,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getFavoriteProducts, toggleFavorite,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 