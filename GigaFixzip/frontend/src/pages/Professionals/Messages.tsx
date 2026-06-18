import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, ArrowLeft } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

interface Message { id: number; sender_id: number; content: string; created_at: string; is_own?: boolean; }
interface Conversation { id: number; name: string; lastMessage: string; time: string; unread: number; avatar: string; }

const ProfessionalMessages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/messages/conversations`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setConversations(Array.isArray(data) ? data : []);
      }
    } catch {
      setConversations([
        { id: 1, name: 'Alice Njeri', lastMessage: 'When can you come?', time: '10:30 AM', unread: 3, avatar: 'A' },
        { id: 2, name: 'Bob Kamau', lastMessage: 'Thank you for the quick fix!', time: 'Yesterday', unread: 0, avatar: 'B' },
        { id: 3, name: 'Carol Otieno', lastMessage: 'I need an estimate for the work.', time: 'Dec 15', unread: 1, avatar: 'C' },
      ]);
    }
    setLoading(false);
  };

  const fetchMessages = async (convoId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/messages/${convoId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const json = await response.json();
        const data = json.data || json;
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch {
      setMessages([
        { id: 1, sender_id: 999, content: 'Hi, I need help with my plumbing.', created_at: new Date().toISOString(), is_own: false },
        { id: 2, sender_id: 0, content: 'Sure, I can help. What seems to be the problem?', created_at: new Date().toISOString(), is_own: true },
      ]);
    }
  };

  const handleSelectConvo = (convo: Conversation) => {
    setSelectedConvo(convo);
    fetchMessages(convo.id);
    setConversations(prev => prev.map(c => c.id === convo.id ? { ...c, unread: 0 } : c));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConvo) return;
    const msg: Message = { id: Date.now(), sender_id: 0, content: newMessage, created_at: new Date().toISOString(), is_own: true };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    try {
      await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ conversation_id: selectedConvo.id, content: newMessage }),
      });
    } catch (error) { console.error('Send error:', error); }
  };

  const filteredConvos = conversations.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

  return (
    <div>
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Messages</h2>
          <p className="text-slate-600 text-sm sm:text-base">Communicate with your customers</p>
        </div>
        {totalUnread > 0 && (
          <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full">{totalUnread} unread</span>
        )}
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: '70vh', minHeight: '400px' }}>
        <div className="flex h-full">
          {/* Conversations */}
          <div className={`${selectedConvo ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-72 lg:w-80 border-r border-slate-200 flex-shrink-0`}>
            <div className="p-3 sm:p-4 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-slate-500 text-sm">Loading...</div>
              ) : filteredConvos.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm px-4">No conversations yet</div>
              ) : (
                filteredConvos.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => handleSelectConvo(convo)}
                    className={`w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-slate-50 transition-colors text-left ${selectedConvo?.id === convo.id ? 'bg-green-50 border-r-2 border-green-600' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {convo.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-slate-900 text-sm truncate">{convo.name}</span>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{convo.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 truncate">{convo.lastMessage}</span>
                        {convo.unread > 0 && (
                          <span className="ml-2 w-5 h-5 bg-green-600 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">{convo.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className={`${selectedConvo ? 'flex' : 'hidden sm:flex'} flex-col flex-1 min-w-0`}>
            {selectedConvo ? (
              <>
                <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center gap-3">
                  <button onClick={() => setSelectedConvo(null)} className="sm:hidden p-1 hover:bg-slate-100 rounded-lg">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {selectedConvo.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{selectedConvo.name}</div>
                    <div className="text-xs text-green-500">Customer</div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${msg.is_own ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-900 rounded-tl-sm'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.is_own ? 'text-green-100' : 'text-slate-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 sm:p-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMessages;
