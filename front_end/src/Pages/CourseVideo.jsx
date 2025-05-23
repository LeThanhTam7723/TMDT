import React, { useState } from 'react';
import { Star, Clock, Share2 } from 'lucide-react';

const CourseVideo = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const [selectedVideo, setSelectedVideo] = useState({
    title: 'Intro to TOEIC',
    url: 'https://www.youtube.com/embed/xNRJwmlRBNU?si=Uoyi6kzsoDLtvVZ9',
  });

  const resources = [
    { name: 'TOEIC Vocabulary List', file: '/downloads/vocabulary.pdf' },
    { name: 'Practice Questions', file: '/downloads/practice.zip' },
  ];

  const courseContent = [
    { title: '1. Intro to TOEIC', duration: '3 mins', completed: false, url: 'https://www.youtube.com/embed/xNRJwmlRBNU?si=Uoyi6kzsoDLtvVZ9' },
    { title: 'Part 1: Photos', duration: '5 mins', completed: true, url: 'https://www.youtube.com/embed/hTvJoYnpeRQ' },
    { title: 'Part 2: Q&A', duration: '6 mins', completed: true, url: 'https://www.youtube.com/embed/HZQb34t9BzE' },
    { title: 'Part 3: Talks', duration: '7 mins', completed: true, url: 'https://www.youtube.com/embed/ZVznzY7EjuY' },
    { title: 'Part 4: Lectures', duration: '8 mins', completed: true, url: 'https://www.youtube.com/embed/5MgBikgcWnY' },
    { title: 'Part 5: Grammar', duration: '5 mins', completed: false, url: 'https://www.youtube.com/embed/-GR52szEdAg' },
    { title: 'Part 6: Fill Blanks', duration: '3 mins', completed: false, url: 'https://www.youtube.com/embed/whnQv9a3eQw' },
    { title: 'Part 7: Reading', duration: '3 mins', completed: false, url: 'https://www.youtube.com/embed/bJzb-RuUcMU' },
    { title: 'TOEIC Vocabulary', duration: '3 mins', completed: false, url: 'https://www.youtube.com/embed/QH2-TGUlwu4' },
    { title: 'Final Tips & Test', duration: '5 mins', completed: false, url: 'https://www.youtube.com/embed/C0DPdy98e4c' },
    { title: 'Common Mistakes', duration: '15 mins', completed: false, url: 'https://www.youtube.com/embed/oHg5SJYRHA0' },
    { title: 'Boost Your Score', duration: '16 mins', completed: false, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ];

  const tabs = ['Overview', 'Resource', 'Review'];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-400 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              SAHARA
            </div>
            <h1 className="text-xl font-medium">TOEIC COURSE FOR BEGINNERS</h1>
          </div>
          <Share2 className="w-6 h-6 cursor-pointer" />
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <iframe
            className="w-full h-full max-h-[600px]"
            src={selectedVideo.url}
            title={selectedVideo.title}
            allowFullScreen
          ></iframe>
        </div>

        {/* Bottom Tabs and Content */}
        <div className="bg-white border-t">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'Overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">2. Basic English Beginner Level</h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <span className="text-lg font-bold">4.4</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">2.2k ratings</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">150,000</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">2.5 Hours</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">Lasted Update 20 July 2024</div>
              </>
            )}

            {activeTab === 'Resource' && (
              <ul className="space-y-3">
                {resources.map((res, idx) => (
                  <li key={idx}>
                    <a href={res.file} download className="text-blue-600 hover:underline">
                      {res.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'Review' && (
              <div className="text-sm text-gray-600">
                <p>No reviews yet. Be the first to write one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white border-l shadow-lg">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="font-semibold text-gray-800">Course content</h2>
        </div>

        <div className="overflow-y-auto h-full">
          {courseContent.map((item, index) => (
  <div
    key={index}
    onClick={() => {
      setSelectedVideo({ title: item.title, url: item.url });
      setSelectedVideoIndex(index);
    }}
    className={`p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors ${
      selectedVideo.url === item.url
        ? 'bg-blue-100'
        : item.completed
        ? 'bg-blue-50'
        : ''
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            item.completed ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {item.completed ? '✓' : index + 1}
        </div>
        <div>
          <div className="font-medium text-sm text-gray-800">{item.title}</div>
        </div>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{item.duration}</span>
      </div>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
};

export default CourseVideo;
