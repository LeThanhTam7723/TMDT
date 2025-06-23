import React, { useState } from "react";
import SellerLayout from "../component/SellerLayout";
import { BarChart3, PieChart, Users, BookOpen } from "lucide-react";

const SellerAnalytics = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SellerLayout 
      darkMode={darkMode} 
      setDarkMode={setDarkMode}
      title="Thống kê"
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thống kê chi tiết</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold dark:text-white">Hiệu suất khóa học</h2>
            </div>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Biểu đồ hiệu suất sẽ hiển thị ở đây</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <PieChart className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold dark:text-white">Phân bố học viên</h2>
            </div>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Biểu đồ phân bố sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold dark:text-white mb-4">Báo cáo chi tiết</h2>
          <div className="text-gray-600 dark:text-gray-400">
            Trang thống kê chi tiết sẽ được phát triển trong phiên bản tiếp theo.
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerAnalytics;
