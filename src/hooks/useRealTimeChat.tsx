
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatHookReturn } from '@/types/chat';
import { useMessages } from './chat/useMessages';
import { useUserPresence } from './chat/useUserPresence';
import { useRealtimeSubscriptions } from './chat/useRealtimeSubscriptions';

export const useRealTimeChat = (roomId: string = '550e8400-e29b-41d4-a716-446655440000'): ChatHookReturn => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { messages, loading, addMessage } = useMessages(roomId, user?.id);
  const { users, reloadUsers } = useUserPresence(roomId, user?.id);
  
  useRealtimeSubscriptions({
    roomId,
    userId: user?.id,
    addMessage,
    reloadUsers
  });

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
