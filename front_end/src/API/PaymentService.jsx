import axiosClient from './axiosClient';

const PaymentService = {
  vnPay: async (amount,token,courseId,userId) => {
    try {
      const response = await axiosClient.get(
        `/payment/vnpay?amount=${amount}&courseId=${courseId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default PaymentService;
