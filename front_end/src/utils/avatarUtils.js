// Avatar utility functions for consistent avatar display across the app

/**
 * Generate a consistent avatar URL for a user based on their name and ID
 * @param {string} name - User's full name
 * @param {number|string} id - User's ID for consistency
 * @param {number} size - Avatar size (default: 200)
 * @returns {string} Avatar URL
 */
export const generateAvatar = (name, id, size = 200) => {
  if (!name) return null;
  
  // Use a consistent background color based on user ID
  const colors = [
    '3B82F6', // blue
    '6366F1', // indigo
    '8B5CF6', // violet
    'A855F7', // purple
    'EC4899', // pink
    'EF4444', // red
    'F59E0B', // amber
    '10B981', // emerald
    '06B6D4', // cyan
    '84CC16'  // lime
  ];
  
  // Use ID to pick a consistent color
  const colorIndex = id ? Math.abs(Number(id)) % colors.length : 0;
  const backgroundColor = colors[colorIndex];
  
  // Generate avatar with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${backgroundColor}&color=fff&size=${size}&rounded=true&font-size=0.6`;
};

/**
 * Get avatar URL with fallback handling
 * @param {string|null} avatarUrl - Original avatar URL from server
 * @param {string} name - User's full name
 * @param {number|string} id - User's ID
 * @param {number} size - Avatar size
 * @returns {string} Final avatar URL to use
 */
export const getAvatarUrl = (avatarUrl, name, id, size = 200) => {
  // If we have a valid avatar URL, use it
  if (avatarUrl && avatarUrl.startsWith('http')) {
    return avatarUrl;
  }
  
  // Otherwise, generate a consistent avatar
  return generateAvatar(name, id, size);
};

/**
 * Handle avatar error with consistent fallback
 * @param {Event} event - The error event
 * @param {string} name - User's full name
 * @param {number|string} id - User's ID
 * @param {number} size - Avatar size
 */
export const handleAvatarError = (event, name, id, size = 200) => {
  const img = event.target;
  
  // Try different background color as fallback
  const fallbackColors = ['6366F1', '8B5CF6', 'EF4444', '10B981'];
  const colorIndex = Math.abs(Number(id)) % fallbackColors.length;
  const fallbackColor = fallbackColors[colorIndex];
  
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${fallbackColor}&color=fff&size=${size}&rounded=true&font-size=0.6`;
  
  // Prevent infinite error loop
  img.onerror = null;
}; 