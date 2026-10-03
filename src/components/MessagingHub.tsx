import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Send, 
  Mic, 
  MapPin, 
  UserPlus, 
  Users, 
  Key, 
  Search, 
  CheckCheck, 
  ChevronLeft,
  Paperclip,
  Radio,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { Conversation, ChatMessage } from '../types';

interface MessagingHubProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string, type?: 'text' | 'voice' | 'location') => void;
  onNewConversation: (name: string, isGroup: boolean) => void;
  onNavigateToMap: () => void;
}

export const MessagingHub: React.FC<MessagingHubProps> = ({
  conversations,
  onSendMessage,
  onNewConversation,
  onNavigateToMap,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatIsGroup, setNewChatIsGroup] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!inputText.trim() || !selectedConvId) return;
    onSendMessage(selectedConvId, inputText.trim(), 'text');
    setInputText('');
  };

  const handleVoiceRecord = () => {
    if (isRecordingVoice) {
      // Finish recording
      if (selectedConvId) {
        onSendMessage(selectedConvId, `🎤 Encrypted Voice Memo (${voiceSeconds}s)`, 'voice');
      }
      setIsRecordingVoice(false);
      setVoiceSeconds(0);
    } else {
      setIsRecordingVoice(true);
      setVoiceSeconds(1);
      const interval = setInterval(() => {
        setVoiceSeconds((prev) => prev + 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
      }, 30000);
    }
  };

  const handleSendLocation = () => {
    if (!selectedConvId) return;
    onSendMessage(
      selectedConvId,
      '📍 Shared Secure Live Coordinates (Mission & 24th St)',
      'location'
    );
  };

  const handleCreateChat = () => {
    if (!newChatName.trim()) return;
    onNewConversation(newChatName.trim(), newChatIsGroup);
    setNewChatName('');
    setShowNewChatModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-125px)] pb-20 flex flex-col md:flex-row overflow-hidden bg-zinc-950 border-x border-zinc-800/80">
      {/* Left Sidebar: Conversations List */}
      <div className={`w-full md:w-80 border-r border-zinc-800/80 flex flex-col bg-zinc-950 ${
        selectedConvId ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Top Header & Search */}
        <div className="p-3.5 border-b border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-wide">SECURE COMMS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> E2EE
              </span>
            </div>
            <button
              id="new-chat-btn"
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/40 transition-colors"
              title="Start Private Chat or Group"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, contacts..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="px-3 py-2 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center gap-2 text-[11px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">1-to-1 messages encrypted with device-only keys.</span>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedConvId;
            return (
              <div
                key={conv.id}
                id={`conversation-item-${conv.id}`}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-3 flex items-start gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-l-2 border-red-500'
                    : 'hover:bg-zinc-900/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                  />
                  {conv.isGroup ? (
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-900">
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-950"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-100 truncate">{conv.name}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{conv.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      {conv.securityKey.slice(0, 12)}...
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold">
                        {conv.unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Area */}
      {selectedConv ? (
        <div className={`flex-1 flex flex-col bg-zinc-950 ${
          selectedConvId ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Chat Top Header */}
          <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedConvId(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white md:hidden"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <img
                src={selectedConv.avatar}
                alt={selectedConv.name}
                className="w-9 h-9 rounded-full object-cover border border-zinc-700"
              />
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {selectedConv.name}
                  {selectedConv.isVerifiedEntity && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-mono">
                      Verified
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Lock className="w-2.5 h-2.5" /> End-to-End Encrypted Peer Tunnel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              <Key className="w-3 h-3 text-amber-400" />
              <span>{selectedConv.securityKey}</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {/* Encryption notice bubble */}
            <div className="flex justify-center my-2">
              <div className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 text-center max-w-sm">
                🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even Ice Breaker, can read or listen to them.
              </div>
            </div>

            {selectedConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                {!msg.isSelf && (
                  <span className="text-[10px] text-zinc-400 font-bold ml-1 mb-1">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.isSelf
                      ? 'bg-red-600 text-white rounded-br-none shadow-md shadow-red-950/50'
                      : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-none'
                  }`}
                >
                  {msg.type === 'voice' ? (
                    <div className="flex items-center gap-2 py-1">
                      <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                        <Radio className="w-4 h-4 animate-pulse" />
                      </button>
                      <div>
                        <div className="font-semibold text-xs">{msg.text}</div>
                        <div className="text-[9px] opacity-80">Encrypted voice payload</div>
                      </div>
                    </div>
                  ) : msg.type === 'location' ? (
                    <div className="space-y-2">
                      <p className="font-medium">{msg.text}</p>
                      <button
                        onClick={onNavigateToMap}
                        className="w-full py-1.5 bg-black/40 hover:bg-black/60 rounded-lg text-[10px] font-bold text-zinc-200 flex items-center justify-center gap-1 transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-red-400" />
                        Open on Live Radar
                      </button>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}

                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-mono ${
                      msg.isSelf ? 'text-red-200' : 'text-zinc-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.isSelf && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voice recording live indicator if active */}
          {isRecordingVoice && (
            <div className="px-4 py-2 bg-red-950/80 border-t border-red-800/80 flex items-center justify-between text-xs text-red-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span>Recording Secure Audio... ({voiceSeconds}s)</span>
              </div>
              <button
                onClick={handleVoiceRecord}
                className="px-2.5 py-1 bg-red-600 text-white font-bold rounded-lg text-xs"
              >
                Send Voice Memo
              </button>
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 flex items-center gap-2">
            <button
              id="chat-send-location-btn"
              onClick={handleSendLocation}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Share GPS Coordinates"
            >
              <MapPin className="w-4 h-4 text-red-400" />
            </button>

            <button
              id="chat-record-voice-btn"
              onClick={handleVoiceRecord}
              className={`p-2 rounded-xl transition-colors ${
                isRecordingVoice
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              title="Record Encrypted Voice Memo"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              id="message-input-field"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Send end-to-end encrypted message..."
              className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
            />

            <button
              id="message-submit-btn"
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white transition-all shadow-md shadow-red-950"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-zinc-400">
          <div>
            <Lock className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-300">Select a Secure Channel</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              All private and group messages are protected with zero-knowledge keys.
            </p>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Start New Secure Conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Contact or Group Name
                </label>
                <input
                  type="text"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="e.g. Legal Observer Team, Mateo"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newChatIsGroup}
                    onChange={(e) => setNewChatIsGroup(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-red-500"
                  />
                  <span>Create as Group Channel</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChat}
                disabled={!newChatName.trim()}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
              >
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
