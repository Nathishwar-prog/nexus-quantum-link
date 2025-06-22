
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types/chat';
import { loadUserProfiles } from '@/utils/profileUtils';

export const useMessages = (roomId: string, userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load initial messages
  useEffect(() => {
    if (!userId) return;

    const loadMessages = async () => {
      console.log('Loading messages for room:', roomId);
      
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

      const userIds = [...new Set(messagesData?.map(msg => msg.user_id) || [])];
      const profilesData = await loadUserProfiles(userIds);

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
  }, [userId, roomId, toast]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return {
    messages,
    loading,
    addMessage,
    setMessages
  };
};
