
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Zap } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        
        await signUp(email, password, {
          username,
          display_name: displayName
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-color flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 border border-neon-blue/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-quantum font-bold mb-2">
              {isLogin ? 'Neural Link Access' : 'NEXUS Registration'}
            </h1>
            <p className="text-text-color/60 font-cyber">
              {isLogin ? 'Connect to the quantum network' : 'Join the neural collective'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-cyber text-neon-blue mb-2">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="neural_agent_001"
                    className="bg-dark-bg/50 border-neon-blue/30 text-text-color"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-cyber text-neon-blue mb-2">
                    Display Name
                  </label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Neural Agent"
                    className="bg-dark-bg/50 border-neon-blue/30 text-text-color"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-cyber text-neon-blue mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@nexus.quantum"
                className="bg-dark-bg/50 border-neon-blue/30 text-text-color"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-cyber text-neon-blue mb-2">
                Neural Key
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-dark-bg/50 border-neon-blue/30 text-text-color pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-color/50 hover:text-neon-blue"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-cyber text-neon-blue mb-2">
                  Confirm Neural Key
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-dark-bg/50 border-neon-blue/30 text-text-color"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-neon-purple to-neon-blue hover:shadow-[0_5px_15px_rgba(0,243,255,0.3)] font-cyber font-bold tracking-wide"
            >
              {loading ? 'Establishing Link...' : (isLogin ? 'Connect to NEXUS' : 'Join Network')}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-neon-blue hover:text-neon-purple transition-colors font-cyber"
            >
              {isLogin ? 'Need access? Register here' : 'Already connected? Sign in'}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-neon-blue/20 text-center">
            <p className="text-xs text-text-color/40 font-cyber">
              🔒 Quantum-encrypted neural interface<br/>
              🌐 End-to-end synaptic protection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
