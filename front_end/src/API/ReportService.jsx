import axiosClient from './axiosClient';



export const createReport = async (data) => {
  const session = JSON.parse(localStorage.getItem("session") || "{}");
  const token = session.token;

  return await axiosClient.post('/reports/create', data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default createReport;