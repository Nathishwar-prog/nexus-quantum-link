
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserPresence } from '@/types/chat';
import { loadUserProfiles } from '@/utils/profileUtils';

export const useUserPresence = (roomId: string, userId: string | undefined) => {
  const [users, setUsers] = useState<UserPresence[]>([]);

  // Load online users
  useEffect(() => {
    if (!userId) return;

    const loadUsers = async () => {
      console.log('Loading users for room:', roomId);
      
      const { data: presenceData, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('room_id', roomId)
        .eq('status', 'online');

      if (error) {
        console.error('Error loading users:', error);
        return;
      }

      const userIds = presenceData?.map(p => p.user_id) || [];
      const profilesData = await loadUserProfiles(userIds);

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
  }, [userId, roomId]);

  const reloadUsers = async () => {
    console.log('Reloading users for room:', roomId);
    
    const { data: presenceData, error } = await supabase
      .from('user_presence')
      .select('*')
      .eq('room_id', roomId)
      .eq('status', 'online');

    if (!error && presenceData) {
      const userIds = presenceData.map(p => p.user_id);
      const profilesData = await loadUserProfiles(userIds);

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
  };

  return {
    users,
    reloadUsers
  };
};
