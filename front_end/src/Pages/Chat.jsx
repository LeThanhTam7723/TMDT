import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi";
import { format } from "date-fns";
import { db } from "../firebase/config";
import { push, ref, set ,query, orderByChild, equalTo,get,onChildAdded,child} from "firebase/database";
import { useParams } from "react-router-dom";

const getConversationByKey = async (key) => {
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `conversations/${key}`));
    if (snapshot.exists()) {
      console.log("Conversation:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error getting conversation:", error);
    return null;
  }
};
const ChatInterface = () => {
  const session = JSON.parse(localStorage.getItem("session"));
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation,setConversation] = useState("");
  
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { id } = useParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // phần xử lý nhắn tin
  const messagesRef = ref(db, 'messages');
  useEffect(() =>{
    getConversationByKey(id).then(conversation => {
      if (conversation) {
        setConversation(conversation); // hoặc xử lý theo ý bạn
      }
    });
    console.log(conversation);
    const q = query(messagesRef, orderByChild('conversation_id'), equalTo(id));

    get(q).then((snapshot) => {
      if (snapshot.exists()) {
        const messages = snapshot.val();
        // Chuyển object thành array nếu cần
        const messagesList = Object.entries(messages).map(([id, data]) => ({
          id,
          ...data
        }));
        console.log("Danh sách tin nhắn:", messagesList);
        setMessages(messagesList);
      } else {
        console.log("Không có tin nhắn nào.");
      }
    }).catch((error) => {
      console.error("Lỗi khi lấy dữ liệu:", error);
    });
  },[]);
  useEffect(() => {
    if (!id) return;
  
    const messagesRef = ref(db, "messages");
    const q = query(messagesRef, orderByChild("conversation_id"), equalTo(id));
  
    const unsubscribe = onChildAdded(q, (snapshot) => {
      const msg = snapshot.val();
      const id = snapshot.key;
      setMessages(prev => [...prev, { id, ...msg }]);
    });
  
    return () => unsubscribe(); // sẽ ngắt listener khi id thay đổi
  }, [id]);
  

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      conversation_id: id,
      sender: session.currentUser.id,
      content: newMessage,
      timestamp: Date.now(),
      read: true
    };
    // const conversation = {
    //   id: "conver_1",
    //   user1_id: 1,
    //   user2_id: 2,
    // };
    try {
        // set(ref(db, 'message/' + 1), newMessage);
        set(ref(db, 'conversations/' + id), conversation);
        console.log(newMessage);
        const newRef = push(ref(db, 'messages'));
        set(newRef, newMsg);
        
    } catch (error) {
        console.log('Error creating conversation', error);
    }

    setMessages([...messages, newMsg]);
    setNewMessage("");
    
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* User Profile Section */}
      <div className="flex items-center p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
            alt="User avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-800">John Doe</h2>
          <p className="text-sm text-green-500">Online</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${(message.sender===session.currentUser.id) ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                (message.sender===1)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className="text-xs opacity-75">
                  {format(message.timestamp, "HH:mm")}
                </span>
                {message.isOwn && (
                  <span className="text-xs">
                    {message.read ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isTyping && (
          <div className="flex items-center text-gray-500 text-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="ml-2">John is typing...</span>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Attach file"
          >
            <FiPaperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Add emoji"
          >
            <FiSmile className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
            aria-label="Send message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
// tìm ra đoạn hội dựa vài id của 2 người
export const findConversationByUsers = async (userA, userB) => {
  const snapshot = await get(ref(db, "conversations"));

  if (snapshot.exists()) {
    const conversations = snapshot.val();

    for (let key in conversations) {
      const conv = conversations[key];
      const u1 = conv.user1_id;
      const u2 = conv.user2_id;

      // So sánh theo cả hai chiều
      if (
        (u1 === userA && u2 === userB) ||
        (u1 === userB && u2 === userA)
      ) {
        return { key, ...conv };
        
      }
    }
  }

  return null;
};

export default ChatInterface;