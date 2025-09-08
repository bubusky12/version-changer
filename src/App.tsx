import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ServerSelector from './components/ServerSelector';
import VersionSelector from './components/VersionSelector';

interface UserSession {
  apiKey: string;
  serverId?: string;
  serverName?: string;
}

type AppState = 'login' | 'server-select' | 'version-select';

const STORAGE_KEYS = {
  API_KEY: 'pterodactyl_api_key',
  SERVER_ID: 'pterodactyl_server_id',
  SERVER_NAME: 'pterodactyl_server_name',
  APP_STATE: 'pterodactyl_app_state'
};

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved session on app start
  useEffect(() => {
    const loadSavedSession = () => {
      try {
        const savedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
        const savedServerId = localStorage.getItem(STORAGE_KEYS.SERVER_ID);
        const savedServerName = localStorage.getItem(STORAGE_KEYS.SERVER_NAME);
        const savedAppState = localStorage.getItem(STORAGE_KEYS.APP_STATE) as AppState;

        if (savedApiKey) {
          const sessionData: UserSession = { apiKey: savedApiKey };
          
          if (savedServerId && savedServerName) {
            sessionData.serverId = savedServerId;
            sessionData.serverName = savedServerName;
          }
          
          setSession(sessionData);
          setAppState(savedAppState && ['server-select', 'version-select'].includes(savedAppState) ? savedAppState : 'server-select');
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        localStorage.removeItem(STORAGE_KEYS.SERVER_ID);
        localStorage.removeItem(STORAGE_KEYS.SERVER_NAME);
        localStorage.removeItem(STORAGE_KEYS.APP_STATE);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedSession();
  }, []);

  const handleLogin = (apiKey: string) => {
    const newSession = { apiKey };
    setSession(newSession);
    setAppState('server-select');
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    localStorage.setItem(STORAGE_KEYS.APP_STATE, 'server-select');
  };

  const handleServerSelect = (serverId: string, serverName: string) => {
    const updatedSession = session ? { ...session, serverId, serverName } : null;
    setSession(updatedSession);
    setAppState('version-select');
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.SERVER_ID, serverId);
    localStorage.setItem(STORAGE_KEYS.SERVER_NAME, serverName);
    localStorage.setItem(STORAGE_KEYS.APP_STATE, 'version-select');
  };

  const handleLogout = () => {
    setSession(null);
    setAppState('login');
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    localStorage.removeItem(STORAGE_KEYS.SERVER_ID);
    localStorage.removeItem(STORAGE_KEYS.SERVER_NAME);
    localStorage.removeItem(STORAGE_KEYS.APP_STATE);
  };

  const handleBackToServerSelect = () => {
    // Clear server selection but keep API key
    setSession(prev => prev ? { apiKey: prev.apiKey } : null);
    setAppState('server-select');
    
    // Update localStorage
    localStorage.removeItem(STORAGE_KEYS.SERVER_ID);
    localStorage.removeItem(STORAGE_KEYS.SERVER_NAME);
    localStorage.setItem(STORAGE_KEYS.APP_STATE, 'server-select');
  };

  // Show loading screen while checking for saved session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative text-center">
          <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
            Loading Pterodactyl Manager
          </h2>
          <p className="text-slate-400">Checking for saved session...</p>
        </div>
      </div>
    );
  }

  if (appState === 'login' || !session) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (appState === 'server-select') {
    return (
      <ServerSelector 
        apiKey={session.apiKey}
        onServerSelect={handleServerSelect}
        onLogout={handleLogout}
      />
    );
  }

  if (appState === 'version-select' && session.serverId) {
    return (
      <VersionSelector 
        serverId={session.serverId} 
        serverName={session.serverName || 'Unknown Server'}
        apiKey={session.apiKey} 
        onLogout={handleLogout}
        onBackToServerSelect={handleBackToServerSelect}
      />
    );
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App;
