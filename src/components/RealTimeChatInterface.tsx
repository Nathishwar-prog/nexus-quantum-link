
import { useState, useEffect, useRef } from 'react';
import { Send, Users, Zap } from 'lucide-react';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { useAuth } from '@/hooks/useAuth';

const RealTimeChatInterface = () => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { messages, users, loading, sendMessage } = useRealTimeChat();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    setIsTyping(true);
    await sendMessage(inputValue);
    setInputValue('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUserDisplayName = (message: any) => {
    if (message.profiles?.display_name) {
      return message.profiles.display_name;
    }
    if (message.profiles?.username) {
      return message.profiles.username;
    }
    return 'Neural Agent';
  };

  const getUserInitial = (message: any) => {
    const displayName = getUserDisplayName(message);
    return displayName[0].toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-neon-blue font-cyber">Connecting to neural network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-neon-blue/20 bg-gradient-to-r from-dark-bg/80 to-glass-bg/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-quantum font-bold text-neon-blue">NEXUS Central</h3>
              <p className="text-xs text-text-color/60 font-cyber">Global Neural Communication Hub</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-dark-bg/50 px-3 py-1 rounded-full">
            <Users className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-cyber text-neon-green">
              {users.length} online
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neon-blue/30 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-color/60 font-cyber">
              Welcome to NEXUS Central. Begin neural communication...
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.user_id === user?.id;
            const showProfile = index === 0 || messages[index - 1]?.user_id !== message.user_id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 ml-4'
                      : 'bg-gradient-to-r from-dark-bg/80 to-glass-bg/60 border border-neon-blue/20 mr-4'
                  } rounded-lg p-3`}
                >
                  {showProfile && !isOwnMessage && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-green to-neon-blue flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {getUserInitial(message)}
                        </span>
                      </div>
                      <span className="text-sm font-cyber text-neon-blue">
                        {getUserDisplayName(message)}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm font-cyber leading-relaxed break-words text-text-color">
                    {message.content}
                  </p>
                  
                  <span className="text-xs text-text-color/50 mt-1 block">
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-neon-blue/20 bg-gradient-to-r from-dark-bg/60 to-glass-bg/40">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Transmit your thoughts to the neural network..."
            className="flex-1 bg-dark-bg/50 border border-neon-blue/30 rounded-lg px-4 py-3 text-sm font-cyber resize-none focus:outline-none focus:border-neon-blue focus:shadow-[0_0_0_3px_rgba(0,243,255,0.2)] transition-all duration-300 text-text-color placeholder:text-text-color/50"
            rows={2}
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg font-cyber font-bold uppercase tracking-wide hover:shadow-[0_5px_15px_rgba(0,243,255,0.3)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 text-white"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        <div className="mt-3 text-xs text-text-color/40 font-cyber text-center">
          Connected to NEXUS Quantum Network • {users.length} Neural Agents Online • End-to-End Encrypted
        </div>
      </div>
    </div>
  );
};

export default RealTimeChatInterface;
