import axiosClient from "./axiosClient";

const signIn = async (body) => {
  return await axiosClient.post("/auth/login", body);
};

const register = async (body) => {
  return await axiosClient.post("/users/createUser", body);
};

const checkEmailExists = async (email) => {
  const session = JSON.parse(localStorage.getItem("session") || "{}");
  const token = session.token;

  return await axiosClient.post("users/existUser", null, {
    params: { email: email },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

const logOutApi = async (body) => {
  const token = body.token;
  return await axiosClient.post("auth/logout", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const verifyRegister = async (email) => {
  return await axiosClient.post("/verifyRegister", null, {
    params: {
      email: email,
    },
    timeout: 15000,
  });
};

const introspect = async (body) => {
  return await axiosClient.post("/auth/introspect", body);
};

const getUserById = async (userId) => {
  return await axiosClient.get(`/users/id/${userId}`, {
    timeout: 15000,
  });
};

export {
  signIn,
  register,
  checkEmailExists,
  logOutApi,
  verifyRegister,
  introspect,
  getUserById,
};
