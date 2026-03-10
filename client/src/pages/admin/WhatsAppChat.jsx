import { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import { 
  FiSearch, 
  FiMoreVertical, 
  FiSend, 
  FiUser, 
  FiCheck, 
  FiClock, 
  FiAlertCircle,
  FiArrowLeft,
  FiMessageSquare,
  FiCheckCircle,
  FiImage,
  FiFileText,
  FiExternalLink,
  FiShield
} from "react-icons/fi";
import { io } from "socket.io-client";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const AVATAR_COLORS = [
  "bg-[#128C7E]", "bg-[#075E54]", "bg-[#25D366]", 
  "bg-[#34B7F1]", "bg-[#ECE5DD]", "bg-[#128C7E]"
];

export default function WhatsAppChat() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize Socket.io
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("whatsapp_inbound_message", (data) => {
      if (selectedContact && selectedContact.phone_e164 === data.phone) {
        setMessages((prev) => [...prev, {
          direction: "inbound",
          content: data.content,
          message_type: data.messageType,
          created_at: new Date().toISOString(),
          status: "delivered"
        }]);
      }
      fetchContacts();
    });

    socketRef.current.on("whatsapp_status_update", (data) => {
      if (selectedContact) {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.wamid === data.wamid ? { ...msg, status: data.status } : msg
          )
        );
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/whatsapp/admin/contacts");
      setContacts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    }
  };

  const fetchChatHistory = async (phone) => {
    setMessagesLoading(true);
    try {
      const response = await api.get(`/whatsapp/admin/chats/${phone}`);
      setMessages(response.data.data);
      setMessagesLoading(false);
    } catch (error) {
      console.error("Error fetching history:", error);
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchChatHistory(selectedContact.phone_e164);
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const getAvatarColor = (phone) => {
    const sum = (phone || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
  };

  const filteredContacts = contacts.filter(c => 
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone_e164.includes(searchQuery)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'read': 
        return (
          <div className="flex -space-x-1.5">
            <FiCheck className="text-[#34B7F1] w-4 h-4 stroke-[3]" />
            <FiCheck className="text-[#34B7F1] w-4 h-4 stroke-[3]" />
          </div>
        );
      case 'delivered': 
        return (
          <div className="flex -space-x-1.5">
            <FiCheck className="text-gray-400 w-4 h-4 stroke-[3]" />
            <FiCheck className="text-gray-400 w-4 h-4 stroke-[3]" />
          </div>
        );
      case 'sent': 
        return <FiCheck className="text-gray-400 w-4 h-4 stroke-[3]" />;
      case 'failed': 
        return <FiAlertCircle className="text-red-500 w-4 h-4" />;
      default: 
        return <FiClock className="text-gray-400 w-3.5 h-3.5" />;
    }
  };

  const formatMessageDate = (dateStr) => {
    if (!dateStr) return "";
    const date = parseISO(dateStr);
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "dd/MM/yy");
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const dateKey = format(parseISO(msg.created_at), "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const isWindowActive = (lastInboundAt) => {
    if (!lastInboundAt) return false;
    const lastAt = new Date(lastInboundAt);
    const now = new Date();
    const diffHours = (now - lastAt) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const activeWindow = selectedContact ? isWindowActive(selectedContact.last_inbound_at) : false;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || isSending) return;

    setIsSending(true);
    try {
      const response = await api.post("/whatsapp/admin/send-message", {
        phone: selectedContact.phone_e164,
        message: newMessage,
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, {
          wamid: response.data.wamid,
          direction: "outbound",
          content: newMessage,
          message_type: "text",
          created_at: new Date().toISOString(),
          status: "sent"
        }]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex h-[calc(100vh-140px)] bg-[#F0F2F5] rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
      {/* Sidebar - Contact List */}
      <div className={`w-full md:w-80 lg:w-[350px] bg-white border-r border-stone-200 flex flex-col z-20 ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {/* Sidebar Header */}
        <div className="p-4 bg-[#F0F2F5] flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-marigold to-sindoor flex items-center justify-center text-white scale-x-[-1]">
             <FiShield className="w-5 h-5" />
          </div>
          <div className="flex gap-4 text-stone-500">
             <FiMoreVertical className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-stone-100">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              className="w-full pl-12 pr-4 py-2 bg-[#F0F2F5] border-none rounded-lg text-sm text-stone-600 focus:ring-0 placeholder:text-stone-400 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full p-10">
               <div className="w-8 h-8 rounded-full border-2 border-marigold/20 border-t-marigold animate-spin"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-10 text-center text-stone-400">
              <p className="text-sm">No chats found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full px-4 py-3 flex items-center gap-3 border-b border-stone-50 transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-[#EBEBEB]' : 'hover:bg-[#F5F6F6]'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${getAvatarColor(contact.phone_e164)}`}>
                  {contact.name?.[0]?.toUpperCase() || <FiUser />}
                </div>
                
                <div className="flex-1 text-left min-w-0 pr-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#111B21] truncate text-[16px]">
                      {contact.name || `+${contact.phone_e164}`}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-stone-400 font-medium">
                        {formatMessageDate(contact.last_inbound_at || contact.created_at)}
                      </span>
                      {isWindowActive(contact.last_inbound_at) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] text-stone-500 truncate mt-0.5">
                    +{contact.phone_e164}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#E5DDD5] relative ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
        {!selectedContact ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-[#F8F9FA] border-l border-stone-200">
             <div className="w-64 h-64 rounded-full bg-white shadow-sm flex items-center justify-center mb-8 border border-stone-100 p-8">
                <img src="/logo.png" alt="" className="w-full h-auto opacity-10 grayscale" onError={(e)=>e.target.src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'} />
             </div>
            <h3 className="text-2xl font-light text-[#41525d] mb-4">Shyam Sevaa Admin Chat</h3>
            <p className="max-w-md text-[#667781] text-[14px] leading-relaxed">
              Official WhatsApp Business connection active. Messages sent via CRM will appear here in real-time.
            </p>
            <div className="mt-auto border-t border-stone-200 pt-6 w-full flex items-center justify-center gap-2 text-[#8696a0] text-[12px]">
               <FiShield className="w-3 h-3" /> End-to-end encrypted
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-4 py-2 bg-[#F0F2F5] border-b border-stone-200 flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden p-2 text-stone-500"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${getAvatarColor(selectedContact.phone_e164)}`}>
                  {selectedContact.name?.[0]?.toUpperCase() || <FiUser />}
                </div>
                <div>
                  <h3 className="font-bold text-[#111B21] text-[16px] leading-none mb-1">
                    {selectedContact.name || `+${selectedContact.phone_e164}`}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-stone-500 font-medium">Verified Business Account</p>
                    {activeWindow && (
                      <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter shadow-sm border border-green-200">24h Service Open</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-stone-500">
                 <FiSearch className="w-5 h-5 cursor-pointer" />
                 <FiMoreVertical className="w-5 h-5 cursor-pointer" />
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-1 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                   <div className="bg-white/80 px-4 py-2 rounded-lg text-xs font-bold text-stone-500 shadow-sm uppercase tracking-widest">Initialising Cloud Stream...</div>
                </div>
              ) : (
                Object.entries(messageGroups).map(([date, msgs]) => (
                  <div key={date} className="flex flex-col gap-1 mb-4">
                    <div className="flex justify-center my-3">
                      <span className="px-3 py-1.5 rounded-lg bg-white text-[12px] font-medium text-[#54656f] shadow-sm uppercase tracking-tight">
                        {isToday(parseISO(date)) ? "Today" : isYesterday(parseISO(date)) ? "Yesterday" : format(parseISO(date), "dd/MM/yyyy")}
                      </span>
                    </div>

                    {msgs.map((msg, idx) => {
                      const isTemplate = msg.template_name && msg.direction === 'outbound';
                      return (
                        <div key={idx} className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'} w-full`}>
                            <div className={`relative max-w-[85%] lg:max-w-[65%] px-2 py-1 shadow-sm rounded-lg ${
                              msg.direction === 'outbound' 
                                ? 'bg-[#d9fdd3] rounded-tr-none' 
                                : 'bg-white rounded-tl-none'
                            }`}>
                                {/* Bubble Tail */}
                                <div className={`absolute top-0 w-2 h-3.5 ${msg.direction === 'outbound' ? '-right-2' : '-left-2'}`}>
                                   <svg viewBox="0 0 8 13" className={`w-full h-full ${msg.direction === 'outbound' ? 'text-[#d9fdd3]' : 'text-white'}`}>
                                      <path fill="currentColor" d={msg.direction === 'outbound' ? "M0 0 L0 13 L8 0 Z" : "M8 0 L8 13 L0 0 Z"} />
                                   </svg>
                                </div>

                                {isTemplate && (
                                  <div className="px-2 py-1 mb-1 text-[10px] font-black text-marigold uppercase tracking-wider border-b border-marigold/10 flex items-center gap-1">
                                     <FiCheckCircle className="w-2.5 h-2.5" /> Template: {msg.template_name}
                                  </div>
                                )}

                                <div className="px-1.5 pb-1">
                                  {msg.media_url && (
                                    <div className="my-1 rounded-md overflow-hidden bg-stone-100 max-w-xs transition-opacity hover:opacity-90">
                                       <img src={msg.media_url} alt="" className="w-full object-cover max-h-60" />
                                    </div>
                                  )}

                                  <div className="flex flex-wrap items-end gap-x-2">
                                    <p className="text-[14.2px] text-[#111B21] leading-[1.4] whitespace-pre-wrap flex-1 min-w-[50px] pt-1">
                                      {msg.content}
                                    </p>
                                    <div className="flex items-center gap-1 ml-auto pt-2 pb-0.5">
                                      <span className="text-[11px] text-[#667781] leading-none">
                                        {format(parseISO(msg.created_at), 'HH:mm')}
                                      </span>
                                      {msg.direction === 'outbound' && getStatusIcon(msg.status)}
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="px-6 py-3 bg-[#F0F2F5] border-t border-stone-200">
                   <div className="flex items-center gap-4">
                       <FiFileText className="text-stone-500 w-6 h-6 cursor-pointer hover:text-marigold transition-colors" title="Send Document (Template only)" />
                       <div className="flex-1">
                          <input 
                            disabled={!activeWindow || isSending}
                            type="text" 
                            className={`w-full border-none rounded-[10px] py-[9px] px-4 text-[15px] focus:ring-0 placeholder:text-stone-400 transition-all ${
                              activeWindow 
                                ? 'bg-white text-[#111B21] shadow-sm' 
                                : 'bg-transparent text-stone-400 cursor-not-allowed opacity-60'
                            }`}
                            placeholder={activeWindow ? "Type a message..." : "Service window closed. Use Campaigns to send templates."}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                       </div>
                       <FiImage className="text-stone-500 w-6 h-6 cursor-pointer hover:text-marigold transition-colors" title="Send Media (Template only)" />
                       <button 
                         disabled={!activeWindow || isSending || !newMessage.trim()}
                         onClick={handleSendMessage}
                         className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all active:scale-95 ${
                           activeWindow && newMessage.trim() && !isSending
                             ? 'bg-linear-to-br from-[#128C7E] to-[#075E54] hover:shadow-xl' 
                             : 'bg-stone-300 cursor-not-allowed'
                         }`}
                       >
                          {isSending ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full"></div>
                          ) : (
                            <FiSend className="w-5 h-5" />
                          )}
                       </button>
                   </div>
                   <p className="mt-2 text-center text-[10px] text-stone-400 font-bold uppercase tracking-[0.15em] opacity-80">
                      {activeWindow 
                        ? "Service Window is OPEN. You can chat freely." 
                        : "Service window: 24h. Closed until user initiates chat."}
                   </p>
            </div>
          </>
        )}
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ced0d1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9da1a3; }
      `}} />
    </div>
  );
}
