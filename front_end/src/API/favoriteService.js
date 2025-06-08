import axiosClient from './axiosClient';

const favoriteService = {
    getUserFavorites: (userId) => {
        return axiosClient.get(`/api/favorites/user/${userId}`);
    },

    addToFavorites: (userId, courseId) => {
        return axiosClient.post(`/api/favorites/user/${userId}/course/${courseId}`);
    },

    removeFromFavorites: (userId, courseId) => {
        return axiosClient.delete(`/api/favorites/user/${userId}/course/${courseId}`);
    },

    checkFavorite: (userId, courseId) => {
        return axiosClient.get(`/api/favorites/user/${userId}/course/${courseId}/check`);
    }
};

export default favoriteService; 