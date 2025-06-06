import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { useSearchParams } from "react-router-dom";

const PasswordStrength = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div
          className={`h-full ${getColor()} rounded-full transition-all duration-300`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs mt-1 text-gray-500">
        {strength === 0 && "Enter password"}
        {strength === 1 && "Weak"}
        {strength === 2 && "Fair"}
        {strength === 3 && "Good"}
        {strength === 4 && "Strong"}
      </p>
    </div>
  );
};

const VerificationPage = ({ email, onResend }) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900">Verify your email</h2>
      <p className="text-gray-600">We have sent a verification link to</p>
      <p className="font-medium text-gray-800">{email}</p>
      <p className="text-gray-600">Please check your inbox and click the link to verify your account</p>
      <div className="pt-4">
        <button
          onClick={onResend}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
};

const SendEmail = () => {
  const [authState, setAuthState] = useState("sendEmail");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
    phone: "",
    rememberMe: false,
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value); 
  };

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (value && !validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (value && !validatePassword(value)) {
          error = "Password must be at least 8 characters long and include uppercase, number, and special character";
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          error = "Full name is required";
        }
        break;
      case "username":
        if (value.trim() === "") {
          error = "Username is required";
        }
        break;
      case "phone":
        if (value.trim() === "") {
          error = "Phone number is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (type !== "checkbox") {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    if (name === "password" && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? "Passwords do not match" : "";
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach(field => {
      if (field !== "rememberMe" && field !== "termsAccepted") {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    if (authState === "register" && !formData.termsAccepted) {
      newErrors.terms = "Please accept terms and conditions";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (authState === "register" || authState === "forgot") {
        setIsVerificationSent(true);
      } else {
        console.log("Form submitted:", formData);
      }
    }
    if(authState === "login"){
      console.log("login :", formData);
    } else {
      if(authState === "register"){
        console.log("register :", formData);
      } else {
        console.log("send vertical :", formData);
      }
    }
  };

  const handleResendVerification = () => {
    console.log("Resending verification email to:", formData.email);
  };

  const isFormValid = () => {
    if (authState === "login") {
      return validateEmail(formData.email) && captchaValue;
    } else if (authState === "register") {
      return validateEmail(formData.email) && 
             validatePassword(formData.password) && 
             formData.password === formData.confirmPassword && 
             formData.fullName && 
             formData.username && 
             formData.phone && 
             formData.termsAccepted;
    } else {
      return validateEmail(formData.email);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Sending Verify
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleInputChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          Send reset link
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to sign in
        </button>
      </div>
    </>      
  );
};

export default SendEmail;