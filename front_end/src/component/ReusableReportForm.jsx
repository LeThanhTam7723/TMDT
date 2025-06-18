import { useState } from "react";
import { createReport } from "../API/ReportService";

const ReusableReportForm = ({ courseId }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    detail: "",
    category: "Technical Issue",
    priority: "normal"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.detail.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    try {
      const payload = {
        ...form,
        courseId: courseId || null // nếu null thì backend vẫn xử lý
      };

      const response = await createReport(payload);

      if (response.data?.code === 0) {
        alert("✅ Gửi báo cáo thành công!");
        setForm({
          subject: "",
          detail: "",
          category: "Technical Issue",
          priority: "normal"
        });
        setShowModal(false);
      } else {
        alert("🚫 Lỗi: " + (response.data?.message || "Không xác định"));
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi báo cáo:", error);
      alert("Gửi báo cáo thất bại.");
    }
  };

  return (
    <>
      {/* Button mở modal */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Gửi khiếu nại về khóa học
      </button>

      {/* Modal hiển thị */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Gửi báo cáo tới quản trị viên</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Chủ đề</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Nhập tiêu đề báo cáo"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Chi tiết</label>
                <textarea
                  name="detail"
                  value={form.detail}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Mô tả chi tiết vấn đề..."
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Loại vấn đề</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Technical Issue">Lỗi kỹ thuật</option>
                  <option value="Payment Issue">Vấn đề thanh toán</option>
                  <option value="Content Feedback">Phản hồi nội dung</option>
                  <option value="Other">Khác</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1">Mức độ ưu tiên</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="low">Thấp</option>
                  <option value="normal">Bình thường</option>
                  <option value="high">Cao</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Gửi báo cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReusableReportForm;
