import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Heart } from 'lucide-react';

const Login = () => {
//   const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginMethod === 'email' && (!email || !password)) {
      toast.error('कृपया सभी फील्ड भरें / Please fill all fields');
      return;
    }
    if (loginMethod === 'phone' && (!phone || !password)) {
      toast.error('कृपया सभी फील्ड भरें / Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      // Mock login delay
      await new Promise((res) => setTimeout(res, 700));
      toast.success('लॉगिन सफल / Login successful!');
    //   navigate('/dashboard');
    } catch (err) {
      toast.error('लॉगिन असफल हुआ / Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 ">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg">

                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                अपने खाते में लॉगिन करें / Sign in to your account
              </p>
            </div>

        {/* Login method toggle */}
       <div className='border border-gray-300 rounded-md  p-5 shadow-lg shadow-gray-700'>
         <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-tl-lg rounded-bl-lg border ${
              loginMethod === 'email' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setLoginMethod('email')}
          >
            Email
          </button>
          <button
            className={`flex-1 py-2 rounded-tr-lg rounded-br-lg border-l ${
              loginMethod === 'phone' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
            onClick={() => setLoginMethod('phone')}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginMethod === 'email' && (
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {loginMethod === 'phone' && (
            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => toast.info('Password reset feature coming soon')}
            >
              पासवर्ड भूल गए? / Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            खाता नहीं है? / Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </p>
        </form>
       </div>
      </div>
    </div>
    </main>
    </div>
  );
};

export default Login;
