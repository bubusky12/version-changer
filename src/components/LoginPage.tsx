import React, { useState } from 'react';
import { Server, Key, Shield, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (apiKey: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ apiKey?: string }>({});

  const validateApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      const response = await fetch('https://testing.exluhost.my.id/api/client', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('API validation error:', error);
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: { apiKey?: string } = {};
    
    if (!apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    } else if (apiKey.length < 10) {
      newErrors.apiKey = 'API Key must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    // Validate API key with Pterodactyl API
    const isValid = await validateApiKey(apiKey);
    
    if (isValid) {
      onLogin(apiKey);
    } else {
      setErrors({ apiKey: 'Invalid API key or unable to connect to server' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25">
            <Server className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
            Pterodactyl Login
          </h1>
          <p className="text-slate-400 text-lg">
            Masukan client key kamu untuk mengakses server kamu
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* API Key Input */}
              <div className="space-y-2">
                <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300">
                  API Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      if (errors.apiKey) setErrors(prev => ({ ...prev, apiKey: undefined }));
                    }}
                    placeholder="Enter your API key"
                    className={`w-full pl-12 pr-12 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all backdrop-blur-sm ${
                      errors.apiKey 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                        : 'border-slate-600/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {errors.apiKey && (
                    <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                  )}
                </div>
                {errors.apiKey && (
                  <p className="text-red-400 text-sm flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.apiKey}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Verifikasi API Key</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Notice */}
          <div className="px-8 py-6 bg-slate-800/30 border-t border-slate-700/50">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-slate-300 font-medium mb-1">Koneksi Aman</p>
                <p className="text-slate-400 leading-relaxed">
                  API kamu hanya digunakan untuk autentikasi dengan panel Pterodactyl. 
                  Jaga baik baik API KEY kamu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Butuh bantuan untuk menemukan API KEY kamu? 
            <a href="#" className="text-blue-400 hover:text-blue-300 ml-1 underline">
              Kontak kami di discord
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
