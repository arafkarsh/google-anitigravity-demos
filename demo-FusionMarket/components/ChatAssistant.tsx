import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Stock } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatAssistantProps {
    isMaximized?: boolean;
    onToggleMaximize?: () => void;
    onWarning?: () => void;
    selectedStock?: Stock;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isMaximized, onToggleMaximize, onWarning, selectedStock }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init',
            role: 'model',
            text: 'Hello! I am FuMa. Ask me about market trends, company details, or financial concepts.',
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        let messageToSend = input;
        if (selectedStock) {
            messageToSend = "[Context: User is currently viewing " + selectedStock.name + " (" + selectedStock.symbol + "). If the question is ambiguous or doesn't mention a specific company, assume it refers to " + selectedStock.symbol + ".] " + input;
        }

        const response = await sendMessageToGemini(messageToSend);

        // Check for warning
        if (response.includes("Warning: Abusive or explicit content is not tolerated") && onWarning) {
            onWarning();
        }

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: response,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">FuMa Assistant</h3>
                        <p className="text-xs text-blue-400">Powered by Gemini</p>
                    </div>
                </div>
                {onToggleMaximize && (
                    <button
                        onClick={onToggleMaximize}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={isMaximized ? "Minimize" : "Maximize"}
                    >
                        {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hover-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-600' : 'bg-blue-600'}`}>
                            {msg.role === 'user' ? <User size={14} className="text-slate-600 dark:text-slate-300" /> : <Bot size={14} className="text-white" />}
                        </div>
                        <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-tr-none'
                            : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/20 text-slate-800 dark:text-slate-200 rounded-tl-none'
                            }`}>
                            <div className="prose prose-sm dark:prose-invert max-w-none 
                                prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-200 
                                prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-100 dark:prose-code:bg-blue-900/50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                prose-strong:text-slate-900 dark:prose-strong:text-white
                                prose-ul:my-2 prose-li:my-0.5">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 animate-pulse">
                            <Bot size={14} />
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/20 rounded-2xl rounded-tl-none flex gap-1 items-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about a company or trend..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center">AI may produce inaccurate information.</p>
            </div>
        </div>
    );
};

export default ChatAssistant;
