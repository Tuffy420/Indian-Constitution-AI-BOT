import React, { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Loader2, Scale } from 'lucide-react';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Namaste! I am your Indian Constitution assistant. Ask me anything about rights, duties, or articles.',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userMessage.content }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botMessage = { role: 'assistant', content: data.answer };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-parchment font-sans">
            {/* Header */}
            <header className="bg-primary text-white shadow-lg p-4 flex items-center justify-between border-b-4 border-secondary">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-full">
                        <Scale className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold tracking-wide text-white">Samvidhan AI</h1>
                        <p className="text-xs text-gray-300 uppercase tracking-wider">Guardian of the Constitution</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <BookOpen className="w-4 h-4" />
                    <span>Satyameva Jayate</span>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-chakra-pattern">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[70%] p-5 rounded-2xl shadow-md relative ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none border-l-4 border-primary'
                                }`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="absolute -top-3 -left-3 bg-primary text-white p-1 rounded-full shadow-sm">
                                    <Scale className="w-4 h-4" />
                                </div>
                            )}
                            <p className={`leading-relaxed ${msg.role === 'assistant' ? 'font-serif text-lg' : 'font-sans'}`}>
                                {msg.content}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border-l-4 border-primary flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                            <span className="text-gray-500 font-serif italic">Consulting the Archives...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your Fundamental Rights..."
                        className="flex-1 p-4 pl-6 rounded-full border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-inner bg-gray-50 font-serif text-lg placeholder:text-gray-400 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 bg-primary text-white rounded-full hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-xs text-gray-400">AI can make mistakes. Verify with official text.</p>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
