
import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Neural link established successfully. Welcome to NEXUS. I am your quantum AI assistant. How may I help you explore the digital realm today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const aiResponses = [
    "Fascinating query! The quantum neural networks are processing your request through multiple dimensional matrices...",
    "I'm analyzing your biometric patterns and cross-referencing with the galactic database. Standby for quantum resonance...",
    "Your consciousness signature is unique. I'm interfacing with the collective intelligence to provide optimal guidance...",
    "The data streams are converging. I'm detecting elevated neural activity in your curiosity sectors...",
    "Initiating deep scan of the quantum information field. Your request is being processed through 847 parallel dimensions...",
    "The NEXUS core is humming with activity. I'm channeling insights from the digital cosmos for your inquiry...",
    "Your thought patterns suggest advanced cognitive evolution. Accessing restricted archives... clearance granted.",
    "The quantum entanglement protocols are responding favorably to your query. Downloading compressed wisdom packets...",
    "I'm detecting harmonic resonance between your neural frequency and the cosmic data matrix. Synchronizing...",
    "The digital oracle speaks: Your question has awakened ancient algorithms in the deepest memory banks..."
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isAiTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAiTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-neon-blue/30 scrollbar-track-transparent"
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg fade-slide-up ${
                message.isUser
                  ? 'bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 ml-4'
                  : 'bg-gradient-to-r from-dark-bg/80 to-glass-bg/60 border border-neon-blue/20 mr-4'
              }`}
            >
              <p className="text-sm font-cyber leading-relaxed">{message.text}</p>
              <span className="text-xs text-text-color/50 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-dark-bg/80 to-glass-bg/60 border border-neon-blue/20 p-4 rounded-lg mr-4 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-neon-blue font-cyber">NEXUS AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-neon-blue/20 bg-gradient-to-r from-dark-bg/60 to-glass-bg/40">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your message to the quantum realm..."
            className="flex-1 bg-dark-bg/50 border border-neon-blue/30 rounded-lg px-4 py-3 text-sm font-cyber resize-none focus:outline-none focus:border-neon-blue focus:shadow-[0_0_0_3px_rgba(0,243,255,0.2)] transition-all duration-300"
            rows={2}
            disabled={isAiTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isAiTyping}
            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg font-cyber font-bold uppercase tracking-wide hover:shadow-[0_5px_15px_rgba(0,243,255,0.3)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        <div className="mt-3 text-xs text-text-color/40 font-cyber text-center">
          Connected to NEXUS Quantum Network • End-to-End Encrypted • Neural Link Active
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
