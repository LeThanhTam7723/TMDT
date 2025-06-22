import axiosClient from './axiosClient';

const favoriteService = {
    // Lấy danh sách favorites của user
    getUserFavorites: (userId, token) => {
        return axiosClient.get(`/favorites/idUser/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Thêm course vào favorites
    addToFavorites: (userId, courseId) => {
        return axiosClient.post('/favorites/add', {
            userId: userId,
            productId: courseId
        });
    },

    // Xóa course khỏi favorites
    removeFromFavorites: (userId, courseId) => {
        return axiosClient.delete('/favorites/remove', {
            data: {
                userId: userId,
                productId: courseId
            }
        });
    },

    // Kiểm tra course có trong favorites không (dựa trên danh sách favorites)
    checkFavorite: async (userId, courseId) => {
        try {
            const response = await favoriteService.getUserFavorites(userId);
            const favorites = response.data.result || [];
            return favorites.some(course => course.id === courseId);
        } catch (error) {
            console.error('Error checking favorite:', error);
            return false;
        }
    }
};

export default favoriteService; 