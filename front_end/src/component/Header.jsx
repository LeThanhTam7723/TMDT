import React, { useState, useEffect, useContext } from "react";
import { FiSearch, FiHeart, FiMenu, FiX, FiMic, FiUser } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import { introspect, logOutApi } from "../API/AuthService";
import { ProductContext } from '../context/ProductContext';


const Header = () => {
  const context = useContext(ProductContext);
  const favorites = context?.favorites || [];
  const setSession = context?.setSession;
  const [isToken, setIsToken] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Add safety check for context
  if (!context) {
    return (
      <header className="sticky top-0 z-50 bg-gray-900 shadow-md">
        <div className="bg-gray-800 py-2">
          <div className="container mx-auto px-4 text-center">
            <div className="text-red-600 text-sm font-semibold">
              Lỗi hệ thống - Không thể kết nối với context
            </div>
          </div>
        </div>
      </header>
    );
  }
  //Tìm kiếm giọng nói
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogin,setIsLogin] = useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  if (recognition) {
  recognition.continuous = false;
  recognition.lang = "vi-VN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    setSearchQuery(text);
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    setIsListening(false);
  };
  }
  const handleVoiceSearch = () => {
  if (!recognition) {
    alert("Speech recognition is not supported in your browser");
    return;
  }

  if (isListening) {
    recognition.stop();
    setIsListening(false);
  } else {
    recognition.start();
    setIsListening(true);
  }
  };
  //
  const navigate = useNavigate(); 
  const checkToken = async (token) => {
    try {
      const response = await introspect({token});
      console.log(response.data.result.valid);
      return response.data.result.valid;
    } catch (error) {
      console.error("Lỗi kiểm tra token:", error);
      return false; // Nếu có lỗi thì coi token không hợp lệ
    }
  };
  useEffect(() => {
    const check = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      if (session && session !== "undefined") {
        const isValid = await checkToken(session.token);
        console.log("Token valid:", isValid);
        if (isValid) {
          setIsLogin(true);
          setIsToken(session.token);
          setSession(session);
        } else {
          setIsLogin(false);
        }
      }
    };
    check();
  }, [isLogin]);

  // Handle logout function
  const handleLogout = async () => {
    try {
      console.log("Logging out with token:", isToken);
      
      // Call logout API
      await logOutApi({token: isToken});
      
      // Clear all localStorage data
      localStorage.clear();
      
      // Update states
      setIsLogin(false);
      setIsOpen(false);
      setSession(null);
      
      // Navigate to home page
      navigate('/');
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, still clear local data and redirect
      localStorage.clear();
      setIsLogin(false);
      setIsOpen(false);
      setSession(null);
      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  return (
     <header className="sticky top-0 z-50 bg-gray-900 shadow-md">
    {/* <header className={`w-full ${isSticky ? "fixed top-0 shadow-lg bg-white" : ""}`}> */}
      {/* Top Bar */}
      <div className="bg-gray-800 py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center">
              <MdEmail className="mr-2" />
              <span>info@example.com</span>
            </div>
            <div className="flex items-center">
              <MdPhone className="mr-2" />
              <span>+1 234 567 8900</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              <FaFacebookF className="text-gray-300 hover:text-blue-400 cursor-pointer" />
              <FaTwitter className="text-gray-300 hover:text-blue-400 cursor-pointer" />
              <FaInstagram className="text-gray-300 hover:text-pink-400 cursor-pointer" />
              <FaLinkedinIn className="text-gray-300 hover:text-blue-400 cursor-pointer" />
            </div>
            <div className="flex items-center space-x-4">
              <select className="bg-transparent text-sm text-gray-300 focus:outline-none">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-gray-900 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="w-48">
              <Link to="/">
                <img 
                  src={logo}
                  alt="Logo" 
                  className="h-14 w-auto object-contain cursor-pointer"
                  style={{ maxWidth: '200px' }}
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-blue-400 flex items-center">Home</a>
              <a href="/shop" className="text-gray-300 hover:text-blue-400 flex items-center">Shop</a>
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  placeholder="Search courses..."
                  className="w-60 px-4 py-2 pl-10 rounded-full bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:border-blue-500"
                />
                <FiSearch 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                    } else {
                      navigate('/shop');
                    }
                  }}
                />
                <button onClick={handleVoiceSearch}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${isListening ? "text-red-500" : "text-gray-400"} hover:bg-gray-800`}
                >
                  <FiMic className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {/* Favorite Icon */}
                <div className="relative">
                  <FiHeart 
                      className="text-2xl text-gray-300 hover:text-blue-400 cursor-pointer" 
                      onClick={() => navigate('/favorites')}
                  />
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                  </span>
                </div>

                {/* User Avatar */}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700" 
                  onClick={()=> {console.log("isLogin"+isLogin);isLogin ? setIsOpen(!isOpen) : navigate('/auth/login');}}
                  >
                    <FiUser className="text-xl text-gray-300" />
                  </div>
                  {isOpen && (
                    <div className="absolute top-full right-0 w-48 bg-gray-800 shadow-lg rounded-md py-2 mt-2">
                      <a href="/user-info" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</a>
                      <a href="/UserHistory" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">History</a>
                      <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer">Logout</a>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
            <div className="absolute top-0 right-0 w-64 h-full bg-gray-900 shadow-lg py-4 px-6">
              <div className="flex justify-end">
                <button onClick={() => setIsMenuOpen(false)}>
                  <FiX size={24} className="text-gray-300" />
                </button>
              </div>
              <div className="mt-8 space-y-4">
                <a href="/" className="block text-gray-300 hover:text-blue-400 py-2">Home</a>
                <a href="/shop" className="block text-gray-300 hover:text-blue-400 py-2">Shop</a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;