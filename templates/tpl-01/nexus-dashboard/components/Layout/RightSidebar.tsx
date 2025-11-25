import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { generateStreamResponse } from '../../services/geminiService';
import { ChatMessage, Sender } from '../../types';
import ReactMarkdown from 'react-markdown';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose, isMobile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: Sender.BOT,
      text: "Hello! I'm your Gemini-powered assistant. How can I help you analyze your data today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: userText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Prepare History for context (simplified)
    const history = messages.map(m => ({
        role: m.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
    }));

    try {
        // Placeholder for streaming response
        const botMsgId = (Date.now() + 1).toString();
        let botText = '';
        
        // Optimistically add bot message container
        setMessages(prev => [...prev, {
            id: botMsgId,
            sender: Sender.BOT,
            text: '',
            timestamp: new Date()
        }]);

        const stream = generateStreamResponse(userText, history);
        
        for await (const chunk of stream) {
            if (chunk) {
                botText += chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === botMsgId ? { ...msg, text: botText } : msg
                ));
            }
        }

    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: Sender.SYSTEM,
            text: "Sorry, I encountered a network error. Please try again.",
            timestamp: new Date(),
            isError: true
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sidebarClasses = `
    fixed inset-y-0 right-0 z-40 bg-white dark:bg-gray-900 border-l border-border
    flex flex-col shadow-xl
    transition-transform duration-300 ease-in-out
    w-80 md:w-96
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    pt-16
  `;

  return (
    <>
         {/* Mobile Overlay */}
         {isMobile && isOpen && (
            <div 
                className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
        )}

        <aside className={sidebarClasses}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-primary font-semibold">
                    <Sparkles size={18} className="text-yellow-500 animate-pulse" />
                    <span>AI Assistant</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setMessages([])} 
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        title="Clear Chat"
                    >
                        <RefreshCcw size={16} />
                    </button>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-[#0b1120]">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                        <Bot size={48} className="mb-2 opacity-50" />
                        <p>Ask me anything regarding your dashboard.</p>
                    </div>
                )}
                
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.sender === Sender.USER ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`
                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                            ${msg.sender === Sender.USER ? 'bg-primary text-white' : 'bg-emerald-600 text-white'}
                        `}>
                            {msg.sender === Sender.USER ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        
                        <div className={`
                            max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm
                            ${msg.sender === Sender.USER 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-white dark:bg-gray-800 border border-border text-gray-800 dark:text-gray-100 rounded-tl-none'}
                            ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}
                        `}>
                            {msg.sender === Sender.BOT ? (
                                <ReactMarkdown 
                                    className="prose dark:prose-invert prose-sm max-w-none"
                                    components={{
                                        pre: ({node, ...props}) => <div className="bg-gray-800 text-white p-2 rounded-md my-2 overflow-x-auto text-xs" {...props} />,
                                        code: ({node, ...props}) => <code className="bg-black/10 dark:bg-white/10 px-1 rounded" {...props} />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                
                {/* Loading Indicator */}
                {isLoading && messages[messages.length - 1]?.sender === Sender.USER && (
                     <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Bot size={14} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 border border-border px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                            <Loader2 size={16} className="animate-spin text-gray-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-border">
                <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl ring-1 ring-transparent focus-within:ring-primary/50 transition-all">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 text-sm py-2 px-1 dark:text-white"
                        rows={1}
                        style={{ minHeight: '40px' }} 
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="flex-shrink-0 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-400">AI can make mistakes. Check important info.</p>
                </div>
            </div>
        </aside>
    </>
  );
};

export default RightSidebar;