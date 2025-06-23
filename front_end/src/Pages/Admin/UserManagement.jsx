import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../component/AdminLayout";
import {
  FiUser,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import axiosClient from "../../API/axiosClient";

const UserManagement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState({});
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get("/users/all"); // Đảm bảo baseURL là http://localhost:8080/api
        if (Array.isArray(response.data)) {
          const formattedUsers = response.data.map((user) => ({
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            username: user.username,
            password: user.password,
            phone: user.phone,
            avatar: user.avatar,
            introduce: user.introduce,
            gender: user.gender,
            certificate: user.certificate,
            active: user.active ? 1 : 0,
            role:
              user.roles && user.roles.length > 0 ? user.roles[0].name : "USER",
          }));
          setUsers(formattedUsers);
        } else {
          console.error("Invalid user response format");
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);
  
  const updateUserStatus = async (userId, role, active) => {
    try {
      const response = await axiosClient.put(`/users/updateStatus/${userId}`, {
        role,
        active,
      });
      const updatedUser = response.data.result;

      // Cập nhật users trong state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? {
                ...u,
                role: updatedUser.roles?.[0]?.name || role,
                active: updatedUser.active,
              }
            : u
        )
      );

      console.log("✅ Updated user:", updatedUser);
    } catch (error) {
      console.error("❌ Cập nhật role/active thất bại:", error);
      alert("Cập nhật thất bại");
    }
  };

  // Sample user data based on your table structure
  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    active: 1,
    gender: "",
    introduce: "",
    role: "USER",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const id = Math.max(...users.map((u) => u.id)) + 1;
    setUsers([...users, { ...newUser, id, avatar: null, certificate: null }]);
    setNewUser({
      fullname: "",
      email: "",
      username: "",
      password: "",
      phone: "",
      active: 1,
      gender: "",
      introduce: "",
      role: "USER",
    });
    setShowAddModal(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({ ...user });
    setShowEditModal(true);
  };

  const handleUpdateUser = () => {
    setUsers(
      users.map((user) => (user.id === selectedUser.id ? { ...newUser } : user))
    );
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const toggleUserStatus = (id) => {
    const user = users.find((u) => u.id === id);
    const updatedActive = user.active === 1 ? 0 : 1;

    setUsers(
      users.map((u) => (u.id === id ? { ...u, active: updatedActive } : u))
    );

    updateUserStatus(id, user.role, updatedActive === 1); // gọi API ngay
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const UserModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold mb-4">
          {isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò</label>
            <select
              value={newUser.role || "USER"}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="SELLER">Người bán</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={newUser.active}
              onChange={(e) =>
                setNewUser({ ...newUser, active: parseInt(e.target.value) })
              }
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={1}>Hoạt động</option>
              <option value={0}>Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={
              isEdit
                ? () => {
                    handleUpdateUser(); // cập nhật local
                    updateUserStatus(newUser.id, newUser.role, newUser.active); // gọi API
                  }
                : handleAddUser
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isEdit ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <AdminLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="User Management - Quản lý người dùng"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tổng người dùng
              </p>
              <h3 className="text-2xl font-bold mt-2">{users.length}</h3>
            </div>
            <div className="text-blue-500 text-3xl">
              <FiUser />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đang hoạt động
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {users.filter((u) => u.active === 1).length}
              </h3>
            </div>
            <div className="text-green-500 text-3xl">
              <FiUserCheck />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Không hoạt động
              </p>
              <h3 className="text-2xl font-bold mt-2">
                {users.filter((u) => u.active === 0).length}
              </h3>
            </div>
            <div className="text-red-500 text-3xl">
              <FiUserX />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Người dùng mới (tháng)
              </p>
              <h3 className="text-2xl font-bold mt-2">12</h3>
              <p className="text-green-500 text-sm mt-2">+15.3%</p>
            </div>
            <div className="text-purple-500 text-3xl">
              <FiPlus />
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Danh sách người dùng</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <FiPlus />
              <span>Thêm người dùng</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mật khẩu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <FiUser className="text-gray-500 dark:text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.fullname}
                        </div>
                        {user.gender && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.gender}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">
                        {showPassword[user.id]
                          ? user.password
                          : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword[user.id] ? (
                          <FiEyeOff size={16} />
                        ) : (
                          <FiEye size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        user.active === 1
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                      }`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.active === 1 ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
                          : user.role === "SELLER"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <FiEdit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Không có người dùng nào
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Chưa có người dùng nào phù hợp với tìm kiếm.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <UserModal />}
      {showEditModal && <UserModal isEdit />}
    </AdminLayout>
  );
};

export default UserManagement;
