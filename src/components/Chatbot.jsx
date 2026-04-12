import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import './Chatbot.css';

const { skills, experience, projects, education } = portfolioData;

const suggestedQuestions = [
  "What technologies do you know?",
  "Explain your projects",
  "What is your experience?",
  "Where did you study?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! I'm Bibin's Portfolio AI Assistant. How can I help you learn more about him?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const generateResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
      return `Bibin excels in Full Stack Development. His core technical stack includes ${skills.technical.slice(0, 5).join(', ')}, and more! He also leverages tools like ${skills.tools.slice(0, 3).join(', ')}.`;
    }
    
    if (q.includes('experience') || q.includes('work') || q.includes('job')) {
      const latestJob = experience[0];
      return `Bibin currently works as a ${latestJob.role} at ${latestJob.company} (${latestJob.duration}). Check out the Work Experience section for details on his previous internships!`;
    }
    
    if (q.includes('project') || q.includes('portfolio')) {
      const projectNames = projects.map(p => p.title).join(', ');
      return `Bibin has built some fantastic projects including: ${projectNames}. For example, BookSphere uses React, Spring Boot, and MongoDB.`;
    }
    
    if (q.includes('education') || q.includes('study') || q.includes('degree') || q.includes('school')) {
      const latestEdu = education[0];
      return `Bibin holds a ${latestEdu.degree} from ${latestEdu.institution} (${latestEdu.year}).`;
    }
    
    if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
      return "Hello there! Feel free to ask me anything about Bibin's skills, experience, or projects!";
    }

    return "That is a great question! For specific inquiries outside of my database, it's best to reach out to Bibin via the Contact form or his email.";
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: response }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="chatbot-fab btn-primary"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chat Assistant"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="chatbot-window glass-panel"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-title">
                <Bot size={20} />
                <h3>Portfolio Assistant</h3>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`chat-bubble-container ${msg.sender === 'user' ? 'user' : 'bot'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="chat-avatar bot-avatar">
                      <Bot size={16} />
                    </div>
                  )}
                  <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="chat-avatar user-avatar">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="chat-bubble-container bot">
                  <div className="chat-avatar bot-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="chat-bubble bot-bubble typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length < 3 && !isTyping && (
              <div className="chatbot-suggestions">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="chatbot-input-area">
              <input
                type="text"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chatbot-input"
              />
              <button 
                className="chatbot-send" 
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
