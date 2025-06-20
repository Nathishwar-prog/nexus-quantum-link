
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Edit3, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  neural_sync_level: number;
  quantum_access_level: number;
  created_at: string;
}

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
      } else {
        setProfile(data);
        setEditForm({
          display_name: data.display_name || '',
          bio: data.bio || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name,
          bio: editForm.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: "Failed to update neural profile",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Neural profile successfully synchronized",
        });
        setProfile({
          ...profile,
          display_name: editForm.display_name,
          bio: editForm.bio
        });
        setIsEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      display_name: profile?.display_name || '',
      bio: profile?.bio || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-text-color/60 font-cyber">Neural profile not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="glass-dark rounded-xl p-6 border border-neon-blue/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.display_name}
                    onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                    className="bg-dark-bg/50 border-neon-blue/30"
                    placeholder="Display Name"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-quantum font-bold text-neon-blue">
                    {profile.display_name}
                  </h2>
                  <p className="text-text-color/60 font-cyber">@{profile.username}</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/30"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="ghost"
                  className="text-text-color/60 hover:text-text-color"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="ghost"
                className="text-neon-blue hover:text-neon-purple"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-4">
          <h3 className="text-sm font-cyber text-neon-blue mb-2">Neural Profile</h3>
          {isEditing ? (
            <Textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="bg-dark-bg/50 border-neon-blue/30 resize-none"
              placeholder="Describe your neural signature..."
              rows={3}
            />
          ) : (
            <p className="text-text-color/80 font-cyber text-sm">
              {profile.bio || 'No neural profile configured'}
            </p>
          )}
        </div>
      </div>

      {/* Neural Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-dark rounded-xl p-4 border border-neon-blue/20">
          <h4 className="font-cyber font-bold mb-2 text-neon-green">Neural Sync Level</h4>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-dark-bg/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-neon-green to-neon-blue h-full rounded-full transition-all duration-500"
                style={{ width: `${profile.neural_sync_level}%` }}
              />
            </div>
            <span className="text-sm font-mono text-neon-green">
              {profile.neural_sync_level}%
            </span>
          </div>
        </div>

        <div className="glass-dark rounded-xl p-4 border border-neon-blue/20">
          <h4 className="font-cyber font-bold mb-2 text-neon-purple">Quantum Access</h4>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-quantum text-neon-purple">
              {profile.quantum_access_level}
            </span>
            <span className="text-sm text-text-color/60 font-cyber">
              Security Clearance
            </span>
          </div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="glass-dark rounded-xl p-4 border border-neon-blue/20">
        <h4 className="font-cyber font-bold mb-3 text-neon-blue">Connection Status</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-color/60">First Neural Link</span>
            <span className="text-neon-blue font-mono">
              {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-color/60">Network ID</span>
            <span className="text-neon-green font-mono">
              {profile.id.slice(0, 8)}...{profile.id.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-color/60">Status</span>
            <span className="text-neon-green flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              Neural Link Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
