import React, { useState, useEffect, useRef } from "react";
import { createIdea } from "../services/ideaService";
import RadarChart from "./RadarChart";

function EnhancedChatbot({ user, onIdeaSubmitted, onClose, initialIdeaData, autoAnalyze }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStage, setConversationStage] = useState("greeting");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [ideaData, setIdeaData] = useState({
    problem: "",
    solution: "",
    market: "",
    revenueModel: "",
    team: ""
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const hasProcessed = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check scroll position and show/hide scroll buttons
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollUp(scrollTop > 100);
      setShowScrollDown(scrollTop < scrollHeight - clientHeight - 100);
    };

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition(); // Initial check

    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

// Close on Escape key
useEffect(() => {
  const onKey = (e) => {
    if (e.key === 'Escape' && onClose) onClose();
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, [onClose]);

  const processedRef = useRef(false);

  // Initialize conversation
  useEffect(() => {
    if (initialIdeaData && autoAnalyze && !hasProcessed.current) {
      hasProcessed.current = true;
      
      setMessages([{
        id: 1,
        content: "Form submitted successfully! 📤",
        isUser: true,
        timestamp: new Date()
      }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 2,
          content: "🧠 Received your idea form. Analyzing now...",
          isUser: false,
          timestamp: new Date()
        }]);
        
        setTimeout(async () => {
          try {
            const result = await createIdea(initialIdeaData);
            
            setMessages(prev => [...prev, {
              id: 3,
              content: `✅ Score: ${result.idea.score}/100 (${result.idea.classification} potential)`,
              isUser: false,
              timestamp: new Date()
            }]);
            
            if (result.idea.breakdown) {
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: 4,
                  content: "📊 Analysis Breakdown",
                  isUser: false,
                  timestamp: new Date(),
                  isChart: true,
                  breakdown: result.idea.breakdown,
                  score: result.idea.score,
                  classification: result.idea.classification
                }]);
              }, 500);
            }
            
            if (onIdeaSubmitted) onIdeaSubmitted(result.idea);
          } catch (e) {
            setMessages(prev => [...prev, {
              id: 5,
              content: "Analysis failed. Please try again.",
              isUser: false,
              timestamp: new Date()
            }]);
          }
        }, 1000);
      }, 800);
    } else if (!initialIdeaData && messages.length === 0) {
      addBotMessage("Hi! I'll help you submit your startup idea. Let's start with the problem you're solving.");
    }
  }, []);

  const addBotMessage = (text, delay = 1000) => {
    if (delay === 0) {
      const botMessage = {
        id: Date.now() + Math.random(),
        content: text,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + Math.random(),
          content: text,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, delay);
    }
  };

  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      content: text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const getNextQuestion = (stage) => {
    const questions = {
      problem: "What's your solution?",
      solution: "Who's your target market?",
      market: "How will you make money?",
      revenueModel: "Tell me about your team.",
      team: "Perfect! Let me analyze your idea..."
    };
    return questions[stage];
  };

  // Function to detect vague answers
  const isVagueAnswer = (input, stage) => {
    const vaguePatterns = [
      /^(i don't know|dunno|no idea|not sure|maybe|perhaps|i guess|probably)$/i,
      /^(yes|no|ok|okay|sure|fine|good|bad|nice|cool)$/i,
      /^(nothing|none|n\/a|na|nothing much|not much)$/i,
      /^\d+$/, // Just numbers
      /^.{1,10}$/ // Very short answers (less than 10 chars)
    ];
    
    return vaguePatterns.some(pattern => pattern.test(input.trim()));
  };

  // Function to generate follow-up questions based on stage
  const getFollowUpQuestion = (stage, followUpCount) => {
    const followUps = {
      problem: [
        "Can you tell me more about this problem? What makes it important?",
        "How do people currently deal with this issue?",
        "What's the impact of this problem on your target users?",
        "Can you give me a specific example of this problem?",
        "What inspired you to work on this problem?"
      ],
      solution: [
        "How exactly does your solution work?",
        "What makes your approach different from existing solutions?",
        "Can you walk me through how a user would use this?",
        "What technology or method will you use to build this?",
        "How will you test if your solution actually works?"
      ],
      market: [
        "Can you describe your ideal customer in more detail?",
        "How big is this market? Any specific numbers?",
        "Where do these customers typically hang out or look for solutions?",
        "What's your strategy for reaching these customers?",
        "Who are your main competitors in this space?"
      ],
      revenueModel: [
        "How exactly will customers pay you?",
        "What's your pricing strategy?",
        "How did you arrive at these prices?",
        "What's your path to profitability?",
        "How will you scale this revenue model?"
      ],
      team: [
        "What specific skills does your team bring?",
        "What roles are you still looking to fill?",
        "How will you handle areas where you need more expertise?",
        "What's your plan for growing the team?",
        "What's your equity distribution strategy?"
      ]
    };

    const stageFollowUps = followUps[stage] || [];
    return stageFollowUps[followUpCount % stageFollowUps.length];
  };

  const getBotResponse = (userInput, stage) => {
    const responses = {
      problem: [
        "That's a compelling problem! I can see the pain point. What's your solution?",
        "Interesting challenge! How do you plan to solve this?",
        "I understand the problem. What's your approach to addressing it?",
        "That's a real issue many face. What solution are you developing?"
      ],
      solution: [
        "That's a creative solution! Who's your target market?",
        "I like your approach! Who will benefit from this?",
        "Smart solution! Who are your ideal customers?",
        "That sounds promising! Who do you see using this?"
      ],
      market: [
        "Great market insight! How do you plan to make money?",
        "Solid target market! What's your revenue strategy?",
        "I see the opportunity! How will you monetize this?",
        "Good market understanding! What's your business model?"
      ],
      revenueModel: [
        "That's a viable revenue model! Tell me about your team.",
        "Smart monetization strategy! Who's on your team?",
        "Good business model! What's your team composition?",
        "Solid revenue approach! Who's helping you build this?"
      ],
      team: [
        "Excellent team composition! Let me analyze your idea...",
        "Great team mix! I'm processing your submission...",
        "Strong team! Analyzing your startup idea now...",
        "Perfect! Let me evaluate your complete idea..."
      ]
    };

    const stageResponses = responses[stage] || [];
    return stageResponses[Math.floor(Math.random() * stageResponses.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userInput = inputValue.trim();
    addUserMessage(userInput);
    setInputValue("");

    // Check if answer is vague and handle accordingly
    if (conversationStage !== "greeting" && isVagueAnswer(userInput, conversationStage)) {
      if (followUpCount < 2) { // Max 2 follow-up questions per stage
        setFollowUpCount(prev => prev + 1);
        addBotMessage(getFollowUpQuestion(conversationStage, followUpCount));
        return;
      } else {
        // After 2 follow-ups, accept whatever they gave and move on
        addBotMessage("I understand. Let me move on to the next question.");
        setFollowUpCount(0);
      }
    } else {
      // Reset follow-up count for good answers
      setFollowUpCount(0);
    }

    // Store the user's response
    if (conversationStage !== "greeting") {
      setIdeaData(prev => ({
        ...prev,
        [conversationStage]: userInput
      }));
    }

    // Handle different conversation stages
    if (conversationStage === "greeting") {
      setIdeaData(prev => ({ ...prev, problem: userInput }));
      setConversationStage("problem");
      addBotMessage(getNextQuestion("problem"));
    } else if (conversationStage === "problem") {
      setIdeaData(prev => ({ ...prev, solution: userInput }));
      setConversationStage("solution");
      addBotMessage(getNextQuestion("solution"));
    } else if (conversationStage === "solution") {
      setIdeaData(prev => ({ ...prev, market: userInput }));
      setConversationStage("market");
      addBotMessage(getNextQuestion("market"));
    } else if (conversationStage === "market") {
      setIdeaData(prev => ({ ...prev, revenueModel: userInput }));
      setConversationStage("revenueModel");
      addBotMessage(getNextQuestion("revenueModel"));
    } else if (conversationStage === "revenueModel") {
      setIdeaData(prev => ({ ...prev, team: userInput }));
      setConversationStage("team");
      addBotMessage(getNextQuestion("team"));
    } else if (conversationStage === "team") {
      // Submit the idea
      try {
        setIsTyping(true);
        addBotMessage("🚀 Analyzing your idea... This might take a moment.", 0);
        
        const result = await createIdea(ideaData);
        
        setTimeout(() => {
          addBotMessage(`✅ Idea submitted! Score: ${result.idea.score}/100 (${result.idea.classification} potential)`, 0);
          
          if (result.idea.breakdown) {
            setTimeout(() => {
              addBotMessage("Here's your idea analysis breakdown:", 0);
              const chartMessage = {
                id: Date.now() + Math.random(),
                content: "📊 Idea Analysis Breakdown",
                isUser: false,
                timestamp: new Date(),
                isChart: true,
                breakdown: result.idea.breakdown,
                score: result.idea.score,
                classification: result.idea.classification
              };
              setMessages(prev => [...prev, chartMessage]);
            }, 500);
          }
          
          setTimeout(() => {
            addBotMessage("Your idea is saved to your dashboard. Thanks!", 0);
            if (onIdeaSubmitted) onIdeaSubmitted(result.idea);
            setIsTyping(false);
          }, 1000);
        }, 800);
      } catch (error) {
        addBotMessage("I'm sorry, there was an error submitting your idea. Please try again or contact support.", 0);
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startNewConversation = () => {
    // Save current conversation to history
    if (messages.length > 0) {
      setConversationHistory(prev => [...prev, {
        id: Date.now(),
        messages: [...messages],
        ideaData: { ...ideaData },
        timestamp: new Date()
      }]);
    }
    
    setMessages([]);
    setConversationStage("greeting");
    setFollowUpCount(0);
    setIdeaData({
      problem: "",
      solution: "",
      market: "",
      revenueModel: "",
      team: ""
    });
    setTimeout(() => {
      addBotMessage("Hi! I'll help you submit your startup idea. Let's start with the problem you're solving.");
    }, 500);
  };

  const loadConversation = (conversation) => {
    setMessages(conversation.messages);
    setIdeaData(conversation.ideaData);
    setConversationStage("team"); // Assume completed conversation
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="chatbot-container" onKeyDown={(e)=>{ if(e.key==='Escape' && onClose) onClose(); }}>
      <div className="chatbot-header">
        <div className="chatbot-title">
          <h2>💬 Submit Your Idea</h2>
          <p>Tell me about your startup idea</p>
        </div>
        <div className="chatbot-actions">
          {conversationHistory.length > 0 && (
            <div className="conversation-history">
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    const conversation = conversationHistory.find(c => c.id === parseInt(e.target.value));
                    if (conversation) loadConversation(conversation);
                  }
                }}
                className="history-select"
              >
                <option value="">Previous conversations</option>
                {conversationHistory.map(conv => (
                  <option key={conv.id} value={conv.id}>
                    {conv.timestamp.toLocaleDateString()} - {conv.ideaData.problem?.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          )}
          <button 
            onClick={startNewConversation} 
            className="btn-secondary btn-small"
            disabled={isTyping}
          >
            New
          </button>
          <button 
            onClick={onClose} 
            className="btn-close btn-small"
            disabled={isTyping}
            title="Exit chatbot"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="chatbot-messages" ref={messagesContainerRef}>
        {showScrollUp && (
          <button
            className="scroll-button scroll-up"
            onClick={scrollToTop}
            title="Scroll to top"
          >
            ↑
          </button>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.isUser ? "user-message" : "bot-message"}`}
          >
            <div className="message-content">
              {message.isChart ? (
                <div className="chart-message">
                  <h4>{message.content}</h4>
                  <div className="chart-container">
                    <RadarChart breakdown={message.breakdown} size={250} showLabels={true} showValues={true} />
                    <div className="chart-stats">
                      <div className="score-display">
                        <span className="score-number">{message.score}</span>
                        <span className="score-label">/100</span>
                      </div>
                      <div className="classification-display">
                        <span className={`classification-badge ${message.classification.toLowerCase()}`}>
                          {message.classification} Potential
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                message.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))
              )}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {showScrollDown && (
          <button
            className="scroll-button scroll-down"
            onClick={scrollToBottom}
            title="Scroll to bottom"
          >
            ↓
          </button>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chatbot-input">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your response here... (Press Enter to send, Shift+Enter for new line)"
            disabled={isTyping}
            rows="3"
            className="chat-input"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="send-button"
          >
            {isTyping ? "..." : "Send"}
          </button>
        </div>
      </form>

      <div className="chatbot-progress">
        <div className="progress-steps">
          <div className={`step ${conversationStage === "greeting" || conversationStage === "problem" ? "active" : "completed"}`}>
            <span>1</span>
            <label>Problem</label>
          </div>
          <div className={`step ${conversationStage === "solution" ? "active" : conversationStage === "market" || conversationStage === "revenueModel" || conversationStage === "team" ? "completed" : ""}`}>
            <span>2</span>
            <label>Solution</label>
          </div>
          <div className={`step ${conversationStage === "market" ? "active" : conversationStage === "revenueModel" || conversationStage === "team" ? "completed" : ""}`}>
            <span>3</span>
            <label>Market</label>
          </div>
          <div className={`step ${conversationStage === "revenueModel" ? "active" : conversationStage === "team" ? "completed" : ""}`}>
            <span>4</span>
            <label>Revenue</label>
          </div>
          <div className={`step ${conversationStage === "team" ? "active" : ""}`}>
            <span>5</span>
            <label>Team</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedChatbot;
