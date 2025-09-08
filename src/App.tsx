import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import ServerSelector from './components/ServerSelector';
import VersionSelector from './components/VersionSelector';

interface UserSession {
  apiKey: string;
  serverId?: string;
  serverName?: string;
}

type AppState = 'login' | 'server-select' | 'version-select';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [session, setSession] = useState<UserSession | null>(null);

  const handleLogin = (apiKey: string) => {
    setSession({ apiKey });
    setAppState('server-select');
  };

  const handleServerSelect = (serverId: string, serverName: string) => {
    setSession(prev => prev ? { ...prev, serverId, serverName } : null);
    setAppState('version-select');
  };

  const handleLogout = () => {
    setSession(null);
    setAppState('login');
  };

  const handleBackToServerSelect = () => {
    setAppState('server-select');
  };

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