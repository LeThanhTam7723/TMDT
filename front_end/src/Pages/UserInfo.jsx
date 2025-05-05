import { useState } from 'react';
import { Mail, ChevronDown, User } from 'lucide-react';

const  UserInformation =() => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: 'Lê Thành Tâm',
    nickName: '',
    gender: '',
    country: '',
    language: '',
    timeZone: '',
    emails: [
      { address: 'tamLV@gmail.com', isPrimary: true },
      { address: 'alexarowles@gmail.com', addedDate: '1 month ago' }
    ]
  });

  const [formData, setFormData] = useState({...userInfo});

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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl text-gray-500 mb-4">Chỉnh sửa thông tin cá nhân</h1>
        
        {/* Profile Card */}
        <div className="bg-gray-200 h-32 rounded-t-lg"></div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm relative -mt-6">
          {/* Avatar and Header */}
          <div className="flex items-start p-6">
            <div className="relative -mt-16">
              <div className="bg-gray-300 rounded-full h-24 w-24 flex items-center justify-center text-gray-500">
                <User size={40} />
              </div>
            </div>
            
            <div className="ml-4 flex-grow">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{userInfo.fullName}</h2>
                  <p className="text-gray-500 text-sm">{userInfo.emails[0].address}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="fullName"
                    disabled={!isEditing}
                    value={isEditing ? formData.fullName : userInfo.fullName}
                    onChange={handleInputChange}
                    placeholder="Your Full Name" 
                    className="w-full p-2 border border-gray-300 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ChevronDown className="absolute right-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              {/* Nick Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nick Name</label>
                <input 
                  type="text" 
                  name="nickName"
                  disabled={!isEditing}
                  value={isEditing ? formData.nickName : userInfo.nickName}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input 
                  type="text" 
                  name="country"
                  disabled={!isEditing}
                  value={isEditing ? formData.country : userInfo.country}
                  onChange={handleInputChange}
                  placeholder="Your Country" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <div className="relative">
                  <select 
                    name="language"
                    disabled={!isEditing}
                    value={isEditing ? formData.language : userInfo.language}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Language</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              {/* Time Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <div className="relative">
                  <select 
                    name="timeZone"
                    disabled={!isEditing}
                    value={isEditing ? formData.timeZone : userInfo.timeZone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Time Zone</option>
                    <option value="UTC+7">(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                    <option value="UTC+8">(UTC+08:00) Beijing, Hong Kong, Singapore</option>
                    <option value="UTC+0">(UTC+00:00) London, Dublin, Lisbon</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
            </div>
            
            {/* Email Addresses */}
            <div className="mt-8">
              <h3 className="text-md font-medium mb-4">My email Address</h3>
              
              {userInfo.emails.map((email, index) => (
                <div key={index} className="flex items-center mb-3 p-2 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Mail size={20} className="text-blue-500" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium">{email.address}</p>
                    {email.addedDate && <p className="text-xs text-gray-500">{email.addedDate}</p>}
                  </div>
                  {isEditing && index > 0 && (
                    <button type="button" className="text-red-500 text-sm">Remove</button>
                  )}
                </div>
              ))}
              
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
export default UserInfo;