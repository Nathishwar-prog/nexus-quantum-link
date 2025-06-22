
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

  // Load initial messages with profile data
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      console.log('Loading messages for room:', roomId);
      
      // First load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        toast({
          title: "Connection Error",
          description: "Failed to load chat history",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Load profiles for the users in messages
      const userIds = [...new Set(messagesData?.map(msg => msg.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', userIds);

      // Combine messages with profiles
      const messagesWithProfiles = messagesData?.map(msg => {
        const profile = profilesData?.find(p => p.id === msg.user_id);
        return {
          ...msg,
          profiles: profile ? {
            username: profile.username,
            display_name: profile.display_name
          } : null
        };
      }) || [];

      console.log('Messages loaded with profiles:', messagesWithProfiles);
      setMessages(messagesWithProfiles);
      setLoading(false);
    };

    loadMessages();
  }, [user, roomId, toast]);

  // Load online users with profile data
  useEffect(() => {
    if (!user) return;

    const loadUsers = async () => {
      console.log('Loading users for room:', roomId);
      
      // Load presence data
      const { data: presenceData, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('room_id', roomId)
        .eq('status', 'online');

      if (error) {
        console.error('Error loading users:', error);
        return;
      }

      // Load profiles for online users
      const userIds = presenceData?.map(p => p.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', userIds);

      // Combine presence with profiles
      const usersWithProfiles = presenceData?.map(presence => {
        const profile = profilesData?.find(p => p.id === presence.user_id);
        return {
          ...presence,
          profiles: profile ? {
            username: profile.username,
            display_name: profile.display_name
          } : null
        };
      }) || [];

      console.log('Users loaded with profiles:', usersWithProfiles);
      setUsers(usersWithProfiles);
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
          
          // Load profile for the message sender
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username, display_name')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: Message = {
            id: payload.new.id,
            content: payload.new.content,
            user_id: payload.new.user_id,
            room_id: payload.new.room_id,
            created_at: payload.new.created_at,
            profiles: profileData ? {
              username: profileData.username,
              display_name: profileData.display_name
            } : null
          };

          console.log('Message processed with profile:', newMessage);
          setMessages(prev => [...prev, newMessage]);
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
          const { data: presenceData, error } = await supabase
            .from('user_presence')
            .select('*')
            .eq('room_id', roomId)
            .eq('status', 'online');

          if (!error && presenceData) {
            // Load profiles for online users
            const userIds = presenceData.map(p => p.user_id);
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, username, display_name')
              .in('id', userIds);

            const usersWithProfiles = presenceData.map(presence => {
              const profile = profilesData?.find(p => p.id === presence.user_id);
              return {
                ...presence,
                profiles: profile ? {
                  username: profile.username,
                  display_name: profile.display_name
                } : null
              };
            });

            console.log('Users reloaded with profiles:', usersWithProfiles);
            setUsers(usersWithProfiles);
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
