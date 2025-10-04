-- Create enquiries table for property inquiries
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chats table for communication
CREATE TABLE public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  property_owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for chat messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for enquiries
CREATE POLICY "Users can view their own enquiries" 
ON public.enquiries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enquiries" 
ON public.enquiries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Property owners can view enquiries for their properties"
ON public.enquiries
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = enquiries.property_id 
  AND properties.user_id = auth.uid()
));

CREATE POLICY "Property owners can update enquiries for their properties"
ON public.enquiries
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = enquiries.property_id 
  AND properties.user_id = auth.uid()
));

-- Create policies for chats
CREATE POLICY "Users can view their own chats" 
ON public.chats 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = property_owner_id);

CREATE POLICY "Users can create chats" 
ON public.chats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for messages
CREATE POLICY "Chat participants can view messages" 
ON public.messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.chats 
  WHERE chats.id = messages.chat_id 
  AND (chats.user_id = auth.uid() OR chats.property_owner_id = auth.uid())
));

CREATE POLICY "Chat participants can create messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id AND EXISTS (
  SELECT 1 FROM public.chats 
  WHERE chats.id = messages.chat_id 
  AND (chats.user_id = auth.uid() OR chats.property_owner_id = auth.uid())
));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chats_updated_at
BEFORE UPDATE ON public.chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();