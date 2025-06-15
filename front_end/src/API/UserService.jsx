import axiosClient from './axiosClient';

const UserService = {
    // Lấy thông tin profile của user hiện tại

    // Cập nhật thông tin profile
    updateUserProfile: async (data) => {
        try {
            const response = await axiosClient.put('/users/me', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật avatar
    updateAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosClient.put('/users/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default UserService;