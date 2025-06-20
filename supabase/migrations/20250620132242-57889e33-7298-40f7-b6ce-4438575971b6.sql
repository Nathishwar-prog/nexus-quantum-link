
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  neural_sync_level INTEGER DEFAULT 0,
  quantum_access_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create chat rooms table
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  room_type TEXT NOT NULL DEFAULT 'public',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create user presence table
CREATE TABLE public.user_presence (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'online',
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, room_id)
);

-- Create system logs table
CREATE TABLE public.system_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Chat rooms policies
CREATE POLICY "Users can view public chat rooms" ON public.chat_rooms FOR SELECT USING (room_type = 'public');
CREATE POLICY "Users can create chat rooms" ON public.chat_rooms FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can view messages in accessible rooms" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_rooms 
    WHERE id = room_id AND room_type = 'public'
  )
);
CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User presence policies
CREATE POLICY "Users can view presence in accessible rooms" ON public.user_presence FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_rooms 
    WHERE id = room_id AND room_type = 'public'
  )
);
CREATE POLICY "Users can update own presence" ON public.user_presence FOR ALL USING (auth.uid() = user_id);

-- System logs policies
CREATE POLICY "Users can view own logs" ON public.system_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.system_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'display_name', 'Neural Agent')
  );
  
  -- Log user creation
  INSERT INTO public.system_logs (user_id, action, details)
  VALUES (
    new.id,
    'user_created',
    jsonb_build_object('email', new.email)
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user presence
CREATE OR REPLACE FUNCTION public.update_user_presence(
  p_room_id UUID,
  p_status TEXT DEFAULT 'online'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_presence (user_id, room_id, status, last_seen)
  VALUES (auth.uid(), p_room_id, p_status, NOW())
  ON CONFLICT (user_id, room_id)
  DO UPDATE SET
    status = EXCLUDED.status,
    last_seen = EXCLUDED.last_seen;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default chat room with proper UUID
INSERT INTO public.chat_rooms (id, name, description, room_type)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'NEXUS Central',
  'Main neural communication hub for all connected agents',
  'public'
);

-- Enable realtime for tables
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
