import React, { useState, useEffect } from 'react';
import { Server, Search, Users, Clock, ArrowRight, LogOut, AlertCircle, RefreshCw } from 'lucide-react';

interface ServerData {
  identifier: string;
  name: string;
}

interface ServerSelectorProps {
  apiKey: string;
  onServerSelect: (serverId: string, serverName: string) => void;
  onLogout: () => void;
}

export default function ServerSelector({ apiKey, onServerSelect, onLogout }: ServerSelectorProps) {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [filteredServers, setFilteredServers] = useState<ServerData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://console.exluhost.my.id/api/client', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'Application/vnd.pterodactyl.v1+json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch servers');
      }

      const data = await response.json();
      
      // Extract server data from the response
      const serverList = data.data || [];
      const extractedServers = serverList.map((server: any) => ({
        identifier: server.attributes?.identifier || server.identifier,
        name: server.attributes?.name || server.name
      }));
      
      setServers(extractedServers);
      setFilteredServers(extractedServers);
    } catch (error) {
      console.error('Error fetching servers:', error);
      setError('Failed to load servers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, [apiKey]);

  useEffect(() => {
    const filtered = servers.filter(server =>
      server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      server.identifier.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServers(filtered);
  }, [searchTerm, servers]);

  const handleServerClick = (server: ServerData) => {
    onServerSelect(server.identifier, server.name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25">
            <RefreshCw className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Loading Servers</h2>
          <p className="text-slate-400">Fetching your server list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 bg-red-500/20 rounded-2xl mb-6">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Error Loading Servers</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchServers}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
            <button
              onClick={onLogout}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Server className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Select Your Server
                  </h1>
                  <p className="text-slate-400 text-lg">Choose a server to manage its version</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search servers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm w-full sm:w-80 transition-all"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{filteredServers.length} servers available</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 rounded-lg text-slate-300 hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Server Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServers.map((server, index) => (
            <div
              key={server.identifier}
              onClick={() => handleServerClick(server)}
              className="group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-slate-600/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative p-6 h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-slate-400 font-mono bg-slate-700/50 px-2 py-1 rounded">
                    {server.identifier}
                  </div>
                </div>
                
                {/* Title */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors line-clamp-2">
                    {server.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Click to manage this server's version
                  </p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Ready to configure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Select</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              
              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {filteredServers.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <Server className="relative w-20 h-20 text-slate-600 mx-auto mb-6" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-400 mb-3">No servers found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search terms to find your servers."
                : "No servers are available in your account."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
