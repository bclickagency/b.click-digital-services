import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Loader2, Paperclip, Image, 
  FileText, Video, Download, ChevronDown, User, Headphones
} from 'lucide-react';
import { useCustomerChat, Message } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface ChatWidgetProps {
  className?: string;
}

const ChatWidget = ({ className }: ChatWidgetProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showStartForm, setShowStartForm] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [input, setInput] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Hide on admin pages
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    conversation,
    messages,
    loading,
    sending,
    uploading,
    startConversation,
    sendMessage,
    sendFile
  } = useCustomerChat();

  // Auto scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto' 
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Check if should show scroll button
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  // Handle conversation state
  useEffect(() => {
    if (conversation) {
      setShowStartForm(false);
    }
  }, [conversation]);

  // Start conversation
  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    const conv = await startConversation(name.trim(), email.trim());
    if (conv) {
      setShowStartForm(false);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  // Handle file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await sendFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Render message content
  const renderMessageContent = (message: Message) => {
    switch (message.message_type) {
      case 'image':
        return (
          <div className="space-y-2">
            <img 
              src={message.file_url || ''} 
              alt={message.file_name || 'صورة'}
              className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(message.file_url || '', '_blank')}
            />
            {message.file_name && (
              <p className="text-xs opacity-70">{message.file_name}</p>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-2">
            <video 
              src={message.file_url || ''} 
              controls 
              className="max-w-full rounded-lg"
            />
            {message.file_name && (
              <p className="text-xs opacity-70">{message.file_name}</p>
            )}
          </div>
        );
      
      case 'file':
        return (
          <a 
            href={message.file_url || ''} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.file_name}</p>
              <p className="text-xs opacity-70">{formatFileSize(message.file_size)}</p>
            </div>
            <Download className="w-4 h-4 opacity-50" />
          </a>
        );
      
      default:
        return (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        );
    }
  };
  // Don't render on admin pages
  if (isAdminPage) return null;

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 left-6 z-40 w-14 h-14 rounded-2xl",
          "bg-primary shadow-lg shadow-primary/25",
          "flex items-center justify-center",
          "hover:shadow-primary/40 transition-all duration-300",
          className
        )}
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-24 left-6 z-50",
              "w-[380px] h-[550px] max-h-[75vh]",
              "bg-background/95 backdrop-blur-2xl",
              "rounded-2xl shadow-2xl",
              "flex flex-col overflow-hidden",
              "border border-border/50"
            )}
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">تواصل مع فريق B.CLICK</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-xs text-white/80">متصل الآن</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content */}
            {showStartForm ? (
              /* Start Form */
              <form onSubmit={handleStartChat} className="flex-1 p-6 flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">مرحباً بك! 👋</h4>
                  <p className="text-sm text-muted-foreground">
                    أدخل بياناتك لبدء المحادثة مع فريقنا
                  </p>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full bg-muted rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full bg-muted rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !email.trim()}
                  className="w-full bg-primary text-white rounded-xl py-3 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      بدء المحادثة
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Chat Area */
              <>
                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2",
                        message.sender_type === 'customer' ? 'flex-row-reverse' : ''
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          message.sender_type === 'customer'
                            ? 'bg-secondary/20'
                            : 'bg-primary/20'
                        )}
                      >
                        {message.sender_type === 'customer' ? (
                          <User className="w-4 h-4 text-secondary" />
                        ) : (
                          <Headphones className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "max-w-[80%] p-3 rounded-2xl",
                          message.sender_type === 'customer'
                            ? 'bg-secondary text-white rounded-tr-sm'
                            : 'bg-muted rounded-tl-sm'
                        )}
                      >
                        {renderMessageContent(message)}
                        <p className={cn(
                          "text-[10px] mt-1",
                          message.sender_type === 'customer' ? 'text-white/60' : 'text-muted-foreground'
                        )}>
                          {new Date(message.created_at).toLocaleTimeString('ar-EG', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Loading indicator */}
                  {(sending || uploading) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 justify-end"
                    >
                      <div className="bg-secondary/20 p-3 rounded-2xl rounded-tr-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll to bottom button */}
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => scrollToBottom()}
                      className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full p-2 shadow-lg"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,video/*,.pdf,.doc,.docx,.zip"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      ) : (
                        <Paperclip className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="اكتب رسالتك..."
                      className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || sending}
                      className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
