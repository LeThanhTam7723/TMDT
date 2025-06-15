import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ComplaintManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [typeFilter, setTypeFilter] = useState("Loại khiếu nại");
  const [timeFilter, setTimeFilter] = useState("Thời gian");
  const [currentPage, setCurrentPage] = useState(1);

  const complaints = [
    {
      id: "#CL12345",
      customer: "Nguyễn Văn A",
      email: "a@example.com",
      type: "Sản phẩm",
      date: "07/04/2025",
      status: "Mới",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      id: "#CL12346",
      customer: "Trần Thị B",
      email: "b@example.com",
      type: "Thanh toán",
      date: "06/04/2025",
      status: "Đang xử lý",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "#CL12347",
      customer: "Lê Văn C",
      email: "c@example.com",
      type: "Giao hàng",
      date: "05/04/2025",
      status: "Đã giải quyết",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "#CL12348",
      customer: "Phạm Thị D",
      email: "d@example.com",
      type: "Khác",
      date: "04/04/2025",
      status: "Đã đóng",
      statusColor: "bg-gray-100 text-gray-800",
    },
    {
      id: "#CL12349",
      customer: "Hoàng Văn E",
      email: "e@example.com",
      type: "Sản phẩm",
      date: "03/04/2025",
      status: "Mới",
      statusColor: "bg-red-100 text-red-800",
    },
  ];

  const totalComplaints = 1234;
  const newComplaints = 123;
  const resolvedComplaints = 987;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg">FAHASA</span>
          </div>
        </div>

        <nav className="mt-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Quản lý người dùng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Quản lý đơn hàng
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 border-r-2 border-blue-600"
              >
                ▶ Quản lý khiếu nại
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Thống kê
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cài đặt
              </a>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4">
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            <span className="mr-2">📤</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý phản hồi khiếu nại
          </h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                1
              </span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-500 text-white rounded-lg p-6">
          <h3 className="text-sm opacity-90 mb-1">Tổng khiếu nại</h3>
          <p className="text-3xl font-bold">
            {totalComplaints.toLocaleString()}
          </p>
        </div>

        <div className="bg-orange-500 text-white rounded-lg p-6">
          <h3 className="text-sm opacity-90 mb-1">Mới</h3>
          <p className="text-3xl font-bold">{newComplaints}</p>
        </div>

        <div className="bg-green-500 text-white rounded-lg p-6">
          <h3 className="text-sm opacity-90 mb-1">Đã giải quyết</h3>
          <p className="text-3xl font-bold">{resolvedComplaints}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Tất cả trạng thái</option>
              <option>Mới</option>
              <option>Đang xử lý</option>
              <option>Đã giải quyết</option>
              <option>Đã đóng</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Loại khiếu nại</option>
              <option>Sản phẩm</option>
              <option>Thanh toán</option>
              <option>Giao hàng</option>
              <option>Khác</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Thời gian</option>
              <option>Hôm nay</option>
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày gửi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-blue-600 font-medium">
                    {complaint.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {complaint.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {complaint.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {complaint.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {complaint.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${complaint.statusColor}`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                  <span className="ml-2 text-gray-400">↗</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-700">Showing 1-5 of 1,234</p>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManagement;
