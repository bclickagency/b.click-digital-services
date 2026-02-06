import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Loader2, Paperclip, FileText, 
  Download, User, Headphones, Clock, CheckCircle, XCircle,
  Search, Filter, RefreshCw, Image, Video, ChevronDown
} from 'lucide-react';
import { useTeamChat, Message, Conversation } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

const ChatManager = () => {
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    sending,
    selectConversation,
    sendMessage,
    sendFile,
    updateStatus,
    loadConversations
  } = useTeamChat();

  // Scroll to bottom
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

  // Handle scroll
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message, 'فريق B.CLICK');
  };

  // Handle file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await sendFile(file, 'فريق B.CLICK');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  // Format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get status config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'نشطة', color: 'bg-green-500/20 text-green-600', icon: CheckCircle };
      case 'pending':
        return { label: 'قيد المتابعة', color: 'bg-yellow-500/20 text-yellow-600', icon: Clock };
      case 'closed':
        return { label: 'مغلقة', color: 'bg-gray-500/20 text-gray-600', icon: XCircle };
      default:
        return { label: status, color: 'bg-gray-500/20', icon: Clock };
    }
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
              className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
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
              className="max-w-full max-h-64 rounded-lg"
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

  return (
    <div className="h-[calc(100vh-180px)] flex gap-4">
      {/* Conversations List */}
      <div className="w-80 flex-shrink-0 flex flex-col glass-card p-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              المحادثات
            </h2>
            <button 
              onClick={loadConversations}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="تحديث"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث..."
              className="w-full bg-muted rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          {/* Filter */}
          <div className="flex gap-2">
            {['all', 'active', 'pending', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "flex-1 text-xs py-1.5 rounded-lg transition-colors",
                  statusFilter === status
                    ? 'bg-primary text-white'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {status === 'all' ? 'الكل' : getStatusConfig(status).label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>لا توجد محادثات</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const statusConfig = getStatusConfig(conv.status);
              return (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    "w-full p-4 text-right border-b border-border hover:bg-muted/50 transition-colors",
                    selectedConversation?.id === conv.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium truncate">{conv.customer_name}</span>
                        {conv.unread_count > 0 && (
                          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        {conv.customer_email}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", statusConfig.color)}>
                          {statusConfig.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conv.last_message_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card p-0 overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">{selectedConversation.customer_name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedConversation.customer_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedConversation.status}
                  onChange={(e) => updateStatus(selectedConversation.id, e.target.value as any)}
                  className="bg-muted border-0 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="active">نشطة</option>
                  <option value="pending">قيد المتابعة</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>
            </div>

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
                    "flex gap-3",
                    message.sender_type === 'team' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.sender_type === 'team'
                        ? 'bg-primary/20'
                        : 'bg-secondary/20'
                    )}
                  >
                    {message.sender_type === 'team' ? (
                      <Headphones className="w-4 h-4 text-primary" />
                    ) : (
                      <User className="w-4 h-4 text-secondary" />
                    )}
                  </div>
                  <div className="max-w-[70%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">{message.sender_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleTimeString('ar-EG', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-2xl",
                        message.sender_type === 'team'
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      )}
                    >
                      {renderMessageContent(message)}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {sending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-end"
                >
                  <div className="bg-primary/20 p-3 rounded-2xl rounded-tr-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll Button */}
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

            {/* Input */}
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
                  disabled={sending}
                  className="w-12 h-12 rounded-xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Paperclip className="w-5 h-5 text-muted-foreground" />
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
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-medium mb-2">اختر محادثة</h3>
              <p className="text-sm text-muted-foreground">
                اختر محادثة من القائمة لبدء الرد على العملاء
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManager;
