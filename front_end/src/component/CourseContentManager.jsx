import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiPlay, FiClock, FiList } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SellerService from '../API/SellerService';
import Swal from 'sweetalert2';

const CourseContentManager = ({ courseId, sellerId, isEditMode = false }) => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    duration: '',
    isPreview: false
  });

  // Load episodes khi component mount hoặc courseId thay đổi
  useEffect(() => {
    if (courseId && isEditMode) {
      loadEpisodes();
    }
  }, [courseId, isEditMode]);

  const loadEpisodes = async () => {
    if (!courseId || !sellerId) return;
    
    setLoading(true);
    try {
      const response = await SellerService.getCourseDetails(sellerId, courseId);
      if (response.code === 200) {
        // Convert URLs when loading from backend
        const episodesWithConvertedUrls = (response.result || []).map(episode => ({
          ...episode,
          link: validateAndConvertYouTubeURL(episode.link)
        }));
        setEpisodes(episodesWithConvertedUrls);
        console.log('📥 Loaded episodes with converted URLs:', episodesWithConvertedUrls); // Debug
      }
    } catch (error) {
      console.error('Error loading episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      link: '',
      duration: '',
      isPreview: false
    });
    setShowAddForm(false);
    setEditingEpisode(null);
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // More comprehensive regex to handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,          // youtube.com/watch?v=ID
      /(?:youtu\.be\/)([^&\n?#]+)/,                      // youtu.be/ID  
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,            // youtube.com/embed/ID
      /(?:youtube\.com\/v\/)([^&\n?#]+)/,                // youtube.com/v/ID
      /(?:youtube\.com\/.*[?&]v=)([^&\n?#]+)/            // Other youtube.com variants
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const validateAndConvertYouTubeURL = (url) => {
    if (!url || typeof url !== 'string') return url;
    
    console.log('🔍 Converting URL:', url); // Debug log
    
    // Get video ID
    const videoId = getYouTubeVideoId(url);
    
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log('✅ Converted to:', embedUrl); // Debug log
      return embedUrl;
    }
    
    console.log('ℹ️ Not a YouTube URL or already embed format:', url); // Debug log
    return url;
  };

  const isValidYouTubeURL = (url) => {
    return getYouTubeVideoId(url) !== null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.link || !formData.duration) {
      await Swal.fire({
        title: 'Lỗi!',
        text: 'Vui lòng điền đầy đủ thông tin.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validate and convert YouTube URL
    const processedLink = validateAndConvertYouTubeURL(formData.link);

    setLoading(true);
    try {
      const episodeData = {
        name: formData.name,
        link: processedLink,
        duration: parseInt(formData.duration),
        isPreview: formData.isPreview
      };

      let response;
      if (editingEpisode) {
        response = await SellerService.updateCourseDetail(sellerId, courseId, editingEpisode.id, episodeData);
      } else {
        response = await SellerService.createCourseDetail(sellerId, courseId, episodeData);
      }

      if (response.code === 200) {
        await Swal.fire({
          title: 'Thành công!',
          text: `Episode đã được ${editingEpisode ? 'cập nhật' : 'tạo'} thành công.`,
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        resetForm();
        loadEpisodes(); // Reload danh sách
      }
    } catch (error) {
      console.error('Error saving episode:', error);
      await Swal.fire({
        title: 'Lỗi!',
        text: error.response?.data?.message || 'Có lỗi xảy ra khi lưu episode.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (episode) => {
    setFormData({
      name: episode.name || '',
      link: episode.link || '',
      duration: episode.duration || '',
      isPreview: episode.isPreview || false
    });
    setEditingEpisode(episode);
    setShowAddForm(true);
  };

  const handleDelete = async (episode) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa',
      text: `Bạn có chắc muốn xóa episode "${episode.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await SellerService.deleteCourseDetail(sellerId, courseId, episode.id);
        if (response.code === 200) {
          await Swal.fire({
            title: 'Đã xóa!',
            text: 'Episode đã được xóa thành công.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
          loadEpisodes();
        }
      } catch (error) {
        console.error('Error deleting episode:', error);
        await Swal.fire({
          title: 'Lỗi!',
          text: 'Có lỗi xảy ra khi xóa episode.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Tính tổng thời lượng
  const totalDuration = episodes.reduce((sum, ep) => sum + (ep.duration || 0), 0);
  const totalHours = Math.floor(totalDuration / 60);
  const totalMinutes = totalDuration % 60;

  // Nếu chưa phải edit mode hoặc chưa có courseId
  if (!isEditMode || !courseId) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <FiList className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Quản lý nội dung khóa học
        </h3>
        <p className="text-gray-500">
          Vui lòng lưu khóa học trước để thêm nội dung bài học.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Nội dung khóa học</h3>
          <p className="text-gray-600">
            {episodes.length} episodes • {totalHours}h {totalMinutes}m tổng thời lượng
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <FiPlus />
          Thêm Episode
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">
                {editingEpisode ? 'Chỉnh sửa Episode' : 'Thêm Episode Mới'}
              </h4>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên Episode
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên episode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Video
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/watch?v=... hoặc https://youtu.be/..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.link) {
                        const converted = validateAndConvertYouTubeURL(formData.link);
                        console.log('🧪 Test conversion:', formData.link, '→', converted);
                        if (isValidYouTubeURL(formData.link)) {
                          alert(`✅ URL hợp lệ!\nGốc: ${formData.link}\nChuyển đổi: ${converted}`);
                        } else {
                          alert(`ℹ️ Không phải YouTube URL hoặc URL không hợp lệ:\n${formData.link}`);
                        }
                      }
                    }}
                    className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    title="Test URL"
                  >
                    🧪 Test
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: YouTube, Vimeo và các link video trực tiếp khác. Click "Test" để kiểm tra URL.
                </p>
                
                {/* Video Preview */}
                {formData.link && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xem trước video:
                    </label>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                      {(() => {
                        const convertedUrl = validateAndConvertYouTubeURL(formData.link);
                        const isYouTube = isValidYouTubeURL(formData.link);
                        
                        return (
                          <>
                            {isYouTube && convertedUrl.includes('youtube.com/embed/') && (
                              <iframe
                                key={convertedUrl} // Force re-render when URL changes
                                src={convertedUrl}
                                className="absolute top-0 left-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title="Video Preview"
                                loading="lazy"
                                sandbox="allow-scripts allow-same-origin allow-presentation"
                                onError={(e) => {
                                  console.error('❌ Iframe X-Frame-Options error:', e, 'URL:', convertedUrl);
                                  // Hide iframe on error
                                  e.target.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log('✅ Iframe loaded successfully:', convertedUrl);
                                }}
                              />
                            )}
                            
                            {/* Fallback div - always present */}
                            <div 
                              className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200 ${
                                isYouTube && convertedUrl.includes('youtube.com/embed/') ? 'hidden' : 'flex'
                              }`}
                              style={{ zIndex: isYouTube ? 1 : 2 }}
                            >
                              <div className="text-center p-4">
                                <FiPlay className="mx-auto text-4xl text-gray-400 mb-2" />
                                <p className="text-gray-600 text-sm mb-2">
                                  {isYouTube 
                                    ? 'Video YouTube (click để xem)' 
                                    : formData.link.includes('youtube') || formData.link.includes('youtu.be')
                                    ? 'URL YouTube không hợp lệ'
                                    : 'Video không thể preview trực tiếp'}
                                </p>
                                <a 
                                  href={isYouTube ? `https://www.youtube.com/watch?v=${getYouTubeVideoId(formData.link)}` : formData.link}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                  <FiPlay size={12} />
                                  {isYouTube ? 'Xem trên YouTube' : 'Mở video'}
                                </a>
                                {process.env.NODE_ENV === 'development' && (
                                  <div className="mt-2 text-xs text-gray-500 break-all">
                                    Original: {formData.link}<br/>
                                    Converted: {convertedUrl}
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPreview"
                  id="isPreview"
                  checked={formData.isPreview}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="isPreview" className="text-sm text-gray-700">
                  Cho phép xem miễn phí (Preview)
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FiSave />
                  {loading ? 'Đang lưu...' : editingEpisode ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Episodes List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Đang tải...</p>
        </div>
      ) : episodes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FiPlay className="mx-auto text-4xl text-gray-400 mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">
            Chưa có episode nào
          </h4>
          <p className="text-gray-500 mb-4">
            Hãy thêm episode đầu tiên cho khóa học của bạn.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thêm Episode Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Episode Thumbnail */}
                <div className="flex-shrink-0">
                  {getYouTubeThumbnail(episode.link) ? (
                    <div className="relative">
                      <img
                        src={getYouTubeThumbnail(episode.link)}
                        alt={episode.name}
                        className="w-20 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-20 h-12 bg-gray-200 rounded items-center justify-center">
                        <FiPlay className="text-gray-400" size={16} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-1">
                          <FiPlay className="text-white" size={12} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <FiPlay className="text-gray-400" size={16} />
                    </div>
                  )}
                </div>

                {/* Episode Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                          {episode.episodeNumber || index + 1}
                        </div>
                        <h5 className="font-semibold text-gray-800 truncate">{episode.name}</h5>
                        {episode.isPreview && (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs flex-shrink-0">
                            Preview
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FiClock size={14} />
                          {episode.duration} phút
                        </span>
                        {episode.link && (
                          <a
                            href={episode.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FiPlay size={12} />
                            {episode.link.includes('youtube') || episode.link.includes('youtu.be') 
                              ? 'YouTube' 
                              : 'Video'}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleEdit(episode)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(episode)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseContentManager; 