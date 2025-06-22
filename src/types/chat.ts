
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
  room_id: string;
  profiles?: {
    username: string | null;
    display_name: string | null;
  } | null;
}

export interface ChatHookReturn {
  messages: Message[];
  users: UserPresence[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
}
