
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Message {
  id: string;
  content: string;
  user_id: string;
  room_id: string;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string;
  };
}

export interface UserPresence {
  user_id: string;
  status: string;
  last_seen: string;
  profiles?: {
    username: string;
    display_name: string;
  };
}

export const useRealTimeChat = (roomId: string = '550e8400-e29b-41d4-a716-446655440000') => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load initial messages
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            username,
            display_name
          )
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Connection Error",
          description: "Failed to load chat history",
          variant: "destructive"
        });
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    loadMessages();
  }, [user, roomId, toast]);

  // Load online users
  useEffect(() => {
    if (!user) return;

    const loadUsers = async () => {
      const { data, error } = await supabase
        .from('user_presence')
        .select(`
          *,
          profiles (
            username,
            display_name
          )
        `)
        .eq('room_id', roomId)
        .eq('status', 'online');

      if (!error && data) {
        setUsers(data);
      }
    };

    loadUsers();
  }, [user, roomId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Update presence
    const updatePresence = async () => {
      await supabase.rpc('update_user_presence', {
        p_room_id: roomId,
        p_status: 'online'
      });
    };

    updatePresence();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch the message with profile data
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              profiles (
                username,
                display_name
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    // Subscribe to presence changes
    const presenceChannel = supabase
      .channel('presence')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `room_id=eq.${roomId}`
        },
        async () => {
          // Reload users when presence changes
          const { data, error } = await supabase
            .from('user_presence')
            .select(`
              *,
              profiles (
                username,
                display_name
              )
            `)
            .eq('room_id', roomId)
            .eq('status', 'online');

          if (!error && data) {
            setUsers(data);
          }
        }
      )
      .subscribe();

    // Update presence periodically
    const presenceInterval = setInterval(updatePresence, 30000);

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(presenceChannel);
      clearInterval(presenceInterval);
    };
  }, [user, roomId]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        content: content.trim(),
        user_id: user.id,
        room_id: roomId
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: "Failed to send message to the neural network",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    users,
    loading,
    sendMessage
  };
};
