import axiosClient from '../API/axiosClient';

export const testAuthentication = async () => {
  try {
    console.log('🧪 Testing authentication...');
    
    // Get session from localStorage
    const sessionStr = localStorage.getItem('session');
    if (!sessionStr) {
      console.error('❌ No session found in localStorage');
      return false;
    }

    const session = JSON.parse(sessionStr);
    console.log('📋 Session data:', session);

    // Test with a simple authenticated endpoint
    const response = await axiosClient.get('/users/id/5');
    console.log('✅ Authentication test successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    return false;
  }
};

export const testSellerEndpoint = async (sellerId) => {
  try {
    console.log('🧪 Testing seller endpoint for ID:', sellerId);
    
    const response = await axiosClient.get(`/seller/${sellerId}/courses/managed`);
    console.log('✅ Seller endpoint test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Seller endpoint test failed:', error);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    throw error;
  }
};