
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
    username: string | null;
    display_name: string | null;
  } | null;
}

export interface UserPresence {
  user_id: string;
  status: string;
  last_seen: string;
  profiles?: {
    username: string | null;
    display_name: string | null;
  } | null;
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
      console.log('Loading messages for room:', roomId);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          user_id,
          room_id,
          created_at,
          profiles!messages_user_id_fkey (
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
        console.log('Messages loaded:', data);
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
      console.log('Loading users for room:', roomId);
      
      const { data, error } = await supabase
        .from('user_presence')
        .select(`
          user_id,
          status,
          last_seen,
          profiles!user_presence_user_id_fkey (
            username,
            display_name
          )
        `)
        .eq('room_id', roomId)
        .eq('status', 'online');

      if (!error && data) {
        console.log('Users loaded:', data);
        setUsers(data);
      } else {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, [user, roomId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscriptions for user:', user.id);

    // Update presence
    const updatePresence = async () => {
      try {
        await supabase.rpc('update_user_presence', {
          p_room_id: roomId,
          p_status: 'online'
        });
        console.log('Presence updated successfully');
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };

    updatePresence();

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Fetch the message with profile data
          const { data, error } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              user_id,
              room_id,
              created_at,
              profiles!messages_user_id_fkey (
                username,
                display_name
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            console.log('Message with profile loaded:', data);
            setMessages(prev => [...prev, data]);
          } else {
            console.error('Error loading new message:', error);
          }
        }
      )
      .subscribe();

    // Subscribe to presence changes
    const presenceChannel = supabase
      .channel('presence-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `room_id=eq.${roomId}`
        },
        async () => {
          console.log('Presence changed, reloading users');
          
          // Reload users when presence changes
          const { data, error } = await supabase
            .from('user_presence')
            .select(`
              user_id,
              status,
              last_seen,
              profiles!user_presence_user_id_fkey (
                username,
                display_name
              )
            `)
            .eq('room_id', roomId)
            .eq('status', 'online');

          if (!error && data) {
            console.log('Users reloaded:', data);
            setUsers(data);
          } else {
            console.error('Error reloading users:', error);
          }
        }
      )
      .subscribe();

    // Update presence periodically
    const presenceInterval = setInterval(updatePresence, 30000);

    return () => {
      console.log('Cleaning up subscriptions');
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(presenceChannel);
      clearInterval(presenceInterval);
    };
  }, [user, roomId]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    console.log('Sending message:', content);

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
    } else {
      console.log('Message sent successfully');
    }
  };

  return {
    messages,
    users,
    loading,
    sendMessage
  };
};
