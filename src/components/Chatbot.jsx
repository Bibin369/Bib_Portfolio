import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, MoveRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { useNavigate, useLocation } from 'react-router-dom';
import './Chatbot.css';

const { skills, experience, projects, travel } = portfolioData;

const initialSuggestions = ["My Skills", "Projects", "Experience", "Travel", "Contact Me"];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Hi! I'm Bibin's AI Assistant. I can tell you about his expertise in IIB, ESQL, Full Stack, or even his travels! What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState('general');
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Handle navigation requests
  const handleNavigation = (sectionPath, hash) => {
    if (location.pathname !== sectionPath) {
      navigate(sectionPath);
    }
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  const determineIntent = (query) => {
    const q = query.toLowerCase();
    
    // Follow-up context awareness
    if (/\b(more|explain|tell me|detail|about that)\b/.test(q)) {
      return { intent: 'followup' };
    }

    if (/\b(hi|hello|hey|greetings|morning)\b/.test(q)) return { intent: 'greeting' };
    if (/\b(skill|skills|tech|esql|sql|db2|xml|integration|react|java|python|iib)\b/.test(q)) return { intent: 'skills' };
    if (/\b(experience|work|job|internship|invoice|workflow|mapping)\b/.test(q)) return { intent: 'experience' };
    if (/\b(project|portfolio|built|make|create|booksphere)\b/.test(q)) return { intent: 'projects' };
    if (/\b(education|study|degree|college|school)\b/.test(q)) return { intent: 'education' };
    if (/\b(travel|visited|trip|journey|munnar|vagamon|ooty|goa|bangalore)\b/.test(q)) return { intent: 'travel' };
    if (/\b(contact|email|hire|phone|reach)\b/.test(q)) return { intent: 'contact' };
    
    return { intent: 'unknown' };
  };

  const generateResponse = async (query) => {
    const { intent } = determineIntent(query);
    const q = query.toLowerCase();
    
    let responseText = "";
    let newContext = context;
    let newSuggestions = ["Explain more", "Projects", "Contact Me"];

    switch(intent) {
      case 'greeting':
        responseText = "Hello there! I'm equipped to chat about Bibin's Full Stack capabilities, enterprise integration skills like IIB, or his travel journeys. What's on your mind?";
        newSuggestions = ["My Skills", "Experience", "Travel"];
        newContext = 'general';
        break;

      case 'skills':
        if (q.includes('esql') || q.includes('xml') || q.includes('iib') || q.includes('integration') || q.includes('db2')) {
          responseText = "Ah, enterprise tech! Bibin has high-level expertise in IBM Integration Bus (IIB). He writes complex mapping logic in ESQL, handles XML messaging, and integrates seamlessly with databases like DB2 and SQL.";
          newSuggestions = ["Any projects related to that?", "Experience", "Contact Me"];
        } else {
          responseText = `Bibin is a versatile Full Stack Developer! His core arsenal includes ${skills.technical.slice(0, 5).join(', ')}. He also excels in robust backend integrations with Java, Python, and SQL databases.`;
          newSuggestions = ["More about IIB/ESQL", "Experience", "Projects"];
        }
        newContext = 'skills';
        handleNavigation('/', 'skills');
        break;

      case 'experience':
        responseText = "Bibin's professional experience is characterized by efficiency and problem-solving. At his recent roles, he developed robust workflows, designed invoice processing automations, and managed complex REST API architectures.";
        newSuggestions = ["Tell me more", "Tech Stack used", "Projects"];
        newContext = 'experience';
        handleNavigation('/', 'experience');
        break;

      case 'projects':
        responseText = `Bibin has built some impressive and scalable systems! For instance, ${projects[0].title} utilizes ${projects[0].technologies.slice(0,3).join(', ')}. He's also worked on Machine Learning and dynamic web apps.`;
        newSuggestions = ["Explain more", "Experience", "My Skills"];
        newContext = 'projects';
        handleNavigation('/', 'projects');
        break;

      case 'education':
        responseText = "Bibin holds a Master of Computer Applications (MCA) from Marian College Kuttikkanam, alongside a BCA. He possesses a deeply rooted theoretical and practical foundation in software engineering.";
        newSuggestions = ["My Skills", "Projects", "Experience"];
        newContext = 'education';
        handleNavigation('/', 'education');
        break;

      case 'travel':
        responseText = `Bibin is an avid traveler who loves exploring! He's journeyed to breathtaking places like Munnar, Vagamon, Ooty, Goa, and Bangalore. Would you like me to take you to the Travel gallery to see the photos?`;
        newSuggestions = ["Yes, show me travel!", "My Skills", "Experience"];
        newContext = 'travel';
        break;

      case 'contact':
        responseText = `You can easily reach Bibin via email at ${portfolioData.contact.email} or connect with him on LinkedIn. I can scroll you down to the contact form right now!`;
        newSuggestions = ["Take me to Contact", "My Skills", "Resume"];
        newContext = 'contact';
        handleNavigation('/', 'contact');
        break;

      case 'followup':
        if (context === 'skills') {
          responseText = "Beyond just coding, Bibin architects solutions. He's proficient in agile methodologies, AWS Cloud deployments, and using tools like JIRA, DBeaver, and SoapUI for end-to-end integration testing.";
        } else if (context === 'experience') {
          responseText = "Specifically, his work involves parsing and mapping massive datasets, streamlining legacy systems, and accelerating business pipelines using highly optimized API layers.";
        } else if (context === 'travel') {
          responseText = "Check out the majestic views of Munnar or the historic forts of Goa! I am navigating you to the Travel section now so you can see all the images.";
          handleNavigation('/travel', null);
        } else if (context === 'projects') {
          responseText = "His projects are full-stack, deploying React/Bootstrap frontends with Java Spring Boot or Django backends, often backed by MongoDB or SQLite to guarantee speed and scalability.";
        } else {
          responseText = "Could you specify what you'd like to know more about? Skills, Experience, or something else?";
        }
        break;

      default:
        // Graceful fallback for unknown intents
        if (q.includes("yes, show me travel!") || q.includes("show me travel") || (context === 'travel' && q.includes("yes"))) {
          responseText = "Awesome! Navigating you to his travel journeys right now. Keep scrolling to see the amazing photos!";
          handleNavigation('/travel', null);
        } else if (q.includes("resume") || q.includes("cv")) {
          responseText = "You can download Bibin's resume from the Hero section or the Contact section. You'll find the button easily!";
          handleNavigation('/', 'hero');
        } else {
           // Fallback AI simulation logic
          responseText = "That's a very interesting question! While my specialized domain is Bibin's professional portfolio and tech stack, I recommend reaching out directly to him via the Contact section for deeper specific questions. Can I help you with his Skills or Experience?";
          newSuggestions = ["My Skills", "Experience", "Contact Me"];
        }
        break;
    }

    setContext(newContext);
    setSuggestions(newSuggestions);
    return responseText;
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // Check if API key is provided for real Gemini fallback (Simulated check)
    // If not, we rely on our highly robust internal hybrid engine.
    
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setSuggestions([]); // hide suggestions while typing

    setTimeout(async () => {
      const response = await generateResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800); // Realistic fuzzy typing delay
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
            aria-label="Open Smart Assistant"
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
                <h3>Smart Assistant</h3>
                <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px' }}>AI</span>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, originY: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={msg.id}
                  className={`chat-bubble-container ${msg.sender === 'user' ? 'user' : 'bot'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="chat-avatar bot-avatar">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="chat-avatar user-avatar">
                      <User size={14} />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="chat-bubble-container bot">
                  <div className="chat-avatar bot-avatar">
                    <Bot size={14} />
                  </div>
                  <div className="chat-bubble bot-bubble typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Action Suggestions */}
            <AnimatePresence>
              {!isTyping && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="chatbot-suggestions"
                >
                  {suggestions.map((q, i) => (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={i} 
                      className="suggestion-chip" 
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="chatbot-input-area">
              <input
                type="text"
                placeholder="Ask me anything..."
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
