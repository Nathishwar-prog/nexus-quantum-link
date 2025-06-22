
import { supabase } from '@/integrations/supabase/client';

export const loadUserProfiles = async (userIds: string[]) => {
  if (userIds.length === 0) return [];
  
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, username, display_name')
    .in('id', userIds);

  return profilesData;
};
