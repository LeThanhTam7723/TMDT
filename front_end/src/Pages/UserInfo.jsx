import { useState } from 'react';
import { Mail, ChevronDown, User } from 'lucide-react';
import { getUserById } from '../API/AuthService';
import { useEffect } from 'react';
import { Camera, Save } from 'lucide-react';
import { toast } from "react-toastify";
import UserService from '../API/UserService';

const  UserInformation =() => {
  const [isEditing, setIsEditing] = useState(false);
  const session = JSON.parse(localStorage.getItem("session"));
  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fetchUser = async(id) => {
    try {
      const rs = await getUserById(id);
      const {code,result,message} = rs.data;
      setUserInfo(result);
      setFormData(result);

    } catch (error){
      toast.error('Có lỗi khi tải dữ liệu');
      setUserInfo({});
      setFormData({});
    }
  }
  useEffect(() => {
    if (session.currentUser.id) {
        fetchUser(session.currentUser.id);
    }
  }, []);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddEmail = () => {
    // Implementation for adding email would go here
    console.log("Add email clicked");
  };

  const handleSave = () => {
    setUserInfo({...formData});
    setIsEditing(false);

  };

  const handleCancel = () => {
    setFormData({...userInfo});
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('profile.avatarSection.fileSizeError'));
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.avatarSection.fileTypeError'));
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpdate = async () => {
    if (!selectedFile) {
      toast.warning(t('profile.avatarSection.selectNewImage'));
      return;
    }

    try {
      setAvatarLoading(true);
      await UserService.updateAvatar(selectedFile);
      toast.success(t('profile.avatarSection.updateAvatarSuccess'));
      fetchUserProfile();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(t('session.expired'));
        localStorage.removeItem("session");
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.message || t('profile.avatarSection.updateAvatarFailed'));
        console.error("Error updating avatar:", error);
      }
    } finally {
      setAvatarLoading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-gray-200 h-32 rounded-t-lg"></div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm relative -mt-6">
          {/* Avatar and Header */}
            <div className="flex items-start p-6">
              <div className="relative -mt-16">
              <div className="relative w-24 h-24">
              {/* Avatar tròn */}
              <div className="bg-gray-300 rounded-full w-full h-full flex items-center justify-center text-gray-500">
                {previewUrl ? (
                      <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                      />
                  ) : userInfo.avatar ? (
                      <img
                          src={userInfo.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            setUserInfo(prev => ({ ...prev, avatar: null }));
                          }}
                      />
                  ) : (
                    <User size={40} />
                  )}
                  
              </div>

              {/* Label chọn ảnh ở góc dưới phải */}
              <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                <Camera size={18} className="text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            { selectedFile && (
              <button
                className="mt-2 text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleAvatarUpdate}
                disabled={avatarLoading}
              >
                {avatarLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                    <>
                      <Save size={16} className="inline mr-1" />
                      Lưu ảnh
                    </>
                )}
              </button>

            )}

              
            </div>
            
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{userInfo.fullname}</h2>
                  <p className="text-gray-500 text-sm">{userInfo.email}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-blue-500 text-white rounded-md px-4 py-1 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="fullname"
                    disabled={!isEditing}
                    value={isEditing ? formData.fullname : userInfo.fullname}
                    onChange={handleInputChange}
                    placeholder="Your Full Name" 
                    className="w-full p-2 border border-gray-300 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ChevronDown className="absolute right-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              {/* Nick Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài khoản</label>
                <input 
                  type="text" 
                  name="username"
                  disabled={!isEditing}
                  value={isEditing ? formData.username : userInfo.username}
                  onChange={handleInputChange}
                  placeholder="Your Nick Name" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="relative">
                  <select 
                    name="gender"
                    disabled={!isEditing}
                    value={isEditing ? formData.gender : userInfo.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="text" 
                  name="phone"
                  disabled={!isEditing}
                  value={isEditing ? formData.phone : userInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <div className="relative">
                <input 
                    type="text" 
                    name="introduce"
                    disabled={!isEditing}
                    value={isEditing ? formData.introduce : userInfo.introduce}
                    onChange={handleInputChange}
                    placeholder="Mô tả về bản thân" 
                    className="w-full p-2 border border-gray-300 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ChevronDown className="absolute right-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              {/* Time Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thành tựu</label>
                <div className="relative">
                  <label className="cursor-pointer inline-block">
                    <span className="bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 text-sm">Choose File</span>
                    <input 
                      type="file" 
                      name="certificate" 
                      disabled={!isEditing} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </label>
                  {(isEditing ? formData.certificate : userInfo.certificate) && (
                    <div className="mt-2">
                      <img 
                        src={isEditing ? formData.certificate : userInfo.certificate} 
                        alt="Certificate" 
                        className="max-w-full h-auto rounded-md border border-gray-200" 
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Upload your English certificate or other achievements</p>
                </div>
              </div>
            </div>
            
            {/* Email Addresses */}
            <div className="mt-8">
              <h3 className="text-md font-medium mb-4">My email Address</h3>
              
                <div className="flex items-center mb-3 p-2 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Mail size={20} className="text-blue-500" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium">{userInfo.email}</p>
                    {userInfo.email && <p className="text-xs text-gray-500">{userInfo.email}</p>}
                  </div>
                  {isEditing  && (
                    <button type="button" className="text-red-500 text-sm">Remove</button>
                  )}
                </div>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={handleAddEmail}
                  className="mt-2 text-blue-500 text-sm flex items-center"
                >
                  + Add Email Address
                </button>
              )}
            </div>
            
            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSave}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserInformation;