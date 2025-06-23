// Seller utility functions for consistent seller data generation

/**
 * Generate a consistent phone number based on seller ID
 * @param {number|string} sellerId - Seller's ID
 * @returns {string} Formatted phone number
 */
export const generateConsistentPhone = (sellerId) => {
  const base = 100000000;
  const phoneNumber = base + (Math.abs(Number(sellerId)) * 123456789) % 900000000;
  return `+84 ${phoneNumber}`;
};

/**
 * Generate consistent gender based on seller ID
 * @param {number|string} sellerId - Seller's ID
 * @returns {string} Gender ('male' or 'female')
 */
export const generateConsistentGender = (sellerId) => {
  return (Number(sellerId) % 2 === 0) ? "female" : "male";
};

/**
 * Generate consistent course count based on seller ID
 * @param {number|string} sellerId - Seller's ID
 * @returns {number} Course count
 */
export const generateConsistentCourseCount = (sellerId) => {
  return Math.floor((Math.abs(Number(sellerId)) * 7) % 15) + 5;
};

/**
 * Generate consistent student count based on seller ID
 * @param {number|string} sellerId - Seller's ID
 * @returns {number} Student count
 */
export const generateConsistentStudentCount = (sellerId) => {
  return Math.floor((Math.abs(Number(sellerId)) * 123) % 2000) + 500;
};

/**
 * Generate consistent rating based on seller ID
 * @param {number|string} sellerId - Seller's ID
 * @returns {number} Rating (4.0 - 5.0)
 */
export const generateConsistentRating = (sellerId) => {
  return Number(((Math.abs(Number(sellerId)) * 0.7) % 1 + 4).toFixed(1));
};

/**
 * Create complete seller mock data based on ID and name
 * @param {number|string} sellerId - Seller's ID
 * @param {string} sellerName - Seller's name
 * @param {string} categoryName - Course category name
 * @returns {object} Complete seller object
 */
export const createConsistentSellerData = (sellerId, sellerName, categoryName = 'language education') => {
  return {
    id: sellerId,
    fullname: sellerName,
    email: `${sellerName.toLowerCase().replace(/\s/g, "")}@teacher.edu`,
    introduce: `Experienced English instructor specializing in ${categoryName}. Passionate about helping students achieve their learning goals with proven teaching methods and personalized approach.`,
    phone: generateConsistentPhone(sellerId),
    certificate: "TESOL/TEFL Certified",
    gender: generateConsistentGender(sellerId),
    // Stats
    courseCount: generateConsistentCourseCount(sellerId),
    studentCount: generateConsistentStudentCount(sellerId),
    rating: generateConsistentRating(sellerId)
  };
}; 