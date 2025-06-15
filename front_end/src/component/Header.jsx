import React, { useState, useEffect, useContext } from "react";
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX, FiMic, FiBell, FiUser } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import { introspect, logOutApi } from "../API/AuthService";
import { ProductContext, useProduct } from '../context/ProductContext';


const Header = () => {
  const {favorites,setSession}= useContext(ProductContext);
  const [isToken, setIsToken] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites).length : 0;
  });
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
  const cartClick = () => {
    navigate('/cart'); // Chuyển sang trang /cart
  };
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
          setCartCount(0);
        }
      }
    };
    check();
  }, [isLogin]);
  const [notificationCount, setNotificationCount] = useState(3); // Add notification count state

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop", hasDropdown: true },
    { name: "Pages", link: "#", hasDropdown: true },
    { name: "Blog", link: "/user-info" },
    { name: "Contact", link: "/video" },
  ];

  const updateFavoriteCount = () => {
    const savedFavorites = localStorage.getItem('favorites');
    setFavoriteCount(savedFavorites ? JSON.parse(savedFavorites).length : 0);
  };

  useEffect(() => {
    window.addEventListener('storage', updateFavoriteCount);
    updateFavoriteCount();
    return () => {
      window.removeEventListener('storage', updateFavoriteCount);
    };
  }, []);

  const { cart } = useProduct ? useProduct() : { cart: [] };

  useEffect(() => {
    // Update cart count when cart changes
    if (cart && Array.isArray(cart)) {
      setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
    } else {
      // Fallback: get from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartArr = JSON.parse(savedCart);
        setCartCount(cartArr.reduce((sum, item) => sum + (item.quantity || 1), 0));
      } else {
        setCartCount(0);
      }
    }
  }, [cart]);

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartArr = JSON.parse(savedCart);
        setCartCount(cartArr.reduce((sum, item) => sum + (item.quantity || 1), 0));
      } else {
        setCartCount(0);
      }
    };
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

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
              
              

              {menuItems.slice(1).map((item, index) => (
                <div key={index} className="relative group">
                  <a
                    href={item.link}
                    className="text-gray-300 hover:text-blue-400 flex items-center"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <MdKeyboardArrowDown className="ml-1" />
                    )}
                  </a>
                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 w-48 bg-gray-800 shadow-lg rounded-md py-2 hidden group-hover:block">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Submenu 1</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Submenu 2</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Submenu 3</a>
                    </div>
                  )}
                </div>
              ))}
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-60 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-gray-300 focus:outline-none focus:border-blue-500"
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
                {/* Notification Icon */}
                <div className="relative">
                  <FiBell className="text-2xl text-gray-300 hover:text-blue-400 cursor-pointer" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
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
                {/* Cart Icon */}
                <div className="relative">
                  <FiShoppingCart className="text-2xl text-gray-300 hover:text-blue-400 cursor-pointer" onClick={cartClick}/>
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
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
                      <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</a>
                      <a onClick={async() => {
                        console.log(isToken);
                        await logOutApi({token:isToken});localStorage.clear();
                        setIsLogin(false);
                        setIsOpen(false);
                      }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Logout</a>
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
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <a
                      href={item.link}
                      className="block text-gray-300 hover:text-blue-400 py-2"
                    >
                      {item.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;