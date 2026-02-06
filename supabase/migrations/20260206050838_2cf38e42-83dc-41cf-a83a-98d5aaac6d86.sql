-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed')),
  assigned_to UUID REFERENCES auth.users(id),
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'team')),
  sender_id UUID REFERENCES auth.users(id),
  sender_name TEXT NOT NULL,
  content TEXT,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversations_customer_session ON public.conversations(customer_session_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
-- Team members can view all conversations
CREATE POLICY "Team can view all conversations"
ON public.conversations FOR SELECT
USING (public.is_staff(auth.uid()));

-- Team members can update conversations
CREATE POLICY "Team can update conversations"
ON public.conversations FOR UPDATE
USING (public.is_staff(auth.uid()));

-- Anyone can create a conversation (for customers)
CREATE POLICY "Anyone can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (true);

-- Customers can view their own conversations by session
CREATE POLICY "Customers can view own conversations"
ON public.conversations FOR SELECT
USING (customer_session_id = current_setting('app.customer_session_id', true));

-- RLS Policies for messages
-- Team can view all messages
CREATE POLICY "Team can view all messages"
ON public.messages FOR SELECT
USING (public.is_staff(auth.uid()));

-- Team can send messages
CREATE POLICY "Team can send messages"
ON public.messages FOR INSERT
WITH CHECK (public.is_staff(auth.uid()) AND sender_type = 'team');

-- Anyone can insert customer messages
CREATE POLICY "Customers can send messages"
ON public.messages FOR INSERT
WITH CHECK (sender_type = 'customer');

-- Customers can view messages in their conversations
CREATE POLICY "Customers can view own messages"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND c.customer_session_id = current_setting('app.customer_session_id', true)
  )
);

-- Team can update messages (mark as read)
CREATE POLICY "Team can update messages"
ON public.messages FOR UPDATE
USING (public.is_staff(auth.uid()));

-- Function to update conversation on new message
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    updated_at = now(),
    unread_count = CASE 
      WHEN NEW.sender_type = 'customer' THEN unread_count + 1 
      ELSE unread_count 
    END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for updating conversation
CREATE TRIGGER on_message_insert
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_on_message();

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Storage bucket for chat files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-files', 
  'chat-files', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed']
);

-- Storage policies
CREATE POLICY "Anyone can upload chat files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Anyone can view chat files"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-files');

CREATE POLICY "Team can delete chat files"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-files' AND public.is_staff(auth.uid()));