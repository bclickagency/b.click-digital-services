import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'customer' | 'team';
  sender_id: string | null;
  sender_name: string;
  content: string | null;
  message_type: 'text' | 'image' | 'video' | 'file';
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_session_id: string;
  status: 'active' | 'pending' | 'closed';
  assigned_to: string | null;
  unread_count: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

const ALLOWED_FILE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/webm',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip', 'application/x-zip-compressed'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Generate or retrieve session ID for customers
const getCustomerSessionId = (): string => {
  const storageKey = 'bclick_chat_session';
  let sessionId = localStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, sessionId);
  }
  return sessionId;
};

// Customer hook for chat widget
export const useCustomerChat = () => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const sessionId = useRef(getCustomerSessionId());

  // Load existing conversation
  const loadConversation = useCallback(async () => {
    setLoading(true);
    try {
      const { data: convs, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('customer_session_id', sessionId.current)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (convs && convs.length > 0) {
        const conv = convs[0] as Conversation;
        setConversation(conv);
        await loadMessages(conv.id);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as Message[]);
    }
  };

  // Start new conversation
  const startConversation = async (name: string, email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          customer_name: name,
          customer_email: email,
          customer_session_id: sessionId.current,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      
      setConversation(data as Conversation);
      
      // Send welcome message
      await sendMessage('مرحباً! شكراً لتواصلكم مع B.CLICK. كيف يمكننا مساعدتكم؟', 'team', 'فريق B.CLICK', data.id);
      
      return data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء بدء المحادثة',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (
    content: string,
    senderType: 'customer' | 'team' = 'customer',
    senderName?: string,
    convId?: string
  ) => {
    const conversationId = convId || conversation?.id;
    if (!conversationId) return null;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_type: senderType,
          sender_name: senderName || conversation?.customer_name || 'عميل',
          content,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      if (senderType === 'customer') {
        setMessages(prev => [...prev, data as Message]);
      }
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الرسالة',
        variant: 'destructive'
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  // Upload and send file
  const sendFile = async (file: File) => {
    if (!conversation?.id) return null;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: 'نوع الملف غير مدعوم',
        description: 'الملفات المدعومة: صور، فيديو، PDF، Word، ZIP',
        variant: 'destructive'
      });
      return null;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'حجم الملف كبير جداً',
        description: 'الحد الأقصى لحجم الملف هو 50 ميجابايت',
        variant: 'destructive'
      });
      return null;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${conversation.id}/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      // Determine message type
      let messageType: 'image' | 'video' | 'file' = 'file';
      if (file.type.startsWith('image/')) messageType = 'image';
      else if (file.type.startsWith('video/')) messageType = 'video';

      // Send message with file
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_type: 'customer',
          sender_name: conversation.customer_name,
          message_type: messageType,
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as Message]);
      toast({
        title: 'تم الإرسال',
        description: 'تم إرسال الملف بنجاح'
      });
      
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء رفع الملف',
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    if (!conversation?.id) return;

    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add if not already present and from team
          if (newMessage.sender_type === 'team') {
            setMessages(prev => {
              const exists = prev.some(m => m.id === newMessage.id);
              if (exists) return prev;
              return [...prev, newMessage];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id]);

  // Initial load
  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return {
    conversation,
    messages,
    loading,
    sending,
    uploading,
    startConversation,
    sendMessage,
    sendFile,
    loadConversation
  };
};

// Team hook for managing conversations
export const useTeamChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  // Load all conversations
  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations((data || []) as Conversation[]);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for selected conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as Message[]);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('is_read', false);

      // Reset unread count
      await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  // Select conversation
  const selectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    loadMessages(conv.id);
  };

  // Send message as team
  const sendMessage = async (content: string, senderName: string) => {
    if (!selectedConversation?.id) return null;

    setSending(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_type: 'team',
          sender_id: userData.user?.id,
          sender_name: senderName,
          content,
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as Message]);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال الرسالة',
        variant: 'destructive'
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  // Send file as team
  const sendFile = async (file: File, senderName: string) => {
    if (!selectedConversation?.id) return null;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: 'نوع الملف غير مدعوم',
        description: 'الملفات المدعومة: صور، فيديو، PDF، Word، ZIP',
        variant: 'destructive'
      });
      return null;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'حجم الملف كبير جداً',
        description: 'الحد الأقصى لحجم الملف هو 50 ميجابايت',
        variant: 'destructive'
      });
      return null;
    }

    setSending(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${selectedConversation.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      let messageType: 'image' | 'video' | 'file' = 'file';
      if (file.type.startsWith('image/')) messageType = 'image';
      else if (file.type.startsWith('video/')) messageType = 'video';

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_type: 'team',
          sender_id: userData.user?.id,
          sender_name: senderName,
          message_type: messageType,
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as Message]);
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء رفع الملف',
        variant: 'destructive'
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  // Update conversation status
  const updateStatus = async (conversationId: string, status: 'active' | 'pending' | 'closed') => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev =>
        prev.map(c => c.id === conversationId ? { ...c, status } : c)
      );

      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => prev ? { ...prev, status } : null);
      }

      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة المحادثة'
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Subscribe to realtime updates
  useEffect(() => {
    const conversationsChannel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [loadConversations]);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation?.id) return;

    const messagesChannel = supabase
      .channel(`team-messages-${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.sender_type === 'customer') {
            setMessages(prev => {
              const exists = prev.some(m => m.id === newMessage.id);
              if (exists) return prev;
              return [...prev, newMessage];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [selectedConversation?.id]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
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
  };
};

// Get total unread count for badge
export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select('unread_count');

      if (!error && data) {
        const total = data.reduce((sum, c) => sum + (c.unread_count || 0), 0);
        setUnreadCount(total);
      }
    };

    fetchUnread();

    const channel = supabase
      .channel('unread-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return unreadCount;
};
