
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';
import { loadUserProfiles } from '@/utils/profileUtils';

interface UseRealtimeSubscriptionsProps {
  roomId: string;
  userId: string | undefined;
  addMessage: (message: Message) => void;
  reloadUsers: () => Promise<void>;
}

export const useRealtimeSubscriptions = ({ 
  roomId, 
  userId, 
  addMessage, 
  reloadUsers 
}: UseRealtimeSubscriptionsProps) => {
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up real-time subscriptions for user:', userId);

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
          
          const profilesData = await loadUserProfiles([payload.new.user_id]);
          const profile = profilesData?.[0];

          const newMessage: Message = {
            id: payload.new.id,
            content: payload.new.content,
            user_id: payload.new.user_id,
            room_id: payload.new.room_id,
            created_at: payload.new.created_at,
            profiles: profile ? {
              username: profile.username,
              display_name: profile.display_name
            } : null
          };

          console.log('Message processed with profile:', newMessage);
          addMessage(newMessage);
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
          await reloadUsers();
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
  }, [userId, roomId, addMessage, reloadUsers]);
};
